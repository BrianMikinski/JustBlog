using System;
using System.ComponentModel.DataAnnotations;

namespace JustBlog.Models.ViewModels.Registration
{
    /// <summary>
    /// Viewmodel used to register new admins
    /// </summary>
    public class RegisterViewModel
    {
        [Required, Display(Name = "Birthday")]
        public DateTime BirthDate { get; set; }

        [Required, Display(Name = "Confirm password"), DataType(DataType.Password), Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }

        [Required, Display(Name = "Email"), EmailAddress]
        public string Email { get; set; }

        [Required, Display(Name = "First Name"), StringLength(50, MinimumLength = 1, ErrorMessage = "The {0} must be at least {2} characters long.")]
        public string FirstName { get; set; }

        [Required, Display(Name = "Hometown")]
        public string Hometown { get; set; }

        [Required, Display(Name = "Last Name"), StringLength(50, MinimumLength = 1, ErrorMessage = "The {0} must be at least {2} characters long.")]
        public string LastName { get; set; }

        [Required, Display(Name = "Password"), DataType(DataType.Password), StringLength(16, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 8)]
        public string Password { get; set; }

        [Required, Display(Name = "Phone Number")]
        public string PhoneNumber { get; set; }
    }
}
