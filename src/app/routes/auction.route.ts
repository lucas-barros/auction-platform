import express from "express";

import { authorizationMiddleware } from "../middlewares/authorization";

import { AuctionParamsDTO, PlaceBidParamsDTO } from "../dtos/auction.dto";
import { Container } from "../container";

export const router = (container: Container) => {
  const router = express.Router();

  router.use(container.middleware.authentication.basicAuthMiddleware);

  router.post(
    "/",
    authorizationMiddleware.canCreateAuction,
    container.controller.auction.create
  );

  router.post<PlaceBidParamsDTO>(
    "/:id/bid",
    authorizationMiddleware.canBid,
    container.controller.auction.placeBid
  );

  router.get<AuctionParamsDTO>(
    "/:id",
    authorizationMiddleware.canViewAuction,
    container.controller.auction.getById
  );

  return router;
};
