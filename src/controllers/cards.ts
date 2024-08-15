import { NextFunction, Request, Response } from "express";
import Card from "../models/card";
import { ForbiddenError, NotFoundError, ValidationError } from "../errors";

export const getCards = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cards = await Card.find().populate("owner");
    res.status(200).json(cards);
  } catch (err) {
    next(err);
  }
};

export const createCard = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, link } = req.body;
    const owner = req.user?._id;

    const newCard = new Card({ name, link, owner });
    await newCard.save();

    res.status(201).json(newCard);
  } catch (err: any) {
    if (err.name === "ValidationError") {
      return next(
        new ValidationError(
          "Переданы некорректные данные при создании карточки"
        )
      );
    }
    next(err);
  }
};

interface AuthRequest extends Request {
  user?: {
    _id: string;
  };
}

export const deleteCard = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const card = await Card.findById(req.params.cardId);

    if (!card) {
      return next(new NotFoundError("Карточка не найдена"));
    }

    if (card.owner.toString() !== req.user?._id) {
      return next(new ForbiddenError("Нет прав на удаление данной карточки"));
    }

    await card.deleteOne();

    res.status(200).json({ message: "Карточка удалена" });
  } catch (err: any) {
    if (err.kind === "ObjectId") {
      return next(new ValidationError("Некорректный _id карточки"));
    }
    next(err);
  }
};

export const likeCard = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user?._id } },
      { new: true }
    );

    if (!card) {
      return next(new NotFoundError("Карточка не найдена"));
    }

    res.status(200).json(card);
  } catch (err: any) {
    if (err.kind === "ObjectId") {
      return next(new ValidationError("Некорректный _id карточки"));
    }
    next(err);
  }
};

export const dislikeCard = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user?._id } },
      { new: true }
    );

    if (!card) {
      return next(new NotFoundError("Карточка не найдена"));
    }

    res.status(200).json(card);
  } catch (err: any) {
    if (err.kind === "ObjectId") {
      return next(new ValidationError("Некорректный _id карточки"));
    }
    next(err);
  }
};
