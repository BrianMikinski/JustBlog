using System;
using System.ComponentModel.DataAnnotations;

namespace JustBlog.Models.ViewModels.Account
{
    /// <summary>
    /// Model used for updating a users account
    /// </summary>
    public class UpdateAccountViewModel
    {
        [Required, Display(Name = "Birthday")]
        public DateTime BirthDate { get; set; }

        [Required, Display(Name = "First Name"), StringLength(50, MinimumLength = 1, ErrorMessage = "The {0} must be at least {2} characters long.")]
        public string FirstName { get; set; }

        [Required, Display(Name = "Hometown")]
        public string Hometown { get; set; }

        [Required, Display(Name = "Last Name"), StringLength(50, MinimumLength = 1, ErrorMessage = "The {0} must be at least {2} characters long.")]
        public string LastName { get; set; }

        [Required, Display(Name = "Phone Number")]
        public string PhoneNumber { get; set; }
    }
}
