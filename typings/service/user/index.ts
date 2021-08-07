import { Objectdata } from '../../controller/baseController';
import { UserData } from '../../collaborate/user';

export abstract class UserServeData {
  /**
   * @deprecated 数据库验证用户名
   */
  public abstract checkEmail(email: string): Promise<Objectdata>;

  /**
   * @deprecated 数据库新增函数
   */
  public abstract register(data: UserData): Promise<Objectdata>;

  /**
   * @deprecated 数据库查询用户
   * @param object
   */
  public abstract checkUser(object: {
    [key: string]: any;
  }): Promise<Objectdata>;
}
