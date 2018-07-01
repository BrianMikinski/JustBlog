//using System;
//using System.Net.Http;
//using System.Threading;
//using System.Threading.Tasks;
//using System.Web;
//using System.Web.Helpers;
//using System.Web.Http.Controllers;
//using System.Web.Mvc;

//namespace JustBlog.UI.Filters
//{
//    /// <summary>
//    /// Custom authorization filter that allows us to use anti forgery in our requests with AngularJS Applications
//    /// </summary>
//    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false, Inherited = true)]
//    public class MyValidateAntiForgeryTokenAttribute : FilterAttribute, IAuthorizationFilter
//    {
//        /// <summary>
//        /// Validate the header to insure that it includes a RequestVerificationToken
//        /// </summary>
//        /// <param name="request"></param>
//        private void ValidateRequestHeader(HttpRequestBase request)
//        {
//            string cookieToken = string.Empty;
//            string formToken = string.Empty;
//            string tokenValue = request.Headers["RequestVerificationToken"];
//            if (!string.IsNullOrEmpty(tokenValue))
//            {
//                string[] tokens = tokenValue.Split(':');
//                if (tokens.Length == 2)
//                {
//                    cookieToken = tokens[0].Trim();
//                    formToken = tokens[1].Trim();
//                }
//            }
//            AntiForgery.Validate(cookieToken, formToken);
//        }

//        public void OnAuthorization(AuthorizationContext filterContext)
//        {
//            try
//            {
//                if (filterContext.HttpContext.Request.IsAjaxRequest())
//                {
//                    ValidateRequestHeader(filterContext.HttpContext.Request);
//                }
//                else
//                {
//                    ValidateRequestHeader(filterContext.HttpContext.Request);
//                }
//            }
//            catch (HttpAntiForgeryException e)
//            {
//                throw new HttpAntiForgeryException("Anti forgery token cookie not found.");
//            }
//        }

//        public Task<HttpResponseMessage> ExecuteAuthorizationFilterAsync(HttpActionContext actionContext, CancellationToken cancellationToken, Func<Task<HttpResponseMessage>> continuation)
//        {
//            throw new NotImplementedException();
//        }
//    }
//}