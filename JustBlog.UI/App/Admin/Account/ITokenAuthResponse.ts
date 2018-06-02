//Class representing an I TokenAuthResponse
export interface ITokenAuthResponse {
    auth_token: string;
    expires_in: number;
    token_type: string;
}