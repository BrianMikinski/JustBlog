using System.ComponentModel.DataAnnotations;

namespace JustBlog.Models.ViewModels.Login
{
    public class LoginViewModel
    {
        [EmailAddress, Required, Display(Name = "Email")]
        public string Email { get; set; }

        [Display(Name = "Password"), Required, DataType(DataType.Password)]
        public string Password { get; set; }

        [Display(Name = "Remember me?")]
        public bool RememberMe { get; set; }
    }
}
