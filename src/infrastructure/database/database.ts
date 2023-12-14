export interface Database {
  users: { username: string; password: string; permissions: string[] }[];
  auctions: {
    id: string;
    title: string;
    endTime: string;
    winnerUsername: string | null;
  }[];
  bids: { id: string; username: string; auctionId: string; value: number }[];
}

export interface IDatabaseClient {
  select<T extends keyof Database = keyof Database>(tableName: T): Database[T];
  insert(
    tableName: keyof Database,
    value: Database[keyof Database][number]
  ): void;
  update(tableName: keyof Database, value: Database[keyof Database]): void;
}
