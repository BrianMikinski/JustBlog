using System.ComponentModel.DataAnnotations;

namespace JustBlog.Models.ViewModels.Account
{
    /// <summary>
    /// Model used to confirm a user's updated email address
    /// </summary>
    public class UpdateLoginViewModel
    {
        [Required, Display(Name = "New Confirm Email"), EmailAddress]
        public string ConfirmNewEmail { get; set; }

        [Required, Display(Name = "New Email"), EmailAddress]
        public string NewEmail { get; set; }

        [Required, Display(Name = "Old Email"), EmailAddress]
        public string OldEmail { get; set; }
    }
}
