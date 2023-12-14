import { v4 } from "uuid";

export class Auction {
  private id: string;
  private title: string;
  private endTime: Date;
  private winnerUsername: string | null;

  constructor({
    id,
    title,
    endTime,
    winnerUsername = null,
  }: {
    id?: string;
    title: string;
    endTime: string;
    winnerUsername?: string | null;
  }) {
    this.id = id ?? v4();
    this.title = title;
    this.endTime = new Date(endTime);
    this.winnerUsername = winnerUsername;
  }

  getId(): string {
    return this.id;
  }

  getTitle(): string {
    return this.title;
  }

  getEndTime(): Date {
    return this.endTime;
  }

  getWinnerUsername(): string | null {
    return this.winnerUsername;
  }

  setWinnerUsername(winnerUsername: string | null) {
    this.winnerUsername = winnerUsername;
  }

  toJson() {
    return {
      id: this.id,
      title: this.title,
      endTime: this.endTime.toISOString(),
      winnerUsername: this.winnerUsername,
    };
  }
}
