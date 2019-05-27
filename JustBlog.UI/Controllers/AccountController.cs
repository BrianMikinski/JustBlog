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
using System;
using System.Text;
using System.Threading.Tasks;

namespace JustBlog.UI.Controllers
{
    [Authorize]
    [Route("api/[controller]/[action]")]
    public class AccountController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMessagingService _emailSender;
        private readonly ILogger _logger;
        private readonly IAccountService _accountService;
        private readonly DomainOptions _baseUrlOptions;
        private readonly IMessagingService _messagingService;

        public AccountController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IMessagingService emailSender,
            ILogger<AccountController> logger,
            IAccountService accountService,
            IMessagingService messagingService,
            IOptions<DomainOptions> baseUrlOptions)
        {
            _userManager = userManager;
            _emailSender = emailSender;
            _logger = logger;
            _accountService = accountService;
            _baseUrlOptions = baseUrlOptions.Value;
            _messagingService = messagingService;
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
                result = await _accountService.Register(model, _baseUrlOptions.BaseUrl);
            }

            return new RegistrationAttempt(model, result.Succeeded, result.Errors);
        }

        /// <summary>
        /// Confirm email address after being logged in
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> ConfirmEmail()
        {
            var user = await _userManager.FindByEmailAsync(User.FindFirst("sub").Value);

            if(user != null)
            {
                var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                var callbackUrl = _messagingService.EmailConfirmationLink(user.Id, code, _baseUrlOptions.BaseUrl, "https");

                await _messagingService.SendEmailConfirmationAsync(user.Email, callbackUrl);

                return Ok();
            }
            else
            {
                return BadRequest("User id could not be found");
            }
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> ConfirmEmail(string userId, string code)
        {
            if (userId == null || code == null)
            {
                return BadRequest("Null user id or code.");
            }

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return BadRequest($"Unable to load user with ID '{userId}'.");
            }

            byte[] data = Convert.FromBase64String(code);
            string decodedString = Encoding.UTF8.GetString(data);

            var result = await _userManager.ConfirmEmailAsync(user, decodedString);

            if (result.Succeeded)
            {
                return Ok();
            }

            return BadRequest("Could not confirm code.");
        }

        /// <summary>
        /// Reset password
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordViewModel model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var user = await _userManager.FindByEmailAsync(model.Email);

                    if (user == null || !await _userManager.IsEmailConfirmedAsync(user))
                    {
                        // Don't reveal that the user does not exist or is not confirmed
                        return BadRequest("Invalid model. Could not send password rest email.");
                    }

                    var code = await _userManager.GeneratePasswordResetTokenAsync(user);
                    var callbackUrl = _emailSender.PasswordResetConfirmationLink(user.Id, code, _baseUrlOptions.BaseUrl, "https");

                    await _emailSender.SendPasswordResetAsync(model.Email, callbackUrl);

                    return Ok();
                }
                catch(Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }

            return BadRequest("Invalid model. Could not send password rest email.");
        }

        /// <summary>
        /// Get the users account
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> MyAccount()
        {
            var ApplicationUser = await _accountService.GetUser(User.FindFirst("sub").Value);

            return Ok(new UserViewModel(ApplicationUser));
        }

        /// <summary>
        /// Update a users account
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        [HttpPut]
        public async Task<IActionResult> UpdateAccount([FromBody]UserViewModel user)
        {
            var modifiedUser = await _accountService.UpdateUser(user);

            return Ok(modifiedUser);
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