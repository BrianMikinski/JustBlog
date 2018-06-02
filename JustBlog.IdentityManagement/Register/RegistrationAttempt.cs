using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace JustBlog.IdentityManagement.Register
{
    public class RegistrationAttempt
    {
        public RegistrationAttempt(RegisterViewModel user, bool  succeeded, IEnumerable<IdentityError> errors)
        {
            User = user;
            Succeeded = succeeded;
            Errors = errors;
        }

        [JsonProperty]
        public IEnumerable<IdentityError> Errors { get; private set; }

        [JsonProperty]
        public bool Succeeded {get; private set; }

        [JsonProperty]
        public RegisterViewModel User { get; private set; }
    }
}