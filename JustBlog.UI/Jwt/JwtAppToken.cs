using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JustBlog.UI.Models
{
    public class JwtAppToken
    {
        [JsonProperty("id")]
        public string Id { get; private set; }

        [JsonProperty("auth_token")]
        public string AuthToken { get; private set; }

        [JsonProperty("expires_in")]
        public int ExpiresIn { get; set; }

        public JwtAppToken(string id, string authToken, int expiresIn)
        {
            Id = id;
            AuthToken = authToken;
            ExpiresIn = expiresIn;
        }
    }
}
