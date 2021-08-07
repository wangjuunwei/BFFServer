import { Provide, App } from '@midwayjs/decorator';
import { IWebMiddleware, IMidwayWebNext } from '@midwayjs/web';
import { Context, Application } from 'egg';

const jwt = require('jsonwebtoken');

@Provide()
export class JwtAuthor implements IWebMiddleware {
  @App()
  app: Application;

  resolve() {
    return async (ctx: Context, next: IMidwayWebNext) => {
      if (!ctx.request.header.authorization) {
        ctx.body = { code: -2, message: '用户信息异常' };
        return;
      }

      const token = ctx.request.header.authorization.replace('Bearer ', '');
      try {
        const ret = jwt.verify(token, this.app.config.jwt.secret);

        console.log('jwt解析结果', ret);
        ctx.state._id = ret._id;

        ctx.state.email = ret.email;
        // 执行下一个 Web 中间件，最后执行到控制器
        await next();
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          ctx.body = { code: -666, message: '登录过期了' };
        } else {
          ctx.body = { code: -2, message: '用户信息出错' };
        }
      }
      // 控制器之后执行的逻辑
    };
  }
}
