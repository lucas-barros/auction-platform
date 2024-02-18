import request from "supertest";
import { server } from "../../../../server";
import { FAILED_AUTHORIZATION } from "../middlewares/authorization";
import { FAILED_AUTHENTICATION } from "../middlewares/authentication";
import { AuctionException } from "../../../domain/exceptions/auction.exception";

const getAuthHeader = (username: string, password: string) =>
  `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;

const addDays = (days: number) => new Date(Date.now() + days * 86400000);

describe("Auction End-to-End Tests", () => {
  afterAll(async () => {
    server.close();
  });

  beforeEach(() => {
    jest.useRealTimers();
  });

  it("should fail to create an auction with user without authentication", async () => {
    const response = await request(server).post("/auctions").send({
      title: "Test Auction",
      endTime: new Date().toISOString(),
    });

    expect(response.status).toEqual(401);
    expect(response.body.error).toEqual(FAILED_AUTHENTICATION);
  });

  it("should fail to create an auction with user wrong authentication", async () => {
    const response = await request(server)
      .post("/auctions")
      .set("Authorization", getAuthHeader("bidder1", "password"))
      .send({
        title: "Test Auction",
        endTime: new Date().toISOString(),
      });

    expect(response.status).toEqual(401);
    expect(response.body.error).toEqual(FAILED_AUTHENTICATION);
  });

  it("should fail to create an auction with user without authorization", async () => {
    const response = await request(server)
      .post("/auctions")
      .set("Authorization", getAuthHeader("bidder1", "bidder1_password"))
      .send({
        title: "Test Auction",
        endTime: new Date().toISOString(),
      });

    expect(response.status).toEqual(401);
    expect(response.body.error).toEqual(FAILED_AUTHORIZATION);
  });

  it("should create an auction and fail to bid with user without authorization", async () => {
    const auctionResponse = await request(server)
      .post("/auctions")
      .set("Authorization", getAuthHeader("employee", "employee_password"))
      .send({
        title: "Test Auction",
        endTime: new Date().toISOString(),
      });

    const bidResponse = await request(server)
      .post(`/auctions/${auctionResponse.body.id}/bid`)
      .set("Authorization", getAuthHeader("employee", "employee_password"))
      .send({
        value: 100,
      });

    expect(bidResponse.status).toEqual(401);
    expect(bidResponse.body.error).toEqual(FAILED_AUTHORIZATION);
  });

  it("should fail to create an auction with invalid payload", async () => {
    const response = await request(server)
      .post("/auctions")
      .set("Authorization", getAuthHeader("employee", "employee_password"))
      .send({
        title: "Test Auction",
        endTime: "invalid",
      });

    expect(response.status).toEqual(400);
    expect(response.body.error).toEqual(AuctionException.InvalidData);
  });

  it("should create an auction and fail to make a bid after it has ended", async () => {
    const auctionPayload = {
      title: "Test Auction",
      endTime: new Date().toISOString(),
    };
    const createAuctionResponse = await request(server)
      .post("/auctions")
      .set("Authorization", getAuthHeader("employee", "employee_password"))
      .send(auctionPayload);

    const bidResponse = await request(server)
      .post(`/auctions/${createAuctionResponse.body.id}/bid`)
      .set("Authorization", getAuthHeader("bidder1", "bidder1_password"))
      .send({
        value: 100,
      });

    expect(bidResponse.status).toEqual(400);
    expect(bidResponse.body.error).toEqual(AuctionException.AuctionEnded);
  });

  it("should create an auction and make a bid", async () => {
    const auctionPayload = {
      title: "Test Auction",
      endTime: addDays(1).toISOString(),
    };
    const createAuctionResponse = await request(server)
      .post("/auctions")
      .set("Authorization", getAuthHeader("employee", "employee_password"))
      .send(auctionPayload);

    await request(server)
      .post(`/auctions/${createAuctionResponse.body.id}/bid`)
      .set("Authorization", getAuthHeader("bidder1", "bidder1_password"))
      .send({
        value: 100,
      });

    const auctionResponse = await request(server)
      .get(`/auctions/${createAuctionResponse.body.id}`)
      .set("Authorization", getAuthHeader("employee", "employee_password"))
      .send();

    expect(auctionResponse.status).toEqual(200);
    expect(auctionResponse.body).toMatchObject({
      id: createAuctionResponse.body.id,
      title: auctionPayload.title,
      endTime: auctionPayload.endTime,
      winnerUsername: null,
    });
  });

  it("should create an auction, make multiple bids and have the correct winner", async () => {
    const auctionPayload = {
      title: "Test Auction",
      endTime: addDays(1).toISOString(),
    };
    const createAuctionResponse = await request(server)
      .post("/auctions")
      .set("Authorization", getAuthHeader("employee", "employee_password"))
      .send(auctionPayload);

    await request(server)
      .post(`/auctions/${createAuctionResponse.body.id}/bid`)
      .set("Authorization", getAuthHeader("bidder1", "bidder1_password"))
      .send({
        value: 100,
      });

    await request(server)
      .post(`/auctions/${createAuctionResponse.body.id}/bid`)
      .set("Authorization", getAuthHeader("bidder2", "bidder2_password"))
      .send({
        value: 200.5,
      });

    await request(server)
      .post(`/auctions/${createAuctionResponse.body.id}/bid`)
      .set("Authorization", getAuthHeader("bidder3", "bidder3_password"))
      .send({
        value: 190,
      });

    jest.useFakeTimers().setSystemTime(addDays(2));

    const auctionResponse = await request(server)
      .get(`/auctions/${createAuctionResponse.body.id}`)
      .set("Authorization", getAuthHeader("employee", "employee_password"))
      .send();

    expect(auctionResponse.status).toEqual(200);
    expect(auctionResponse.body).toMatchObject({
      id: createAuctionResponse.body.id,
      title: auctionPayload.title,
      endTime: auctionPayload.endTime,
      winnerUsername: "bidder2",
    });
  });

  it("should create an auction, make multiple bids with the same value and have the correct winner", async () => {
    const auctionPayload = {
      title: "Test Auction",
      endTime: addDays(1).toISOString(),
    };
    const createAuctionResponse = await request(server)
      .post("/auctions")
      .set("Authorization", getAuthHeader("employee", "employee_password"))
      .send(auctionPayload);

    await request(server)
      .post(`/auctions/${createAuctionResponse.body.id}/bid`)
      .set("Authorization", getAuthHeader("bidder1", "bidder1_password"))
      .send({
        value: 100,
      });

    await request(server)
      .post(`/auctions/${createAuctionResponse.body.id}/bid`)
      .set("Authorization", getAuthHeader("bidder2", "bidder2_password"))
      .send({
        value: 99.9,
      });

    await request(server)
      .post(`/auctions/${createAuctionResponse.body.id}/bid`)
      .set("Authorization", getAuthHeader("bidder3", "bidder3_password"))
      .send({
        value: 100,
      });

    jest.useFakeTimers().setSystemTime(addDays(2));

    const auctionResponse = await request(server)
      .get(`/auctions/${createAuctionResponse.body.id}`)
      .set("Authorization", getAuthHeader("employee", "employee_password"))
      .send();

    expect(auctionResponse.status).toEqual(200);
    expect(auctionResponse.body).toMatchObject({
      id: createAuctionResponse.body.id,
      title: auctionPayload.title,
      endTime: auctionPayload.endTime,
      winnerUsername: "bidder1",
    });
  });
});
