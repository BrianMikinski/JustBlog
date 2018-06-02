using System.ComponentModel.DataAnnotations;

namespace JustBlog.IdentityManagement.Passwords
{
    public class ForgotPasswordViewModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
