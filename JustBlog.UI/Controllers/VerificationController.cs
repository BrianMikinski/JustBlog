using JustBlog.IdentityManagement.ManageViewModels;
using JustBlog.Models.ViewModels.Verification;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace JustBlog.UI.Controllers
{
    /// <summary>
    /// Endpoints for verification of second factor codes and issueance of anti forgery tokens
    /// </summary>
    //[Authorize, Route(RoutePrefixes.VERIFICATION_RESOURCE)]
    public class VerificationController : Controller
    {
        /// <summary>
        /// Generate and anti forgery token for use with http post requests
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous, HttpPost, Route(nameof(VerificationController.GenerateAntiForgeryToken))]
        public string GenerateAntiForgeryToken()
        {
            //string cookieToken, formToken;
            //IAntiforgery.GetTokens(null, out cookieToken, out formToken);

            return null;// cookieToken + ":" + formToken;
        }

        [HttpGet, AllowAnonymous, Route(nameof(VerificationController.SendCode))]
        public async Task<ActionResult> SendCode(string returnUrl, bool rememberMe)
        {
            throw new NotImplementedException();
        }

        [HttpPost, AllowAnonymous, ValidateAntiForgeryToken, Route(nameof(VerificationController.SendCode))]
        public async Task<ActionResult> SendCode(SendCodeViewModel model)
        {
            throw new NotImplementedException();
        }

        [HttpGet, AllowAnonymous, Route(nameof(VerificationController.VerifyCode))]
        public async Task<ActionResult> VerifyCode(string provider, string returnUrl, bool rememberMe)
        {
            throw new NotImplementedException();
        }

        [HttpPost, AllowAnonymous, ValidateAntiForgeryToken, Route(nameof(VerificationController.VerifyCode))]
        public async Task<ActionResult> VerifyCode(VerifyCodeViewModel model)
        {
            throw new NotImplementedException();
        }
    }
}
