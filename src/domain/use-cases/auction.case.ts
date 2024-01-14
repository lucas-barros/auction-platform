import { Err, Ok, Result } from "ts-results-es";
import { Auction } from "../entities/auction.entity";
import { AuctionRepository } from "../repositories/auction.repository";
import { AuctionException } from "../exceptions/auction.exception";
import { Bid } from "../entities/bid.entity";
import { BidRepository } from "../repositories/bid.repository";
import { AuctionService } from "../services/auction.service";
import { AuctionResponseDTO } from "../../app/dtos/auction.dto";

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
  getById: (id: string) => Result<AuctionResponseDTO, AuctionException>;
}

export const createAuctionUseCase = (
  auctionRepository: AuctionRepository,
  bidRepository: BidRepository,
  auctionService: AuctionService
): AuctionUseCase => {
  return {
    create: ({ title, endTime }) => {
      if (!title || Number.isNaN(Date.parse(endTime))) {
        return new Err(AuctionException.InvalidData);
      }
      const auction = new Auction({ title, endTime });

      auctionRepository.create(auction.toJson());

      return new Ok(auction.getId());
    },

    placeBid: ({ username, auctionId, value }) => {
      if (typeof value !== "number" || !auctionId || !username) {
        return new Err(AuctionException.InvalidData);
      }
      const auctionResult = auctionRepository.getById(auctionId);

      if (auctionResult === undefined) {
        return new Err(AuctionException.NotFound);
      }

      const auction = new Auction(auctionResult);

      if (new Date() > auction.getEndTime()) {
        return new Err(AuctionException.AuctionEnded);
      }

      const bid = new Bid({ username, auctionId, value });

      bidRepository.create(bid.toJson());

      return new Ok(bid.getId());
    },

    getById: (id: string) => {
      if (!id) {
        return new Err(AuctionException.InvalidData);
      }

      const auctionResult = auctionRepository.getById(id);

      if (auctionResult === undefined) {
        return new Err(AuctionException.NotFound);
      }

      const auction = new Auction(auctionResult);
      const bidsResult = bidRepository.getByAuctionId(id);
      const bids = bidsResult.map((bid) => new Bid(bid));

      if (!auction.getWinnerUsername()) {
        const winnerUsername = auctionService.computeAuctionWinnerUsername(
          auction,
          bids
        );
        auction.setWinnerUsername(winnerUsername);
        auctionRepository.updateById(id, auction.toJson());
      }

      return new Ok(auction.toJson());
    },
  };
};
