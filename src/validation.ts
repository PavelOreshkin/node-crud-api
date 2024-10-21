import { validate as isValidUuid } from "uuid";
import { getUserById, User } from "./userApi";

export const checkUserId = (userId?: string) => {
  if (!userId) {
    return "user ID doesn't exist";
  }
  if (!isValidUuid(userId)) {
    return "invalid user ID";
  }

  return null;
};

export const checkUserExist = (userId: string) => {
  if (!getUserById(userId)) {
    return "user does't exist";
  }
  return null;
};

export const checkRequiredFields = ({
  username,
  age,
  hobbies,
}: Omit<User, "id">) => {
  if (!username || !age || !hobbies) {
    const unfilledFields = [
      !username ? "username" : null,
      !age ? "age" : null,
      !hobbies ? "hobbies" : null,
    ]
      .filter((item) => item)
      .join(", ");
    return `You have to add next fields: ${unfilledFields}`;
  }

  if (
    typeof username !== "string" ||
    typeof age !== "number" ||
    !Array.isArray(hobbies)
  ) {
    return "wrong field format";
  }

  return null;
};
