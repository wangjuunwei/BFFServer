import {
  Inject,
  Controller,
  Provide,
  Post,
  ALL,
  Body,
  Validate,
  Get,
  Config,
} from '@midwayjs/decorator';

const md5 = require('md5');
const jwt = require('jsonwebtoken');
// 文件写入
import { Context } from 'egg';
import { RegisterDTO, LoginDTO } from '../../dto';

const svgCaptcha = require('svg-captcha');
import { UserControllerType } from '../../../typings/controller/user';
import { Objectdata } from '../../../typings/controller/baseController';
import { UserService } from '../../service/user';

const HashSalt = ':TESTINIT@good!@123';

@Provide()
@Controller('/user')
export class UserController extends UserControllerType {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Config('jwt')
  jwtConfig;

  @Config('UPLOAD_DIR')
  uploadConfig;

  @Post('/register')
  @Validate()
  async register(@Body(ALL) registter: RegisterDTO): Promise<Objectdata> {
    const { captcha, email, nickName, passwd } = registter;

    if (!this.handleCheckCaptch(captcha))
      return this.error('验证码错误', -1, {});

    const isRegist = await this.userService.checkEmail(email);
    console.log('isRegist===', isRegist);
    if (isRegist) return this.error('用户已经注册过', -1, {});

    const result = await this.userService.register({
      email,
      nickName,
      passwd: md5(passwd + HashSalt),
    });

    try {
      this.handleCheckRegist(result);
      return this.message('注册成功');
    } catch (e) {
      return this.error('注册失败', -1, e);
    }
  }

  @Get('/captcha')
  async captcha(): Promise<Objectdata> {
    const captch = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 32,
      noise: 3,
    });

    console.log('captch.text===', captch.text);
    this.ctx.session.captcha = captch.text;
    this.ctx.response.type = 'image/svg+xml';
    return this.success({ captcha: captch.data });
  }

  @Post('/login')
  @Validate()
  async login(@Body(ALL) loginData: LoginDTO): Promise<Objectdata> {
    const { email, captcha, passwd } = loginData;
    if (!this.handleCheckCaptch(captcha))
      return this.error('验证码错误', -1, {});

    const user = await this.userService.checkUser({
      email,
      passwd: md5(passwd + HashSalt),
    });
    if (!user) return this.error('登陆失败,用户名称密码错误');
    const token = jwt.sign({ _id: user._id, email }, this.jwtConfig.secret, {
      expiresIn: '1h',
    });
    return this.success({ token, email, nickname: user.nickName });
  }

  @Post('/info', { middleware: ['jwtAuthor'] })
  @Validate()
  async info(): Promise<Objectdata> {
    const { email } = this.ctx.state;
    const userinfo = await this.userService.checkEmail(email);
    if (!userinfo) this.error('获取用户信息失败');
    return this.success(userinfo);
  }

  handleCheckCaptch(captcha: string): boolean {
    return captcha.toUpperCase() === this.ctx.session.captcha.toUpperCase();
  }

  handleCheckRegist(result: { _id: string }): Objectdata {
    if (!(result && result._id)) throw new Error('注册失败');
    return result;
  }
}
