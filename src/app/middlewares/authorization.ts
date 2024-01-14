import { Request, Response, NextFunction } from "express";
import { AuctionParamsDTO, PlaceBidParamsDTO } from "../dtos/auction.dto";

export const FAILED_AUTHORIZATION = "Failed Authorization";

export const authorizationMiddleware = {
  canCreateAuction(_: Request, res: Response, next: NextFunction) {
    if (
      !res.locals.permissions?.find(
        (permission: string) => permission === "create_auction"
      )
    ) {
      res.status(401).json({ error: FAILED_AUTHORIZATION });
      return;
    }

    next();
  },
  canViewAuction(
    _: Request<AuctionParamsDTO>,
    res: Response,
    next: NextFunction
  ) {
    if (
      !res.locals.permissions?.find(
        (permission: string) => permission === "view_auction"
      )
    ) {
      res.status(401).json({ error: FAILED_AUTHORIZATION });
      return;
    }

    next();
  },
  canBid(_: Request<PlaceBidParamsDTO>, res: Response, next: NextFunction) {
    if (
      !res.locals.permissions?.find(
        (permission: string) => permission === "bid"
      )
    ) {
      res.status(401).json({ error: FAILED_AUTHORIZATION });
      return;
    }

    next();
  },
};
