import { IncomingMessage, ServerResponse } from "node:http";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "./userApi";

const parseBody = async (req: IncomingMessage) => {
  let body = "";
  await req.on("data", (chunk) => (body += chunk));
  return JSON.parse(body);
};

export const routes = async (req: IncomingMessage, res: ServerResponse) => {
  console.log("req.url: ", req.url);
  console.log("req.method: ", req.method);

  // GET ALL
  if (req.method === "GET" && req.url === "/api/users") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(getUsers()));
  }

  // GET ONE
  if (req.method === "GET" && req.url?.startsWith("/api/users/")) {
    const userId = req.url.split("/")[3];
    console.log("userId: ", userId);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(getUserById(userId)));
  }

  // CREATE
  if (req.method === "POST" && req.url === "/api/users") {
    const body = await parseBody(req);
    const { username, age, hobbies } = body || {};
    if (!username || !age || !hobbies) {
      const unfilledFields = [
        !username ? "username" : null,
        !age ? "age" : null,
        !hobbies ? "hobbies" : null,
      ]
        .filter((item) => item)
        .join(", ");

      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({
          error: `You have to add next fields: ${unfilledFields}`,
        })
      );
    }
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(createUser(body)));
  }

  // UPDATE
  if (req.method === "PUT" && req.url?.startsWith("/api/users/")) {
    const userId = req.url.split("/")[3];
    const body = await parseBody(req);
    const { username, age, hobbies } = body || {};
    if (!username || !age || !hobbies) {
      const unfilledFields = [
        !username ? "username" : null,
        !age ? "age" : null,
        !hobbies ? "hobbies" : null,
      ]
        .filter((item) => item)
        .join(", ");

      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({
          error: `You have to add next fields: ${unfilledFields}`,
        })
      );
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(updateUser(userId, body)));
  }

  // DELETE
  if (req.method === "DELETE" && req.url?.startsWith("/api/users/")) {
    const userId = req.url.split("/")[3];

    res.writeHead(204, { "Content-Type": "application/json" });
    deleteUser(userId);
    res.end();
  }
};
