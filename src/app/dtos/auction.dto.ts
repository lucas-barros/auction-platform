export interface CreateAuctionRequestDTO {
  title: string;
  endTime: string;
}

export type CreateAuctionResponseDTO =
  | {
      id: string;
    }
  | { error: string };

export interface PlaceBidParamsDTO {
  id: string;
}

export interface PlaceBidRequestDTO {
  value: number;
}

export type PlaceBidResponseDTO = Record<string, never> | { error: string };

export interface AuctionParamsDTO {
  id: string;
}

export type AuctionResponseDTO =
  | {
      id: string;
      title: string;
      endTime: string;
      winnerUsername: string | null;
    }
  | { error: string };
