import { config } from "dotenv";

config();

const bcryptConfig = {
  rounds: Number(process.env.HASH_ROUNDS),
};

export default bcryptConfig;