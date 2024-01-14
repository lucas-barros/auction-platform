import { createAuctionRepository } from "../domain/repositories/auction.repository";
import { createBidRepository } from "../domain/repositories/bid.repository";
import { createUserRepository } from "../domain/repositories/user.repository";
import { auctionService } from "../domain/services/auction.service";
import { createAuctionUseCase } from "../domain/use-cases/auction.case";
import { IDatabaseClient } from "../infrastructure/database/database";
import {
  AuctionController,
  createAuctionController,
} from "./controllers/auction.controller";
import {
  AuthenticationMiddleware,
  createAuthenticationMiddleware,
} from "./middlewares/authentication";

export interface Container {
  controller: {
    auction: AuctionController;
  };
  middleware: {
    authentication: AuthenticationMiddleware;
  };
}

export const createContainer = (databaseClint: IDatabaseClient) => {
  const userRepository = createUserRepository(databaseClint);
  const auctionRepository = createAuctionRepository(databaseClint);
  const bidRepository = createBidRepository(databaseClint);
  const auctionUseCase = createAuctionUseCase(
    auctionRepository,
    bidRepository,
    auctionService
  );
  return {
    controller: {
      auction: createAuctionController(auctionUseCase),
    },
    middleware: {
      authentication: createAuthenticationMiddleware(userRepository),
    },
  };
};
