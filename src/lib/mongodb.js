import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
const options = {};

let isConnected;

export async function connectToDatabase() {
  if (isConnected) {
    return;
  }

  if (mongoose.connection.readyState >= 1) {
    isConnected = mongoose.connections[0].readyState;
    return;
  }

  try {
    console.log("dbconn", uri);
    await mongoose.connect(uri, options);
    isConnected = mongoose.connections[0].readyState;
  } catch (error) {
    console.log("dbconners", uri);
    console.error("Error connecting to database:", error);
    throw error;
  }
}
