/**
 * Model for logging in a user with OAuth
 */
export class TokenLoginModel {
    grant_type: string;
    username: string;
    password: string;
}