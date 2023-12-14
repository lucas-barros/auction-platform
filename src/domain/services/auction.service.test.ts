import { Auction } from "../entities/auction.entity";
import { Bid } from "../entities/bid.entity";
import { AuctionService } from "./auction.service";

describe("AuctionService", () => {
  test("should return null if the auction has no bids", () => {
    const auctionService = new AuctionService();
    const auction = new Auction({
      id: "1",
      title: "Test Auction",
      endTime: new Date(Date.now() + 10000).toISOString(),
    });
    const bids: Bid[] = [];

    const winner = auctionService.computeAuctionWinnerUsername(auction, bids);

    expect(winner).toBeNull();
  });

  test("should return null if the auction is still ongoing", () => {
    const auctionService = new AuctionService();
    const auction = new Auction({
      id: "1",
      title: "Test Auction",
      endTime: new Date(Date.now() + 10000).toISOString(),
    });
    const bids = [
      new Bid({ id: "1", value: 100, username: "user1", auctionId: "1" }),
      new Bid({ id: "2", value: 150, username: "user2", auctionId: "1" }),
    ];

    const winner = auctionService.computeAuctionWinnerUsername(auction, bids);

    expect(winner).toBeNull();
  });

  test("should return the highest bid if the auction has ended", () => {
    const auctionService = new AuctionService();
    const auction = new Auction({
      id: "1",
      title: "Test Auction",
      endTime: new Date(2023, 0, 1).toISOString(),
    });
    const bids = [
      new Bid({ id: "1", value: 100, username: "user1", auctionId: "1" }),
      new Bid({ id: "2", value: 150, username: "user2", auctionId: "1" }),
      new Bid({ id: "3", value: 120, username: "user3", auctionId: "1" }),
    ];

    const winner = auctionService.computeAuctionWinnerUsername(auction, bids);

    expect(winner).toEqual("user2");
  });

  test("should return the first bid with the highest value and earliest timestamp in case of tie", () => {
    const auctionService = new AuctionService();
    const auction = new Auction({
      id: "1",
      title: "Test Auction",
      endTime: new Date(2023, 0, 1).toISOString(),
    });
    const bids = [
      new Bid({ id: "1", value: 150, username: "user1", auctionId: "1" }),
      new Bid({ id: "2", value: 100, username: "user2", auctionId: "1" }),
      new Bid({ id: "3", value: 150, username: "user3", auctionId: "1" }),
    ];

    const winner = auctionService.computeAuctionWinnerUsername(auction, bids);

    expect(winner).toEqual("user1");
  });
});
