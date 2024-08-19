import mongoose from "mongoose";

const connectDb = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      return true;
    }
    await mongoose.connect(process.env.MONGODB);
    console.log("mongodb connected");
  } catch (err) {
    console.log(`Error connecting to mongoose: ${err}`);
  }
};

export default connectDb;
