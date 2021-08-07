import { BaseController } from '../../../src/controller/commmon';
import { Objectdata } from '../baseController';
import { UserData, LoginData } from '../../collaborate/user';

export abstract class UserControllerType extends BaseController {
  /**
   * @deprecated 注册函数
   * @param data
   */
  public abstract register(data: UserData): Promise<Objectdata>;

  /**
   * @deprecated 获取验证码函数
   */
  public abstract captcha(): Promise<Objectdata>;

  /**
   * @deprecated 用户登陆函数
   * @param data
   */
  public abstract login(data: LoginData): Promise<Objectdata>;

  /**
   * @deprecated 获取当前用户的信息
   */
  public abstract info(): Promise<Objectdata>;

  /**
   * @deprecated 判断验证码
   */
  public abstract handleCheckCaptch(captcha: string): boolean;

  /**
   * @deprecated 判断是否注册成功
   */
  public abstract handleCheckRegist(result: { _id: string }): Objectdata;
}
