import { AuctionJson } from "../../../domain/entities/auction.entity";

export interface Error {
  error: string;
}
export interface CreateAuctionRequest {
  title: string;
  endTime: string;
}

export type CreateAuctionResponse =
  | {
      id: string;
    }
  | Error;

export interface PlaceBidParams {
  id: string;
}

export interface PlaceBidRequest {
  value: number;
}

export type PlaceBidResponse = Record<string, never> | Error;

export interface AuctionParams {
  id: string;
}

export type AuctionResponse = AuctionJson | Error;
