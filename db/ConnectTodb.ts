import mongoose from "mongoose";

export default async function ConnectTodb() {
  // @ts-ignore
  return mongoose.connect(process.env.DB);
}
