using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace JustBlog.IdentityManagement.Passwords
{
    public class ResetPasswordViewModel
    {
        [JsonProperty]
        [Required]
        [EmailAddress]
        public string Email { get; private set; }

        [JsonProperty]
        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        public string Password { get; private set; }

        [JsonProperty]
        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; private set; }

        [JsonProperty]
        public string Code { get; private set; }
    }
}
