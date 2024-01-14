import express from "express";

import { AuthorizationMiddleware } from "../middlewares/authorization";

import { AuctionParamsDTO, PlaceBidParamsDTO } from "../dtos/auction.dto";
import { Container } from "../container";

export const router = (container: Container) => {
  const router = express.Router();

  router.use(
    container.middleware.authentication.basicAuthMiddleware.bind(
      container.middleware.authentication
    )
  );

  router.post(
    "/",
    AuthorizationMiddleware.canCreateAuction,
    container.controller.auction.create.bind(container.controller.auction)
  );

  router.post<PlaceBidParamsDTO>(
    "/:id/bid",
    AuthorizationMiddleware.canBid,
    container.controller.auction.placeBid.bind(container.controller.auction)
  );

  router.get<AuctionParamsDTO>(
    "/:id",
    AuthorizationMiddleware.canViewAuction,
    container.controller.auction.getById.bind(container.controller.auction)
  );

  return router;
};
