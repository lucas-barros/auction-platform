import { AuctionRepository } from "../domain/repositories/auction.repository";
import { BidRepository } from "../domain/repositories/bid.repository";
import { UserRepository } from "../domain/repositories/user.repository";
import { AuctionService } from "../domain/services/auction.service";
import { AuctionUseCase } from "../domain/use-cases/auction.case";
import { IDatabaseClient } from "../infrastructure/database/database";
import { AuctionController } from "./controllers/auction.controller";
import { AuthenticationMiddleware } from "./middlewares/authentication";

export interface Container {
  controller: {
    auction: AuctionController;
  };
  middleware: {
    authentication: AuthenticationMiddleware;
  };
}

export const createContainer = (databaseClint: IDatabaseClient) => {
  const userRepository = new UserRepository(databaseClint);
  const auctionRepository = new AuctionRepository(databaseClint);
  const bidRepository = new BidRepository(databaseClint);
  const auctionService = new AuctionService();
  const auctionUseCase = new AuctionUseCase(
    auctionRepository,
    bidRepository,
    auctionService
  );
  return {
    controller: {
      auction: new AuctionController(auctionUseCase),
    },
    middleware: {
      authentication: new AuthenticationMiddleware(userRepository),
    },
  };
};
