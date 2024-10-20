import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
  resetDatabase,
} from "./userApi";

describe("user management", () => {
  let userId: string;

  beforeAll(resetDatabase);

  it("get all users", () => {
    const users = getUsers();
    expect(users).toEqual([]);
  });

  it("create user", () => {
    const newUser = {
      username: "new user",
      age: 1,
      hobbies: ["flips"],
    };
    const resultUser = createUser(newUser);
    const { id, ...restUserData } = resultUser;
    userId = id;
    expect(id).toBeDefined();
    expect(restUserData).toEqual(newUser);
  });

  it("get new user", () => {
    const user = getUserById(userId);
    expect(user).toBeDefined();
  });

  it("update this user", () => {
    const newUserData = {
      username: "new user",
      age: 1,
      hobbies: ["flips"],
    };
    const updatedUser = updateUser(userId, newUserData);
    const { id, ...restUserData } = updatedUser;
    expect(restUserData).toEqual(newUserData);
  });

  it("delete this user", () => {
    const isUserDeleted = deleteUser(userId);
    expect(isUserDeleted).toBeTruthy();
  });

  it("try to get this user", () => {
    const user = getUserById(userId);
    expect(user).not.toBeDefined();
  });
});

describe("add several users", () => {
  let userId: string;

  beforeAll(resetDatabase);

  it("get all users", () => {
    const users = getUsers();
    expect(users).toEqual([]);
  });

  it("create user 1", () => {
    const newUser = {
      username: "new user 1",
      age: 1,
      hobbies: ["flips"],
    };
    const resultUser = createUser(newUser);
    const { id, ...restUserData } = resultUser;
    userId = id;
    expect(id).toBeDefined();
    expect(restUserData).toEqual(newUser);
  });

  it("create user 2", () => {
    const newUser = {
      username: "new user 2",
      age: 2,
      hobbies: ["flops"],
    };
    const resultUser = createUser(newUser);
    const { id, ...restUserData } = resultUser;
    userId = id;
    expect(id).toBeDefined();
    expect(restUserData).toEqual(newUser);
  });

  it("create user 3", () => {
    const newUser = {
      username: "new user 3",
      age: 3,
      hobbies: ["foo"],
    };
    const resultUser = createUser(newUser);
    const { id, ...restUserData } = resultUser;
    userId = id;
    expect(id).toBeDefined();
    expect(restUserData).toEqual(newUser);
  });

  it("get all users", () => {
    const users = getUsers();
    expect(users.length).toBe(3);
  });
});

describe("try delete one user several times", () => {
  let userId: string;

  beforeAll(resetDatabase);

  it("get all users", () => {
    const users = getUsers();
    expect(users).toEqual([]);
  });

  it("create user", () => {
    const newUser = {
      username: "new user",
      age: 1,
      hobbies: ["flips"],
    };
    const resultUser = createUser(newUser);
    const { id, ...restUserData } = resultUser;
    userId = id;
    expect(id).toBeDefined();
    expect(restUserData).toEqual(newUser);
  });

  it("delete this user", () => {
    const isUserDeleted = deleteUser(userId);
    expect(isUserDeleted).toBeTruthy();
  });

  it("delete this user again", () => {
    const isUserDeleted = deleteUser(userId);
    expect(isUserDeleted).not.toBeTruthy();
  });
});
