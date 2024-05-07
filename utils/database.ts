import mongoose from "mongoose";

let isConnected: boolean = false;

const dataBaseURI = process.env.MONGODB_URI as string;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("MongoDb is already connected");
    return mongoose;
  }

  try {
    await mongoose.connect(dataBaseURI, {
      dbName: "konchat-database",
    })

    isConnected = true;

    console.log("Database is connected");
    return mongoose
  } catch (error) {
    console.log(error);
    throw error
  }
}