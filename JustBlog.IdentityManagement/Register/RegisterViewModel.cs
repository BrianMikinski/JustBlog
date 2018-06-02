using System;
using System.ComponentModel.DataAnnotations;

namespace JustBlog.IdentityManagement.Register
{
    public class RegisterViewModel
    {
        [Required]
        [EmailAddress]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }

        [Required, Display(Name = "Birthday")]
        public DateTime BirthDate { get; set; }

        [Required, Display(Name = "First Name"), StringLength(50, MinimumLength = 1, ErrorMessage = "The {0} must be at least {2} characters long.")]
        public string FirstName { get; set; }

        [Required, Display(Name = "Hometown")]
        public string Hometown { get; set; }

        [Required, Display(Name = "Last Name"), StringLength(50, MinimumLength = 1, ErrorMessage = "The {0} must be at least {2} characters long.")]
        public string LastName { get; set; }

        [Required, Display(Name = "Phone Number"), StringLength(15, MinimumLength = 9, ErrorMessage = "The {0} must be at least {2} characters long.")]
        public string PhoneNumber { get; set; }
    }
}
