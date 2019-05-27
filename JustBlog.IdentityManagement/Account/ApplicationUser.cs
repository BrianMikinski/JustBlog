using Microsoft.AspNetCore.Identity;
using System;
using System.ComponentModel.DataAnnotations;

namespace JustBlog.IdentityManagement.Account
{
    /// <summary>
    /// Data model representation of an application user
    /// </summary>
    public class ApplicationUser : IdentityUser
    {
        [Display(Name = "Birthday")]
        public DateTime? BirthDate { get; set; }

        [Display(Name = "First Name"), StringLength(100, MinimumLength = 1, ErrorMessage = "The {0} must be at least {2} characters long.")]
        public string FirstName { get; set; }

        [Display(Name = "Last Name"), StringLength(100, MinimumLength = 1, ErrorMessage = "The {0} must be at least {2} characters long.")]
        public string LastName { get; set; }

        [Display(Name = "Address Line 1"), StringLength(100, MinimumLength = 1, ErrorMessage = "The {0} must be at least {2} characters long.")]
        public string AddressLine1 { get; set; }

        [Display(Name = "Address Line 2"), StringLength(100, MinimumLength = 1, ErrorMessage = "The {0} must be at least {2} characters long.")]
        public string AddressLine2 { get; set; }

        [Display(Name = "City"), StringLength(100, MinimumLength = 1, ErrorMessage = "The {0} must be at least {2} characters long.")]
        public string City { get; set; }

        [Display(Name = "State"), StringLength(100, MinimumLength = 1, ErrorMessage = "The {0} must be at least {2} characters long.")]
        public string State { get; set; }

        [Display(Name = "Postal Code"), StringLength(100, MinimumLength = 1, ErrorMessage = "The {0} must be at least {2} characters long.")]
        public string PostalCode { get; set; }

        [Display(Name = "Country"), StringLength(100, MinimumLength = 1, ErrorMessage = "The {0} must be at least {2} characters long.")]
        public string Country { get; set; }

        [Display(Name = "Country Code"), StringLength(15, MinimumLength = 1, ErrorMessage = "The {0} must be at least {15} characters long.")]
        public string CountryCode { get; set; }
    }
}
