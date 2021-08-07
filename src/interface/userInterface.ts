export interface CommonReturn {
  success: boolean;
  message: string;
}

export interface PicToken extends CommonReturn {
  data: {
    captcha: string;
  };
}
