import { IDatabaseClient } from "../../infrastructure/database/database";

export interface BidRepository {
  create: (bid: {
    id: string;
    value: number;
    username: string;
    auctionId: string;
    timestamp: string;
  }) => void;

  getByAuctionId: (auctionId: string) =>
    | {
        id: string;
        username: string;
        auctionId: string;
        value: number;
      }[];
}

export const createBidRepository = (
  database: IDatabaseClient
): BidRepository => {
  return {
    create: (bid) => {
      database.insert("bids", bid);
    },

    getByAuctionId: (auctionId) => {
      return database
        .select("bids")
        .filter((bid) => bid.auctionId === auctionId);
    },
  };
};
