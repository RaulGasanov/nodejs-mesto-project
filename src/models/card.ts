import { Types, model, Schema } from "mongoose";
import {isURL} from "validator";

interface ICard {
  name: string;
  link: string;
  owner: Types.ObjectId;
  likes: Types.ObjectId[];
  createdAt: Date;
}

const cardSchema: Schema<ICard> = new Schema({
  name: {
    type: String,
    required: [true, 'Поле "name" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
  },
  link: {
    type: String,
    required: [true, 'Поле "link" должно быть заполнено'],
    validate: {
      validator: (value: string) => isURL(value),
      message: 'Поле "link" должно содержать валидный URL',
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: [true, 'Поле "owner" должно быть заполнено'],
  },
  likes: {
    type: [Schema.Types.ObjectId],
    ref: "user",
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model<ICard>("card", cardSchema);
