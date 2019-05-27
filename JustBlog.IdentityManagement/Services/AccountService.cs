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
        private readonly IMessagingService _messagingService;
        private readonly ILogger _logger;
        private readonly IdentityDbContext _identityContext;

        public AccountService(UserManager<ApplicationUser> userManager,
                                SignInManager<ApplicationUser> signInManager,
                                IMessagingService emailSender,
                                ILogger<IAccountService> logger,
                                IdentityDbContext identityContext)
        {
            _userManager = userManager;
            _identityContext = identityContext;
            _signInManager = signInManager;
            _messagingService = emailSender;
            _logger = logger;
            
        }

        public async Task<IdentityResult> Register(RegisterViewModel model, string baseUrl, string requestSchema = "https")
        {
            try
            {
                var user = new ApplicationUser
                {
                    UserName = model.Email,
                    Email = model.Email,
                };

                var result = await _userManager.CreateAsync(user, model.Password);

                if (result.Succeeded)
                {
                    _logger.LogInformation("User created a new account with password.");

                    var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);

                    var callbackUrl = _messagingService.EmailConfirmationLink(user.Id, code, baseUrl,  requestSchema);

                    await _messagingService.SendEmailConfirmationAsync(model.Email, callbackUrl);
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

        private string ResetPasswordCallbackLink(string userId, string code, string scheme)
        {
            return "this is the password callback link";
        }
         
        public async Task<ApplicationUser> GetUser(string userName)
        {
            return await _userManager.FindByEmailAsync(userName);
        }

        /// <summary>
        /// Update the user model
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public async Task<UserViewModel> UpdateUser(UserViewModel user)
        {
            var applicationUser = await _userManager.FindByIdAsync(user.Id.ToString());

            _identityContext.Attach(applicationUser);

            // User information
            applicationUser.FirstName = user.FirstName;
            _identityContext.Entry(applicationUser).Property(p => p.FirstName).IsModified = true;

            applicationUser.LastName = user.LastName;
            _identityContext.Entry(applicationUser).Property(p => p.LastName).IsModified = true;

            applicationUser.BirthDate = user.Birthdate;
            _identityContext.Entry(applicationUser).Property(p => p.BirthDate).IsModified = true;

            if (string.IsNullOrEmpty(applicationUser.PhoneNumber))
            {
                applicationUser.PhoneNumber = user.PhoneNumber;
                _identityContext.Entry(applicationUser).Property(p => p.PhoneNumber).IsModified = true;
            }

            // Address
            applicationUser.AddressLine1 = user.AddressLine1;
            _identityContext.Entry(applicationUser).Property(p => p.AddressLine1).IsModified = true;

            applicationUser.AddressLine2 = user.AddressLine2;
            _identityContext.Entry(applicationUser).Property(p => p.AddressLine2).IsModified = true;

            applicationUser.City = user.City;
            _identityContext.Entry(applicationUser).Property(p => p.City).IsModified = true;

            applicationUser.State = user.State;
            _identityContext.Entry(applicationUser).Property(p => p.State).IsModified = true;

            applicationUser.PostalCode = user.PostalCode;
            _identityContext.Entry(applicationUser).Property(p => p.PostalCode).IsModified = true;

            applicationUser.Country = user.Country;
            _identityContext.Entry(applicationUser).Property(p => p.Country).IsModified = true;

            applicationUser.CountryCode = user.CountryCode;
            _identityContext.Entry(applicationUser).Property(p => p.CountryCode).IsModified = true;

            await _identityContext.SaveChangesAsync();

            return new UserViewModel(applicationUser);
        }
    }
}
