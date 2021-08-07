import { BaseController } from '../../../src/controller/commmon';
import { Objectdata } from '../baseController';

export abstract class FileControllerType extends BaseController {
  /**
   * @deprecated 文件上传的接口
   */
  public abstract uploadfile(uploadData: { name?: string; hash?: string });

  /**
   * @deprecated 文件合并
   */
  public abstract mergeFile(fileData: {
    ext: string;
    size: string;
    hash: string;
  }): Promise<Objectdata>;

  public abstract validateFile(validate: {
    ext: string;
    hash: unknown;
  }): Promise<Objectdata>;
}
