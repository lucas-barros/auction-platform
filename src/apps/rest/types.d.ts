import { User } from "../../domain/entities/user.entity";

declare global {
  declare namespace Express {
    interface Locals {
      username: string;
      permissions: string[];
    }
  }
}
