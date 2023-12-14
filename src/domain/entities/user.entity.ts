export enum Permission {
  CreateAuction = "create_auction",
  ViewAuction = "view_auction",
  Bid = "bid",
}

export class User {
  private username: string;
  private password: string;
  private permissions: string[];

  constructor({
    username,
    password,
    permissions,
  }: {
    username: string;
    password: string;
    permissions: string[];
  }) {
    this.username = username;
    this.password = password;
    this.permissions = permissions;
  }

  getUsername(): string {
    return this.username;
  }

  getPassword(): string {
    return this.password;
  }

  getPermissions(): string[] {
    return this.permissions;
  }
}
