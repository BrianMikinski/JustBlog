using JustBlog.IdentityManagement.ManageViewModels;
using JustBlog.Models.ViewModels.Verification;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace JustBlog.UI.Controllers
{
    /// <summary>
    /// Endpoints for verification of second factor codes
    /// </summary>
    public class VerificationController : Controller
    {
        [HttpGet, AllowAnonymous]
        public async Task<ActionResult> SendCode(string returnUrl, bool rememberMe)
        {
            throw new NotImplementedException();
        }

        [HttpPost, AllowAnonymous, AutoValidateAntiforgeryToken]
        public async Task<ActionResult> SendCode(SendCodeViewModel model)
        {
            throw new NotImplementedException();
        }

        [HttpGet, AllowAnonymous]
        public async Task<ActionResult> VerifyCode(string provider, string returnUrl, bool rememberMe)
        {
            throw new NotImplementedException();
        }

        [HttpPost, AllowAnonymous, AutoValidateAntiforgeryToken]
        public async Task<ActionResult> VerifyCode(VerifyCodeViewModel model)
        {
            throw new NotImplementedException();
        }
    }
}
