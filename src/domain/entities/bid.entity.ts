import { v4 } from "uuid";

export class Bid {
  private id: string;
  private value: number;
  private timestamp: string;
  private username: string;
  private auctionId: string;

  constructor({
    id,
    value,
    username,
    auctionId,
    timestamp,
  }: {
    id?: string;
    value: number;
    username: string;
    auctionId: string;
    timestamp?: string;
  }) {
    this.id = id ?? v4();
    this.value = value;
    this.username = username;
    this.auctionId = auctionId;
    this.timestamp = timestamp || new Date().toISOString();
  }

  getId(): string {
    return this.id;
  }

  getValue(): number {
    return this.value;
  }

  getTimestamp(): string {
    return this.timestamp;
  }

  getUsername(): string {
    return this.username;
  }

  toJson() {
    return {
      id: this.id,
      value: this.value,
      username: this.username,
      auctionId: this.auctionId,
      timestamp: this.timestamp,
    };
  }
}
