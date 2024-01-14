import {
  AuctionRepository,
  createAuctionRepository,
} from "../domain/repositories/auction.repository";
import {
  BidRepository,
  createBidRepository,
} from "../domain/repositories/bid.repository";
import {
  UserRepository,
  createUserRepository,
} from "../domain/repositories/user.repository";
import { IDatabaseClient } from "../infrastructure/database/database";
import {
  AuthenticationMiddleware,
  createAuthenticationMiddleware,
} from "./middlewares/authentication";

export interface Container {
  repository: {
    auction: AuctionRepository;
    bid: BidRepository;
    user: UserRepository;
  };
  middleware: {
    authentication: AuthenticationMiddleware;
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
    middleware: {
      authentication: createAuthenticationMiddleware(userRepository),
    },
  };
};
