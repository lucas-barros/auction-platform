import { IDatabaseClient } from "../../infrastructure/database/database";

export interface AuctionRepository {
  create: (auction: {
    id: string;
    title: string;
    endTime: string;
    winnerUsername: string | null;
  }) => void;
  getById: (id: string) =>
    | {
        id: string;
        title: string;
        endTime: string;
      }
    | undefined;
  updateById: (
    id: string,
    newValue: {
      id: string;
      title: string;
      endTime: string;
      winnerUsername: string | null;
    }
  ) => void;
}

export const createAuctionRepository = (
  database: IDatabaseClient
): AuctionRepository => {
  return {
    create: (auction) => {
      database.insert("auctions", auction);
    },

    getById: (id) => {
      return database.select("auctions").find((auction) => auction.id === id);
    },

    updateById: (id, newValue) => {
      const updated = database.select("auctions").map((auction) => {
        if (auction.id === id) {
          return newValue;
        }
        return auction;
      });
      database.update("auctions", updated);
    },
  };
};
