import joi from "joi";

const urlSchema = joi
  .string()
  .regex(
    /^(http:\/\/|https:\/\/)(www\.)?([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=])?#?$/
  )
  .required();

export const requestSchema = joi.object({
  app: urlSchema,
});
