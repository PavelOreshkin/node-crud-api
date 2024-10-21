import { env } from "node:process";
import { createServer } from "node:http";
import { config as dotenvConfig } from "dotenv";
import { routes } from "./routes";

dotenvConfig();
const PORT = Number(env.PORT) || 4000;

createServer(routes).listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
