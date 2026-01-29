import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://tushar073c_db_user:wf0RRxdKCBsNoSlY@cluster0.s9jhy93.mongodb.net/?appName=Cluster0", {
      autoIndex: true,
    });
    console.log('connected to db...');
  } catch (error) {
    throw new Error("Database connection failed");
  }
};

export default connectDB;
