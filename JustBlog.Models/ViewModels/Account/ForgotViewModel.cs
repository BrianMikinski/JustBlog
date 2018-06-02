using System.ComponentModel.DataAnnotations;

namespace JustBlog.Models.ViewModels.Account
{
    public class ForgotViewModel
    {
        [Display(Name = "Email"), Required]
        public string Email { get; set; }
    }
}
