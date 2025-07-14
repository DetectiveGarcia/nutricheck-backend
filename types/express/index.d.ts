import { Request } from "express";

export type RefreshRequest = Request & {
  cookies: {
    refreshToken?: string;
  };
};

export type AuthenticatedRequest = Request & {
  user?: {
    userId: string
  };
};


