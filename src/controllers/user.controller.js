import { isValidObjectId } from "mongoose";
import { config } from 'dotenv';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken'
import { User } from "../models/user.model.js";
import registerValidation from '../helpers/valiadation.js'
import { errorHandler } from '../helpers/errorHandle.js';

config()

class UserController {
  constructor() {}

  async getAllUsers(req, res) {
    const allUsers = await User.find();

    res.send({
      message: "Success",
      results: allUsers.length,
      data: allUsers,
    });
  }

  async createUser(req, res) {
    const { first_name, last_name, phone,password, username } = req.body;

    const newUser = new User({
      first_name: first_name, 
      last_name: last_name,
      phone: phone,
      password:password,
      username:username,
    });

    await newUser.save();

    res.status(201).send({
      message: "success",
      data: newUser,
    });
  }

  async updateUser(req, res) {
    const { first_name, last_name, phone,password, username } = req.body;

    const userId = req.params?.userId;

    if (!isValidObjectId(userId)) {
      return res.status(404).send({
        message: "Iltimos Object ID jo'nating",
      });
    }

    const foundedUser = await User.findById(userId);

    if (!foundedUser) {
      return res.status(404).send({
        message: "User topilmadi",
      });
    }


    await User.updateOne(
      { _id: userId },
      {
        $set: {
          first_name: first_name, 
          last_name: last_name,
          phone: phone,
          username:username,
        },
      }
    );
    res.status(200).send({
      message: "success",
    });
  }

  async deleteUser(req, res) {
    const userId = req.params?.userId;
  
    if (!isValidObjectId(userId)) {
      return res.status(404).send({
        message: "Iltimos Object ID jonating",
      });
    }
  
    const foundedUser = await User.findById(userId);  
  
    if (!foundedUser) {
      return res.status(404).send({
        message: "User topilmadi",
      });
    }
  
    await User.deleteOne({ _id: userId });
  
    res.status(200).send({
      message: "success",
    });
  }


  async signin(req,res){
    try{

        const {username,password} = req.body;
        const user = await User.findOne({username})

        if(!user){
            return res.status(400).send({
                message:"Username or password incorecct!!"
            })
        }

        const check_password = await  compare(password,user.password)

        if(!check_password){
            return res.status(400).send({
                message:"Username or password incorecct!!"
            })
        }
        
        const payload = {id:user._id, first_name:user.first_name}

        const token = jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:process.env.JWT_EXPIRE
        });

        return res.status(200).send({
            message:"User signed in successfully Uraaaaa",
            data:user,
            token
        })
    }
    catch(error){
        errorHandler(error,res)
    }
}


}

export default new UserController();
