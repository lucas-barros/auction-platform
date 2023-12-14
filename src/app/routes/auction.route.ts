import express from "express";
import { AuctionController } from "../controllers/auction.controller";
import { AuctionRepository } from "../../domain/repositories/auction.repository";
import { inMemoryDatabaseClient } from "../../infrastructure/database/in-memory/client";
import { AuctionUseCase } from "../../domain/use-cases/auction.case";
import { AuthenticationMiddleware } from "../middlewares/authentication";
import { UserRepository } from "../../domain/repositories/user.repository";
import { AuthorizationMiddleware } from "../middlewares/authorization";
import { BidRepository } from "../../domain/repositories/bid.repository";
import { AuctionService } from "../../domain/services/auction.service";
import { AuctionParamsDTO, PlaceBidParamsDTO } from "../dtos/auction.dto";

const router = express.Router();
const userRepository = new UserRepository(inMemoryDatabaseClient);
const auctionRepository = new AuctionRepository(inMemoryDatabaseClient);
const bidRepository = new BidRepository(inMemoryDatabaseClient);
const auctionService = new AuctionService();
const useCase = new AuctionUseCase(
  auctionRepository,
  bidRepository,
  auctionService
);
const controller = new AuctionController(useCase);
const authenticationMiddleware = new AuthenticationMiddleware(userRepository);

router.use(
  authenticationMiddleware.basicAuthMiddleware.bind(authenticationMiddleware)
);

router.post(
  "/",
  AuthorizationMiddleware.canCreateAuction,
  controller.create.bind(controller)
);

router.post<PlaceBidParamsDTO>(
  "/:id/bid",
  AuthorizationMiddleware.canBid,
  controller.placeBid.bind(controller)
);

router.get<AuctionParamsDTO>(
  "/:id",
  AuthorizationMiddleware.canViewAuction,
  controller.getById.bind(controller)
);

export { router as auctionRouter };
