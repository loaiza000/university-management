import dotenv from "dotenv";

dotenv.config();

export const config = {
  db: process.env.DB_URI,
  port: process.env.PORT,
};
