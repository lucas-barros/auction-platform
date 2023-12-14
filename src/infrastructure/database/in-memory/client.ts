import { IDatabaseClient, Database } from "../database";
import { users } from "../seed";

class InMemoryDatabaseClient implements IDatabaseClient {
  private data: Database;

  constructor() {
    this.data = { auctions: [], bids: [], users };
  }

  insert(
    tableName: keyof Database,
    value: Database[keyof Database][number]
  ): void {
    this.data[tableName].push(value as any);
  }

  select<T extends keyof Database = keyof Database>(tableName: T): Database[T] {
    return this.data[tableName];
  }

  update<T extends keyof Database>(tableName: T, value: Database[T]): void {
    this.data[tableName] = value;
  }
}

export const inMemoryDatabaseClient = new InMemoryDatabaseClient();
