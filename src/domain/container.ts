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

export const createContainer = (databaseClint: IDatabaseClient): Container => {
  const userRepository = createUserRepository(databaseClint);
  const auctionRepository = createAuctionRepository(databaseClint);
  const bidRepository = createBidRepository(databaseClint);

  return {
    repository: {
      auction: auctionRepository,
      bid: bidRepository,
      user: userRepository,
    },
  };
};
