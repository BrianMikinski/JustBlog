using Microsoft.AspNetCore.Identity;
using System;
using System.ComponentModel.DataAnnotations;

namespace JustBlog.IdentityManagement.Account
{
    public class ApplicationUser : IdentityUser
    {
        [Required, Display(Name = "Birthday")]
        public DateTime? BirthDate { get; set; }

        [Required, Display(Name = "First Name"), StringLength(50, MinimumLength = 1, ErrorMessage = "The {0} must be at least {2} characters long.")]
        public string FirstName { get; set; }

        [Required, Display(Name = "Hometown")]
        public string Hometown { get; set; }

        [Required, Display(Name = "Last Name"), StringLength(50, MinimumLength = 1, ErrorMessage = "The {0} must be at least {2} characters long.")]
        public string LastName { get; set; }
    }
}
