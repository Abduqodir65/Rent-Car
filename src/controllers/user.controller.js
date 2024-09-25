import { isValidObjectId } from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import ApiFeature from "../utils/api-feature.utils.js";
import { BadRequestException } from "../exceptions/bad-request.exception.js";
import bcryptConfig from "../config/bcrypt.config.js";
import { ConflictException } from "../exceptions/conflic.exception.js";

class UserController {
  #_userModel;

  constructor() {
    this.#_userModel = User;
  }

  getAllUsers = async (req, res, next) => {
    try {
      const query = { ...req.query };

      const allResultsCount = await new ApiFeature(
        this.#_userModel.find(),
        query
      )
        .filter()
        .limitFields()
        .getQuery()
        .countDocuments();

      const allFilteredUsers = await new ApiFeature(
        this.#_userModel.find(),
        query
      )
        .filter()
        .limitFields()
        .paginate()
        .getQuery()
        .select("-hashed_password"); 

      res.send({
        message: "success",
        page: req.query?.page || 0,
        limit: req.query?.limit || 10,
        results: allResultsCount,
        data: allFilteredUsers,
      });
    } catch (error) {
      next(error);
    }
  };

  createUser = async (req, res, next) => {
    try {
      if (req.role === "admin") {
        if (req.body.role === "admin" || req.body.role === "super-admin") {
          throw new ConflictException(
            "You are not allowed to create admin or super-admin users"
          );
        }
      }
      
      const hashedPass = await bcrypt.hash(req.body.hashed_password, bcryptConfig.rounds);

      await this.#_userModel.create({
        ...req.body,
        hashed_password: hashedPass,
      });

      res.status(201).send({
        message: "User created successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { full_name, phone_number, email, hashed_password, address } = req.body;

      let newPasswordHash = undefined;

      if (hashed_password) {
        newPasswordHash = await bcrypt.hash(hashed_password, bcryptConfig.rounds);
      }

      this.#_checkObjectId(userId);

      await this.#_userModel.findByIdAndUpdate(userId, {
        full_name,
        phone_number,
        email,
        hashed_password: newPasswordHash,
        address,
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req, res, next) => {
    try {
      const { userId } = req.params;

      this.#_checkObjectId(userId);

      await this.#_userModel.findByIdAndDelete(userId);

      res.send({
        message: "User successfully deleted",
      });
    } catch (error) {
      next(error);
    }
  };

  #_checkObjectId = (id) => {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Given ${id} is not a valid ObjectID`);
    }
  };
}

export default new UserController();
