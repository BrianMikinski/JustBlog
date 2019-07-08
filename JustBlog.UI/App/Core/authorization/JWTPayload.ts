import { Claim } from "core/authorization/Claim";

/**
 * Authentication model for JWT tokens
 */
export class JwtPayload {

    Issuer: string;
    Audience: string;
    NotBefore: number;
    Expiration: number;
    Claims: Array<Claim>;

    IsValid(): boolean {

        let now: number = Date.now();

        // Need to account for millisecond offset. Token is not issed to the millisecond
        if (this.Expiration * 1000 > now && this.NotBefore * 1000 < now) {
            return true;
        } else {
            return false;
        }
    }
}