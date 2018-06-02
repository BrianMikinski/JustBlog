using System.ComponentModel.DataAnnotations;

namespace JustBlog.IdentityManagement.Login
{
    public class ExternalLoginViewModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
