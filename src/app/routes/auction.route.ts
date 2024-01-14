import express from "express";

import { authorizationMiddleware } from "../middlewares/authorization";

import { AuctionParamsDTO, PlaceBidParamsDTO } from "../dtos/auction.dto";
import { Container } from "../container";
import { createAuctionController } from "../controllers/auction.controller";
import { createAuctionUseCase } from "../../domain/use-cases/auction.case";
import { auctionService } from "../../domain/services/auction.service";

export const router = (container: Container) => {
  const router = express.Router();
  const useCase = createAuctionUseCase(container.repository, auctionService);
  const auctionController = createAuctionController(useCase);

  router.use(container.middleware.authentication.basicAuthMiddleware);

  router.post(
    "/",
    authorizationMiddleware.canCreateAuction,
    auctionController.create
  );

  router.post<PlaceBidParamsDTO>(
    "/:id/bid",
    authorizationMiddleware.canBid,
    auctionController.placeBid
  );

  router.get<AuctionParamsDTO>(
    "/:id",
    authorizationMiddleware.canViewAuction,
    auctionController.getById
  );

  return router;
};
