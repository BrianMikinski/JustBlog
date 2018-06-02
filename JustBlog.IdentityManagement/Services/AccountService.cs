using JustBlog.IdentityManagement.Account;
using JustBlog.IdentityManagement.Login;
using JustBlog.IdentityManagement.ManageViewModels;
using JustBlog.IdentityManagement.Register;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace JustBlog.IdentityManagement.Services
{
    public class AccountService : IAccountService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IEmailSender _emailSender;
        private readonly ILogger _logger;

        public AccountService(UserManager<ApplicationUser> userManager,
                                SignInManager<ApplicationUser> signInManager,
                                IEmailSender emailSender,
                                ILogger<IAccountService> logger)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _emailSender = emailSender;
            _logger = logger;
        }

        public async Task<IdentityResult> Register(RegisterViewModel model, string requestSchema)
        {
            try
            {
                var user = new ApplicationUser
                {
                    UserName = model.Email,
                    Email = model.Email,
                    BirthDate = model.BirthDate,
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    Hometown = model.Hometown,
                };

                var result = await _userManager.CreateAsync(user, model.Password);

                if (result.Succeeded)
                {
                    _logger.LogInformation("User created a new account with password.");

                    var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                    var callbackUrl = EmailConfirmationLink(user.Id, code, requestSchema);
                    await _emailSender.SendEmailConfirmationAsync(model.Email, callbackUrl);

                    //await _signInManager.SignInAsync(user, isPersistent: false, authenticationMethod: string.Empty);
                }

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error registering new user:  {ex.Message}");
                throw;
            }
        }

        /// <summary>
        /// Remove the login provider from the user. this removes a user from being able to user an external login provider -
        /// i.e. Facebook, Google, Microsoft. This is not the same as deleting the user from the app identity database which is called via
        /// UserManager.DeleteAsync();
        /// </summary>
        /// <param name="model"></param>
        /// <param name="userPrincipal"></param>
        /// <returns></returns>
        public async Task RemoveLogin(RemoveLoginViewModel model, ClaimsPrincipal userPrincipal)
        {
            try
            {
                var user = await _userManager.GetUserAsync(userPrincipal);

                if (user == null)
                {
                    throw new ApplicationException($"Unable to load user with ID '{_userManager.GetUserId(userPrincipal)}'.");
                }

                var result = await _userManager.RemoveLoginAsync(user, model.LoginProvider, model.ProviderKey);

                if (!result.Succeeded)
                {
                    throw new ApplicationException($"Unexpected error occurred removing external login for user with ID '{user.Id}'.");
                }

                await _signInManager.SignInAsync(user, isPersistent: false);

                _logger.LogInformation($"User {userPrincipal.Identity.Name} has been removed");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error removing login provider for user:  {ex.Message}");
                throw;
            }
        }

        /// <summary>
        /// Delete a user from the data store using a user principal
        /// </summary>
        /// <returns></returns>
        public async Task DeleteUserAsync(ClaimsPrincipal userPrincipal)
        {
            try
            {
                var user = await _userManager.GetUserAsync(userPrincipal);
                if (user == null)
                {
                    throw new ApplicationException($"Unable to load user with ID '{_userManager.GetUserId(userPrincipal)}'.");
                }

                var result = await _userManager.DeleteAsync(user);

                if (!result.Succeeded)
                {
                    throw new ApplicationException($"Unexpected error occurred deleting user with ID '{user.Id}'.");
                }

                await _signInManager.SignOutAsync();

                _logger.LogInformation($"User {userPrincipal.Identity.Name} has been deleted from the user store");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting user account:  {ex.Message}");
                throw;
            }
        }

        /// <summary>
        /// Delete a user from the data store using an application user
        /// </summary>
        /// <param name="applicationUser"></param>
        /// <returns></returns>
        public async Task DeleteUserAsync(ApplicationUser applicationUser)
        {
            try
            {
                var result = await _userManager.DeleteAsync(applicationUser);

                if (!result.Succeeded)
                {
                    throw new ApplicationException($"Unexpected error occurred loading application user'{applicationUser.UserName}'.");
                }

                _logger.LogInformation($"User {applicationUser.UserName} has been deleted from the user store");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting user account:  {ex.Message}");
                throw;
            }
        }

        /// <summary>
        /// Login a user using the login view model
        /// </summary>
        /// <param name="model"></param>
        /// <param name="returnUrl"></param>
        /// <returns></returns>
        public async Task<SignInResult> Login(LoginViewModel model)
        {
            try
            {
                // This doesn't count login failures towards account lockout
                // To enable password failures to trigger account lockout, set lockoutOnFailure: true
                var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, lockoutOnFailure: false);

                if (result.Succeeded)
                {
                    _logger.LogInformation($"User {model.Email} logged in.");
                    return result;
                }
                else
                {
                    throw new ApplicationException($"Eorr logging in user {model.Email}");
                }
            }
            catch(Exception ex)
            {
                _logger.LogError($"Error signing in new user:  {ex.Message}");
                throw;
            }
        }

        /// <summary>
        /// Generate an email confirmation link based on the user id, confirmation code and request protocol scheme
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="code"></param>
        /// <param name="scheme"></param>
        /// <returns></returns>
        private string EmailConfirmationLink(string userId, string code, string scheme)
        {
            return $"{scheme}\\\\baseurl.com\\Account\\ConfirmEmail\\userId?{userId}code?{code}";
        }

        private string ResetPasswordCallbackLink(/*this IUrlHelper urlHelper, */string userId, string code, string scheme)
        {
            return "this is the password callback link";
            //return urlHelper.Action(
            //    action: nameof(AccountController.ResetPassword),
            //    controller: "Account",
            //    values: new { userId, code },
            //    protocol: scheme);
        }
    }
}
