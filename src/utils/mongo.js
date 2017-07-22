import mongoose from "mongoose";

export const init = () => {
  mongoose
    .connect("mongodb://localhost/todos", {
      useMongoClient: true
    })
    .then(() => {
      console.log("Connected to db");
    })
    .catch(error => {
      console.error("Error while connecting to db", error);
    });
};
