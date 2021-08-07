import { Rule, RuleType } from '@midwayjs/decorator';

export class RegisterDTO {
  @Rule(RuleType.string().required())
  captcha: string;

  @Rule(RuleType.string().required())
  nickName: string;

  @Rule(RuleType.string().email())
  email: string;

  @Rule(RuleType.string().max(60))
  passwd: string;
}

export class LoginDTO {
  @Rule(RuleType.string().required())
  captcha: string;

  @Rule(RuleType.string().required().email())
  email: string;

  @Rule(RuleType.string().required().max(60))
  passwd: string;
}
