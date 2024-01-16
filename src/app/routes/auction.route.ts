import express from "express";

import { authorizationMiddleware } from "../middlewares/authorization";

import { Container } from "../../domain/container";
import { createAuctionController } from "../controllers/auction.controller";
import { createAuctionUseCase } from "../../domain/use-cases/auction.case";
import { auctionService } from "../../domain/services/auction.service";
import { AuctionView } from "../views/auction.view";
import { AuctionParams, PlaceBidParams } from "../dtos/auction.dto";

export const router = (container: Container, view: AuctionView) => {
  const router = express.Router();
  const useCase = createAuctionUseCase(container.repository, auctionService);
  const auctionController = createAuctionController(useCase, view);

  router.use(container.middleware.authentication.basicAuthMiddleware);

  router.post(
    "/",
    authorizationMiddleware.canCreateAuction,
    auctionController.create
  );

  router.post<PlaceBidParams>(
    "/:id/bid",
    authorizationMiddleware.canBid,
    auctionController.placeBid
  );

  router.get<AuctionParams>(
    "/:id",
    authorizationMiddleware.canViewAuction,
    auctionController.getById
  );

  return router;
};
