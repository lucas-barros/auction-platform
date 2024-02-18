import {
  AuctionRepository,
  createAuctionRepository,
} from "./repositories/auction.repository";
import {
  BidRepository,
  createBidRepository,
} from "./repositories/bid.repository";
import {
  UserRepository,
  createUserRepository,
} from "./repositories/user.repository";
import { IDatabaseClient } from "../infrastructure/database/database";

export interface Container {
  repository: {
    auction: AuctionRepository;
    bid: BidRepository;
    user: UserRepository;
  };
}

export const createContainer = (databaseClient: IDatabaseClient): Container => {
  const userRepository = createUserRepository(databaseClient);
  const auctionRepository = createAuctionRepository(databaseClient);
  const bidRepository = createBidRepository(databaseClient);

  return {
    repository: {
      auction: auctionRepository,
      bid: bidRepository,
      user: userRepository,
    },
  };
};
