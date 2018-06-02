using System.ComponentModel.DataAnnotations;
namespace JustBlog.Models.ViewModels.Account
{
    public class ForgotPasswordViewModel
    {
        [Display(Name = "Email"), Required, EmailAddress]
        public string Email { get; set; }
    }
}
