import * as dotenv from "dotenv";
import http from "http";
import { routes } from "./routes";

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = http.createServer(routes);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
