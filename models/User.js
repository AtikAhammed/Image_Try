import mongoose from "mongoose";

// Defining Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  father_name: { type: String, required: true, trim: true },
  mother_name: { type: String, required: true, trim: true },
  date_of_birth: { type: Date, required: true },
  gender: { type: String, required: true, trim: true },
  phone_num: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
  tc: { type: Boolean, required: true }
})

// Model
const UserModel = mongoose.model("user", userSchema)

export default UserModel