import { IncomingMessage, ServerResponse } from "node:http";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "./userApi";
import { checkRequiredFields, checkUserExist, checkUserId } from "./validation";
import { findUserIdByUrl, parseBody } from "./utils";

export const routes = async (req: IncomingMessage, res: ServerResponse) => {
  // GET ALL
  try {
    if (req.method === "GET" && req.url === "/api/users") {
      const users = getUsers();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(users));
      return;
    }

    // GET ONE
    if (req.method === "GET" && req.url?.startsWith("/api/users/")) {
      const userId = findUserIdByUrl(req.url);

      const userIdErrorMessage = checkUserId(userId);
      if (userIdErrorMessage) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: userIdErrorMessage }));
        return;
      }

      const userExistErrorMessage = checkUserExist(userId as string);
      if (userExistErrorMessage) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: userExistErrorMessage }));
        return;
      }

      const user = getUserById(userId as string);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(user));
      return;
    }

    // CREATE
    if (req.method === "POST" && req.url === "/api/users") {
      const body = await parseBody(req);

      const errorMessage = checkRequiredFields(body);
      if (errorMessage) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: errorMessage }));
        return;
      }

      const user = createUser(body);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(user));
      return;
    }

    // UPDATE
    if (req.method === "PUT" && req.url?.startsWith("/api/users/")) {
      const userId = findUserIdByUrl(req.url);
      const body = await parseBody(req);

      const userIdErrorMessage = checkUserId(userId);
      const requiredFieldsErrorMessage = checkRequiredFields(body);
      const badRequestErrorMessage =
        userIdErrorMessage || requiredFieldsErrorMessage;
      if (badRequestErrorMessage) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: badRequestErrorMessage }));
        return;
      }

      const userExistErrorMessage = checkUserExist(userId as string);
      if (userExistErrorMessage) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: userExistErrorMessage }));
        return;
      }

      const user = updateUser(userId as string, body);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(user));
      return;
    }

    // DELETE
    if (req.method === "DELETE" && req.url?.startsWith("/api/users/")) {
      const userId = findUserIdByUrl(req.url);

      const userIdErrorMessage = checkUserId(userId);
      if (userIdErrorMessage) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: userIdErrorMessage }));
      }

      const userExistErrorMessage = checkUserExist(userId as string);
      if (userExistErrorMessage) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: userExistErrorMessage }));
        return;
      }

      deleteUser(userId as string);
      res.writeHead(204);
      res.end();
      return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error: "wrong request, make sure that you send request correctly",
      })
    );
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error: "something went wrong, please try again later",
      })
    );
  }
};
