import { IDatabaseClient } from "../../infrastructure/database/database";

export class AuctionRepository {
  constructor(private database: IDatabaseClient) {}

  create(auction: {
    id: string;
    title: string;
    endTime: string;
    winnerUsername: string | null;
  }): void {
    this.database.insert("auctions", auction);
  }

  getById(id: string):
    | {
        id: string;
        title: string;
        endTime: string;
      }
    | undefined {
    return this.database
      .select("auctions")
      .find((auction) => auction.id === id);
  }

  updateById(
    id: string,
    newValue: {
      id: string;
      title: string;
      endTime: string;
      winnerUsername: string | null;
    }
  ) {
    const updated = this.database.select("auctions").map((auction) => {
      if (auction.id === id) {
        return newValue;
      }
      return auction;
    });
    this.database.update("auctions", updated);
  }
}
