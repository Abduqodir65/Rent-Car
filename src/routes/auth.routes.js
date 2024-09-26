import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import { loginSchema } from "../dtos/login.dto.js";
import ValidationMiddleware from "../middelware/valiadation.js";
import { forgotPasswordDto } from "../dtos/forgot-password.dto.js";
import { resetPasswordDto } from "../dtos/reset-password.dto.js";
import authController from "../controllers/auth.controller.js";
import { generateOTPDto } from "../dtos/generate-otp.dto.js";
import {verifyOTPDto} from "../dtos/verify-otp.dto.js"

const authRoutes = Router();

authRoutes
  .post("/login", ValidationMiddleware(loginSchema), AuthController.signin)
  .post(
    "/forgot-password",
    ValidationMiddleware(forgotPasswordDto),
    AuthController.forgotPassword
  )
  .post(
    "/generate-otp",
    ValidationMiddleware(generateOTPDto),
    authController.generateOtp
  )
  .post(
    "/verify-otp",
    ValidationMiddleware(verifyOTPDto),
    authController.verifyOtp
  )
  .post(
    "/reset-password/:token",
    ValidationMiddleware(resetPasswordDto),
    AuthController.resetPassword
  );

export default authRoutes;