import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: true,
    });
    console.log('connected to db...');
  } catch (error) {
    throw new Error("Database connection failed");
  }
};

export default connectDB;