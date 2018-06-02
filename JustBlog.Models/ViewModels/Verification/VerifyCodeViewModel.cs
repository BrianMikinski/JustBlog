using System.ComponentModel.DataAnnotations;

namespace JustBlog.Models.ViewModels.Verification
{
    public class VerifyCodeViewModel
    {
        [Display(Name = "Code"), Required]
        public string Code { get; set; }

        [Required]
        public string Provider { get; set; }

        [Display(Name = "Remember this browser?")]
        public bool RememberBrowser { get; set; }

        public bool RememberMe { get; set; }

        public string ReturnUrl { get; set; }
    }
}
