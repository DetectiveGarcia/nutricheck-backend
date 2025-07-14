export type JWTUserPayload = {
    userId: string;
    iat: number;
    exp: number;
    [key: string]: any;
}
