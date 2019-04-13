using JustBlog.IdentityManagement.Account;
using JustBlog.IdentityManagement.Passwords;
using JustBlog.IdentityManagement.Register;
using JustBlog.IdentityManagement.Services;
using JustBlog.UI.Filters;
using JustBlog.UI.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace JustBlog.UI.Controllers
{
    [Authorize]
    [Route("[controller]/[action]")]
    public class AccountController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMessagingService _emailSender;
        private readonly ILogger _logger;
        private readonly IAccountService _accountService;
        private readonly DomainOptions _baseUrlOptions;

        public AccountController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IMessagingService emailSender,
            ILogger<AccountController> logger,
            IAccountService accountService,
            IOptions<DomainOptions> baseUrlOptions)
        {
            _userManager = userManager;
            _emailSender = emailSender;
            _logger = logger;
            _accountService = accountService;
            _baseUrlOptions = baseUrlOptions.Value;
        }

        /// <summary>
        /// Method used to generate and add an XSRF token to the headers via a global filter.
        /// This is most commonly used by the test server for integration tests.
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpGet]
        public string AntiForgeryToken()
        {
            return $"Anti-forgery token has been generated and added to " +
                $"the header as \"XSRF_TOKEN_NAME\" from the" +
                $" {nameof(AngularAntiforgeryCookieResultFilterAttribute)} global filter";
        }

        [TempData]
        public string ErrorMessage { get; set; }

        [HttpPost]
        [AllowAnonymous]
        [AutoValidateAntiforgeryToken]
        public async Task<RegistrationAttempt> Register(RegisterViewModel model, string returnUrl = null)
        {
            var registrationErrors = new IdentityError[]
            {
                new IdentityError()
                {
                    Code = "UNC1",
                    Description = "User manager has not attempted to create a user"
                }
            };

            IdentityResult result = IdentityResult.Failed(registrationErrors);

            if (ModelState.IsValid)
            {
                result = await _accountService.Register(model, _baseUrlOptions.BaseUrl, "http");
            }

            return new RegistrationAttempt(model, result.Succeeded, result.Errors);
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> ConfirmEmail(string userId, string code)
        {
            if (userId == null || code == null)
            {
                return Redirect("");
            }
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new AccountException($"Unable to load user with ID '{userId}'.");
            }
            var result = await _userManager.ConfirmEmailAsync(user, code);
            return View(result.Succeeded ? "ConfirmEmail" : "Error");
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult ForgotPassword()
        {
            return View();
        }

        [HttpPost]
        [AllowAnonymous]
        [AutoValidateAntiforgeryToken]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.FindByEmailAsync(model.Email);

                if (user == null || !await _userManager.IsEmailConfirmedAsync(user))
                {
                    // Don't reveal that the user does not exist or is not confirmed
                    return BadRequest();
                }

                // For more information on how to enable account confirmation and password reset please
                // visit https://go.microsoft.com/fwlink/?LinkID=532713
                var code = await _userManager.GeneratePasswordResetTokenAsync(user);

                var callbackUrl = "";

                await _emailSender.SendEmailAsync("", model.Email, "Reset Password",
                   $"Please reset your password by clicking here: <a href='{callbackUrl}'>link</a>");
                return Ok();
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> ResetPassword(ResetPasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid password reset model model.");
            }

            var user = await _userManager.FindByEmailAsync(model.Email);

            if (user == null)
            {
                // Don't reveal that the user does not exist
                return BadRequest("User could not be found.");
            }

            var result = await _userManager.ResetPasswordAsync(user, model.Code, model.Password);

            if (result.Succeeded)
            {
                return Ok();
            }

            return BadRequest("Account could not be reset.");
        }
    }
}