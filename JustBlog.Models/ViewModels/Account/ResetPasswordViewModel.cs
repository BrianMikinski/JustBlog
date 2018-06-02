using System.ComponentModel.DataAnnotations;

namespace JustBlog.Models.ViewModels.Account
{
    public class ResetPasswordViewModel
    {
        public string Code { get; set; }

        [Compare("Password", ErrorMessage = "The password and confirmation password do not match."), DataType(DataType.Password), Display(Name = "Confirm password")]
        public string ConfirmPassword { get; set; }

        [Display(Name = "Email"), Required, EmailAddress]
        public string Email { get; set; }

        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [Display(Name = "Password"), Required, DataType(DataType.Password)]
        public string Password { get; set; }

        [Display(Name = "Phone Number"), Required]
        public string PhoneNumber { get; set; }
    }
}
