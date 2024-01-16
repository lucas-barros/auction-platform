import { AuctionJson } from "../../../domain/entities/auction.entity";
import { AuctionResponse, CreateAuctionResponse, Error } from "../dtos/auction.dto";

export type Html = string;

export type CreateAuctionView = CreateAuctionResponse | Html;

export type PlaceBidView = void | Error | Html;

export type GetByIdView = AuctionResponse | Error | Html;

export interface BaseAuctionView<CreateView, GetByIdView, ErrorView> {
  create: (id: string) => CreateView;
  getById: (auction: AuctionJson) => GetByIdView;
  error: (error: string) => ErrorView;
}

export type AuctionJsonView = BaseAuctionView<
  CreateAuctionResponse,
  AuctionJson,
  Error
>;

export type AuctionHtmlView = BaseAuctionView<Html, Html, Html>;

export type AuctionView = AuctionJsonView | AuctionHtmlView;

export const auctionJsonView: AuctionJsonView = {
  create: (id: string) => ({
    id,
  }),
  getById: (auction) => auction,
  error: (error: string) => ({
    error,
  }),
};

export const auctionHtmlView: AuctionHtmlView = {
  create: (id) => `<div>${id}</div>`,
  getById: (auction) => `<div>
    <div>${auction.id}</div>
    <div>${auction.title}</div>
    <div>${auction.endTime}</div>
    <div>${auction.winnerUsername}</div>
  </div>`,
  error: (error) => `<div>${error}</div>`,
};
