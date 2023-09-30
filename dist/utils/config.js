import * as dotenv from "dotenv";
dotenv.config();
export const MONGO_DB_URI = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.d96pl5j.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true`;
