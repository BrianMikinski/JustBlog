using JustBlog.IdentityManagement.Account;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace JustBlog.IdentityManagement.Login
{
    public class LoginModel
    {
        [Display(Name = "Password (*)"), Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }

        [Display(Name = "User name (*)"), Required(ErrorMessage = "User name is required")]
        public string UserName { get; set; }
    }

    /// <summary>
    /// Model to handle that status of a login attempt
    /// </summary>
    public class LoginStatus
    {
        public LoginStatus()
        {
            User = new ApplicationUser();
        }

        public string Message { get; set; }

        public string ReturnURL { get; set; }

        public SignInResult Status { get; set; }

        public ApplicationUser User { get; set; }
    }
}