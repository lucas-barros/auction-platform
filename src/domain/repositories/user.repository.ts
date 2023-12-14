import { IDatabaseClient } from "../../infrastructure/database/database";

export class UserRepository {
  constructor(private database: IDatabaseClient) {}

  geByUsername(username: string) {
    return this.database
      .select("users")
      .find((user) => user.username === username);
  }
}
