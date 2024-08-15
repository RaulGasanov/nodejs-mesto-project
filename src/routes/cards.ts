import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import {
  createCard,
  deleteCard,
  dislikeCard,
  getCards,
  likeCard,
} from "../controllers/cards";
import {
  cardIdValidation,
  createCardValidation,
} from "../middlewares/validation";

const router = Router();

// Маршруты с валидацией
router.get("/", getCards);
router.post("/", celebrate(createCardValidation), createCard);
router.delete("/:cardId", celebrate(cardIdValidation), deleteCard);
router.put("/:cardId/likes", celebrate(cardIdValidation), likeCard);
router.delete("/:cardId/likes", celebrate(cardIdValidation), dislikeCard);

export default router;
