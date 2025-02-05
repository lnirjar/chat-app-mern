import chalk from "chalk";
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log(
      chalk.bgGreenBright("MongoDB Connected:"),
      mongoose.connection.host,
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
