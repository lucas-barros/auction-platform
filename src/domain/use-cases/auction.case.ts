import { Err, Ok, Result } from "ts-results-es";
import { Auction } from "../entities/auction.entity";
import { AuctionRepository } from "../repositories/auction.repository";
import { AuctionException } from "../exceptions/auction.exception";
import { Bid } from "../entities/bid.entity";
import { BidRepository } from "../repositories/bid.repository";
import { AuctionService } from "../services/auction.service";
import { AuctionResponseDTO } from "../../app/dtos/auction.dto";

export class AuctionUseCase {
  constructor(
    private auctionRepository: AuctionRepository,
    private bidRepository: BidRepository,
    private auctionService: AuctionService
  ) {}

  create({
    title,
    endTime,
  }: {
    title: string;
    endTime: string;
  }): Result<string, AuctionException> {
    if (!title || Number.isNaN(Date.parse(endTime))) {
      return new Err(AuctionException.InvalidData);
    }
    const auction = new Auction({ title, endTime });

    this.auctionRepository.create(auction.toJson());

    return new Ok(auction.getId());
  }

  placeBid({
    username,
    auctionId,
    value,
  }: {
    username: string;
    auctionId: string;
    value: number;
  }): Result<string, AuctionException> {
    if (typeof value !== "number" || !auctionId || !username) {
      return new Err(AuctionException.InvalidData);
    }
    const auctionResult = this.auctionRepository.getById(auctionId);

    if (auctionResult === undefined) {
      return new Err(AuctionException.NotFound);
    }

    const auction = new Auction(auctionResult);

    if (new Date() > auction.getEndTime()) {
      return new Err(AuctionException.AuctionEnded);
    }

    const bid = new Bid({ username, auctionId, value });

    this.bidRepository.create(bid.toJson());

    return new Ok(bid.getId());
  }

  getById(id: string): Result<AuctionResponseDTO, AuctionException> {
    if (!id) {
      return new Err(AuctionException.InvalidData);
    }

    const auctionResult = this.auctionRepository.getById(id);

    if (auctionResult === undefined) {
      return new Err(AuctionException.NotFound);
    }

    const auction = new Auction(auctionResult);
    const bidsResult = this.bidRepository.getByAuctionId(id);
    const bids = bidsResult.map((bid) => new Bid(bid));

    if (!auction.getWinnerUsername()) {
      const winnerUsername = this.auctionService.computeAuctionWinnerUsername(
        auction,
        bids
      );
      auction.setWinnerUsername(winnerUsername);
      this.auctionRepository.updateById(id, auction.toJson());
    }

    return new Ok(auction.toJson());
  }
}
