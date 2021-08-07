export type Objectdata = { [key: string]: unknown };

export abstract class BaseControlleType {

  public abstract success?(data: Objectdata): { code: number; data: Objectdata };

  public abstract message(message: string): { code: number; message: string };

  public abstract error(message: string, code: number, errors: Objectdata): { code: number, message: string, errors: Objectdata }
}
