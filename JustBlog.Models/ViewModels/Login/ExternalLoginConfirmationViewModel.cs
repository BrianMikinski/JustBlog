using System.ComponentModel.DataAnnotations;

namespace JustBlog.Models.ViewModels.Login
{
    public class ExternalLoginConfirmationViewModel
    {
        [Display(Name = "Email"), Required]
        public string Email { get; set; }

        [Display(Name = "Hometown")]
        public string Hometown { get; set; }
    }
}
