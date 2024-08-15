import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import {
  getCurrentUser,
  getUsers,
  getUsersById,
  updateAvatar,
  updateUser,
} from "../controllers/users";
import { auth } from "../middlewares/auth";
import {
  updateAvatarValidation,
  updateUserValidation,
  userIdValidation,
} from "../middlewares/validation";

const router = Router();

router.use(auth);

// Маршруты с валидацией
router.get("/", getUsers);
router.get("/me", getCurrentUser);
router.get("/:userId", celebrate(userIdValidation), getUsersById);
router.patch("/me", celebrate(updateUserValidation), updateUser);
router.patch("/me/avatar", celebrate(updateAvatarValidation), updateAvatar);

export default router;
