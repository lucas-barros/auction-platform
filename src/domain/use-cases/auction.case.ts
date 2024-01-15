import { Err, Ok, Result } from "ts-results-es";
import { Auction, AuctionJson } from "../entities/auction.entity";
import { AuctionRepository } from "../repositories/auction.repository";
import { AuctionException } from "../exceptions/auction.exception";
import { Bid } from "../entities/bid.entity";
import { BidRepository } from "../repositories/bid.repository";
import { AuctionService } from "../services/auction.service";

export interface AuctionUseCase {
  create: (payload: {
    title: string;
    endTime: string;
  }) => Result<string, AuctionException>;
  placeBid: (payload: {
    username: string;
    auctionId: string;
    value: number;
  }) => Result<string, AuctionException>;
  getById: (id: string) => Result<AuctionJson, AuctionException>;
}

export const createAuctionUseCase = (
  repositories: {
    auction: AuctionRepository;
    bid: BidRepository;
  },
  service: AuctionService
): AuctionUseCase => {
  return {
    create: ({ title, endTime }) => {
      if (!title || Number.isNaN(Date.parse(endTime))) {
        return new Err(AuctionException.InvalidData);
      }
      const auction = new Auction({ title, endTime });

      repositories.auction.create(auction.toJson());

      return new Ok(auction.getId());
    },

    placeBid: ({ username, auctionId, value }) => {
      if (typeof value !== "number" || !auctionId || !username) {
        return new Err(AuctionException.InvalidData);
      }
      const auctionResult = repositories.auction.getById(auctionId);

      if (auctionResult === undefined) {
        return new Err(AuctionException.NotFound);
      }

      const auction = new Auction(auctionResult);

      if (new Date() > auction.getEndTime()) {
        return new Err(AuctionException.AuctionEnded);
      }

      const bid = new Bid({ username, auctionId, value });

      repositories.bid.create(bid.toJson());

      return new Ok(bid.getId());
    },

    getById: (id: string) => {
      if (!id) {
        return new Err(AuctionException.InvalidData);
      }

      const auctionResult = repositories.auction.getById(id);

      if (auctionResult === undefined) {
        return new Err(AuctionException.NotFound);
      }

      const auction = new Auction(auctionResult);
      const bidsResult = repositories.bid.getByAuctionId(id);
      const bids = bidsResult.map((bid) => new Bid(bid));

      if (!auction.getWinnerUsername()) {
        const winnerUsername = service.computeAuctionWinnerUsername(
          auction,
          bids
        );
        auction.setWinnerUsername(winnerUsername);
        repositories.auction.updateById(id, auction.toJson());
      }

      return new Ok(auction.toJson());
    },
  };
};
