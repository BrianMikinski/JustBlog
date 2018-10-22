using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace JustBlog.UI.Filters
{
    /// <summary>
    /// This filter adds a XSRF-TOKEN to all requests. This is useful with SPA apps,
    /// because it means we do not have to regenerate an antiforgery token with our requests
    /// and can all api endpoints that have a [ValidateAntiForgeryToken].
    /// </summary>
    public class AngularAntiforgeryCookieResultFilterAttribute : ResultFilterAttribute
    {
        public static readonly string XSRF_TOKEN_NAME = "XSRF-TOKEN";

        private readonly IAntiforgery antiforgery;

        public AngularAntiforgeryCookieResultFilterAttribute(IAntiforgery antiforgery)
        {
            this.antiforgery = antiforgery;
        }

        public override void OnResultExecuting(ResultExecutingContext context)
        {
            if (context.Result is ObjectResult)
            {
                var tokens = antiforgery.GetAndStoreTokens(context.HttpContext);
                context.HttpContext.Response.Cookies.Append(XSRF_TOKEN_NAME, tokens.RequestToken, new CookieOptions() { HttpOnly = false });
            }
        }
    }
}
