using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace JustBlog.IdentityManagement.Passwords
{
    public class ForgotPasswordViewModel
    {
        [JsonProperty]
        [Required]
        [EmailAddress]
        public string Email { get; private set; }
    }
}
