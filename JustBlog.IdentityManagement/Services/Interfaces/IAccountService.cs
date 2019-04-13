using JustBlog.IdentityManagement.Account;
using JustBlog.IdentityManagement.Login;
using JustBlog.IdentityManagement.ManageViewModels;
using JustBlog.IdentityManagement.Register;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using System.Threading.Tasks;

namespace JustBlog.IdentityManagement.Services
{
    public interface IAccountService
    {
        Task DeleteUserAsync(ClaimsPrincipal userPrincipal);

        Task DeleteUserAsync(ApplicationUser applicationUser);

        Task<SignInResult> Login(LoginViewModel model);

        Task<IdentityResult> Register(RegisterViewModel model, string baseUrl, string requestSchema = "https");

        Task RemoveLogin(RemoveLoginViewModel model, ClaimsPrincipal userPrincipal);
    }
}