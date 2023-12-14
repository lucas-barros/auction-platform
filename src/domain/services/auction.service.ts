import { Auction } from "../entities/auction.entity";
import { Bid } from "../entities/bid.entity";

export class AuctionService {
  computeAuctionWinnerUsername(auction: Auction, bids: Bid[]) {
    const [firstBid, ...rest] = bids;
    
    if (auction.getEndTime() > new Date()) {
      return null;
    }

    const winnerBid = rest.reduce((winner, bid) => {
      if (winner.getValue() < bid.getValue()) {
        return bid;
      }

      if (winner.getValue() === bid.getValue()) {
        return winner.getTimestamp() <= bid.getTimestamp() ? winner : bid;
      }

      return winner;
    }, firstBid);

    return winnerBid?.getUsername() ?? null;
  }
}
