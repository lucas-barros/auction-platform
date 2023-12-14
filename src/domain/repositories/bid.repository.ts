import { IDatabaseClient } from "../../infrastructure/database/database";

export class BidRepository {
  constructor(private database: IDatabaseClient) {}

  create(bid: {
    id: string;
    value: number;
    username: string;
    auctionId: string;
    timestamp: string;
  }) {
    this.database.insert("bids", bid);
  }

  getByAuctionId(auctionId: string) {
    return this.database
      .select("bids")
      .filter((bid) => bid.auctionId === auctionId);
  }
}
