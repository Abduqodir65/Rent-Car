import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/user.model.js";
import { NotFoundException } from "../exceptions/not-found.exception.js";
import { ConflictException } from "../exceptions/conflic.exception.js";
import { signToken } from "../helpers/jwt.helper.js";
import { sendMail } from "../utils/send-email.utils.js";
import appConfig from "../config/app.config.js";
import passwordResetConfig from "../config/password-reset.config.js";
import bcryptConfig from "../config/bcrypt.config.js";
import generateOTP from "../utils/generate-otp.utils.js";
import { Otp } from "../models/otp.model.js";

class AuthController {
  #_userModel;
  #_otpModel;


  constructor() {
    this.#_userModel = User;
    this.#_otpModel = Otp;
  }

  signin = async (req, res, next) => {
    try {
      const foundedUser = await this.#_userModel.findOne({
        full_name: req.body.full_name,
      });
      if (!foundedUser) {
        throw new NotFoundException("User not found");
      }
      const result = await bcrypt.compare(
        req.body.password,
        foundedUser.hashed_password
      );

      if (!result) {
        return res.status(409).send({
          message: "Invalid password or full_name",
        });
      }

      const accessToken = signToken({
        id: foundedUser.id,
        role: foundedUser.role,
      });

      res.send({
        message: "success",
        token: accessToken,
      });


    } catch (error) {
      next(error);
    }
  };

  generateOtp = async (req, res, next) => {
    try {
      const { email } = req.body;
      
      const otpCode = generateOTP();

      const verifyText = crypto.randomBytes(64).toString("hex");

      await this.#_otpModel.create({
        email,
        verifyText,
        code: otpCode,
      });

      await sendMail({
        to: email,
        subject: "Verification code for LMS",
        html: `
        <h2>Sizning verifikatsiya kodingiz:</h2>
        <input type="text" disabled value='${otpCode}'/>
        `,
      });

      res.send({
        verifyText,
      });
    } catch (error) {
      next(error);
    }
  };


  verifyOtp = async (req, res, next) => {
    try {
      const { code, verifyText } = req.body;

      const foundedOtp = await this.#_otpModel.findOne({ code, verifyText });

      if (!foundedOtp) {
        throw new ConflictException("Your OTP is already expired or used");
      }

      await this.#_otpModel.findByIdAndDelete(foundedOtp.id);

      res.send({
        user: {
          email: foundedOtp.email,
        },
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req, res, next) => {
    try {
      const { password } = req.body;
      const token = req.params.token;
      const foundedUser = await this.#_userModel.findOne({
        passwordResetToken: token,
      });
      if (!foundedUser) {
        throw new NotFoundException("User not found");
      }
      if (foundedUser.passwordResetTokenExpireTime - Date.now() < 0) {
        throw new ConflictException("Password reset time already expired");
      }
      const hashedPass = await bcrypt.hash(password, bcryptConfig.rounds);

      await this.#_userModel.findByIdAndUpdate(foundedUser.id, {
        password: hashedPass,
        passwordResetToken: null,
        passwordResetTokenExpireTime: null,
      });
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req, res, next) => {
    try {
      const { email } = req.body;
      const foundedUser = await this.#_userModel.findOne({ email });
      
      if (!foundedUser) {
        throw new NotFoundException("User not found");
      }
      const randomText = crypto.randomBytes(32).toString("hex");
      const passwordResetUrl = `${req.protocol}://${req.host}:${appConfig.port}/reset-password/${randomText}`;
      await sendMail({
        html: `<a href="${passwordResetUrl}">Click here</a>`,
        to: foundedUser.email,
        subject: "Click link below to reset password",
      });
      await this.#_userModel.findByIdAndUpdate(foundedUser.id, {
        passwordResetToken: randomText,
        passwordResetTokenExpireTime:
          Date.now() + Number(passwordResetConfig.expireTime) * 1000,
      });
      res.render("forgot-password", {
        text: "Email jo'natildi. Emailingizni tekshiring.",
      });
    } catch (error) {
      next(error);
    }
  };

  signup = async (req, res) => {
    res.send("ok");
  };
}

export default new AuthController();
