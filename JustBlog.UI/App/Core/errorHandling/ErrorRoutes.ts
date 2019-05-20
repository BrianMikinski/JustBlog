import * as angular from "angular";

let errorRoutes: ErrorRoutes = {
    BadRequest400: "api/BadRequestTest",
    Unauthorized401: "api/UnauthorizedTest",
    NotFound404: "api/NotFoundTest",
    InternalServerError500: "api/InternalServerErrorTest",
}

// admin api routes
export interface ErrorRoutes {
    BadRequest400: string,
    Unauthorized401: string
    NotFound404: string,
    InternalServerError500: string
}

angular
    .module("core")
    .constant("ERROR_ROUTES", errorRoutes)