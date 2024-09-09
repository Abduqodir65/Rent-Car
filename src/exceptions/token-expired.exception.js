import { BaseException } from "./base.exception.js";

export class TokenExpiredException extends BaseException {
  constructor(message) {
    super();
    this.statusCode = 499;
    this.name = "Token Expired Exception";
    this.message = message;
  }
}