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
  if (req.method === "GET" && req.url === "/api/users") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(getUsers()));
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

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(getUserById(userId as string)));
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

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(createUser(body)));
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

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(updateUser(userId as string, body)));
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
};
