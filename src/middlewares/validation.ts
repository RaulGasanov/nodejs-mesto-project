import { Joi, Segments } from "celebrate";

// Card
export const createCardValidation = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri(),
  }),
};

export const cardIdValidation = {
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
};

// User
export const userIdValidation = {
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
};

export const updateUserValidation = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(200).required(),
  }),
};

export const updateAvatarValidation = {
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().uri().required(),
  }),
};

export const userValidationSchema = {
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      "string.base": `"email" должно быть строкой`,
      "string.email": `"email" должно быть действительным адресом электронной почты`,
      "string.empty": `"email" не может быть пустым`,
      "any.required": `"email" обязательно для заполнения`,
    }),
    password: Joi.string().min(6).required().messages({
      "string.base": `"password" должно быть строкой`,
      "string.empty": `"password" не может быть пустым`,
      "string.min": `"password" должно быть не менее 6 символов`,
      "any.required": `"password" обязательно для заполнения`,
    }),
  }),
};
