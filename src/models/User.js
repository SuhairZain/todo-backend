import mongoose, { Schema } from "mongoose";

const User = new Schema({
  items: [
    {
      _id: String,
      done: Boolean,
      text: String
    }
  ]
});

export default mongoose.model("User", User);
