import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import {
  ConflictError,
  NotFoundError,
  UnAuthError,
  ValidationError,
} from "../errors";

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .orFail()
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      next(err);
    });
};

export const getUsersById = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  User.findById(req.user?._id)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      next(err);
    });
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, about, avatar, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const { password: _, ...userResponse } = newUser.toObject();

    res.status(201).json(userResponse);
  } catch (err: any) {
    if (err.code === 11000) {
      return next(new ConflictError("Конфликт"));
    }
    if (err.name === "ValidationError") {
      return next(new ValidationError("ValidationError"));
    }
    next(err);
  }
};

export const updateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user?._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new ValidationError("ValidationError"));
      }
      next(err);
    });
};

export const updateAvatar = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user?._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new ValidationError("ValidationError"));
      }
      next(err);
    });
};

const JWT_EXPIRES_IN = "7d";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new UnAuthError("Неправильные почта или пароль"));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(new UnAuthError("Неправильные почта или пароль"));
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Успешный вход", token });
  } catch (err: any) {
    next(err);
  }
};

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

export const getCurrentUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return next(new NotFoundError("Пользователь не найден"));
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};
