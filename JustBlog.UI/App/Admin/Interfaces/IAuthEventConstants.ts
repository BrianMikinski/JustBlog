
// Authorization events that are published and read by the application
export interface AuthEventConstants {
    loginSuccess: "auth-login-success",
    loginFailed: "auth-login-failed",
    logoutSuccess: "auth-logout-success",
    sessionTimeout: "auth-session-timeout",
    notAuthenticated: "auth-not-authenticated",
    notAuthorized: "auth-not-authorized"
}