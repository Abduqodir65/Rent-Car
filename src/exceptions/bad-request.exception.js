import { BaseException } from "./base.exception.js";

export class BadRequestException extends BaseException {
  constructor(message) {
    super();
    this.statusCode = 400;
    this.name = "Bad Request Exception";
    this.message = message;
  }
}