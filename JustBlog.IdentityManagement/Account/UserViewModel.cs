using Newtonsoft.Json;
using System;

namespace JustBlog.IdentityManagement.Account
{
    /// <summary>
    /// View Model Representation of a user
    /// </summary>
    public class UserViewModel
    {
        /// <summary>
        /// Required for serialization
        /// </summary>
        public UserViewModel()
        {

        }

        public UserViewModel(ApplicationUser user)
        {
            FirstName = user.FirstName;
            LastName = user.LastName;
            Birthdate = user.BirthDate;

            Email = user.Email;
            EmailConfirmed = user.EmailConfirmed;

            PhoneNumber = user.PhoneNumber;
            PhoneNumberConfirmed = user.PhoneNumberConfirmed;

            TwoFactorEnabled = user.TwoFactorEnabled;

            AddressLine1 = user.AddressLine1;
            AddressLine2 = user.AddressLine2;
            City = user.City;
            Country = user.Country;
            PostalCode = user.PostalCode;

            State = user.State;

            UserName = user.UserName;

            if (!string.IsNullOrEmpty(user.Id) && Guid.TryParse(user.Id, out Guid convertedId))
            {
                Id = convertedId;
            }
        }
        
        [JsonProperty]
        public string FirstName { get; private set; }

        [JsonProperty]
        public string LastName { get; private set; }

        [JsonProperty]
        public DateTime? Birthdate { get; private set; }

        [JsonProperty]
        public string Email { get; private set; }

        [JsonProperty]
        public string UserName { get; private set; }

        [JsonProperty]
        public bool EmailConfirmed { get; private set; }

        [JsonProperty]
        public string PhoneNumber { get; private set; }

        [JsonProperty]
        public bool PhoneNumberConfirmed { get; private set; }

        [JsonProperty]
        public bool TwoFactorEnabled { get; private set; }

        [JsonProperty]
        public string AddressLine1 { get; private set; }

        [JsonProperty]
        public string AddressLine2 { get; private set; }

        [JsonProperty]
        public string City { get; private set; }

        [JsonProperty]
        public string State { get; private set; }

        [JsonProperty]
        public string Country { get; private set; }

        [JsonProperty]
        public string PostalCode { get; private set; }

        [JsonProperty]
        public Guid Id { get; set; }
    }
}
