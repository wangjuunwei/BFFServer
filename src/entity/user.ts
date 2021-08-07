import { prop, modelOptions } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { timestamps: true } })
export class User {
  @prop({ select: false })
  public __v: number;

  @prop()
  public nickName: string;

  @prop()
  public email: string;

  @prop()
  captcha: string;

  @prop({ select: false })
  passwd: string;
}
