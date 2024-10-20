import { v4 as uuid } from "uuid";

type User = {
  id: string;
  username: string;
  age: number;
  hobbies: string[] | [];
};

const users: User[] = [];

export const getUsers = () => {
  return users;
};

export const getUserById = (id: string) => {
  return users.find((user) => user.id === id);
};

export const createUser = (data: Omit<User, "id">) => {
  const newUser = { id: uuid(), ...data };
  users.push(newUser);
  return newUser;
};

export const updateUser = (userId: string, data: Omit<User, "id">) => {
  const userIndex = users.findIndex((user) => user.id === userId);
  const updatedUser = { ...users[userIndex], ...data };
  users[userIndex] = updatedUser;
  return updatedUser;
};

export const deleteUser = (id: string) => {
  const userIndex = users.findIndex((user) => user.id === id);
  users.splice(userIndex, 1);
};
