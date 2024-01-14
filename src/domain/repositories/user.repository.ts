import { IDatabaseClient } from "../../infrastructure/database/database";

export interface UserRepository {
  geByUsername(username: string):
    | {
        username: string;
        password: string;
        permissions: string[];
      }
    | undefined;
}

export const createUserRepository = (
  database: IDatabaseClient
): UserRepository => {
  return {
    geByUsername: (username) => {
      return database
        .select("users")
        .find((user) => user.username === username);
    },
  };
};
