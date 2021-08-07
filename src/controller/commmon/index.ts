import { Controller } from '@midwayjs/decorator';
import {
  BaseControlleType,
  Objectdata,
} from '../../../typings/controller/baseController';

@Controller()
export class BaseController extends BaseControlleType {
  success(data: Objectdata): { code: number; data: Objectdata } {
    return { code: 0, data };
  }

  message(message: string): { code: number; message: string } {
    return { code: 0, message };
  }

  error(
    message: string,
    code = -1,
    errors = {}
  ): { code: number; message: string; errors: any } {
    return { code, errors, message };
  }
}
