using System.ComponentModel.DataAnnotations;

namespace JustBlog.Models.ViewModels.Account
{
    public class AddPhoneNumberViewModel
    {
        [Required]
        [Phone]
        [Display(Name = "Phone Number")]
        public string Number { get; set; }
    }
}
