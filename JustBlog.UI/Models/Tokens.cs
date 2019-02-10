using JustBlog.UI.Services;
using Newtonsoft.Json;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace JustBlog.UI.Models
{
    public static class Tokens
    {
        /// <summary>
        /// Create a serialized JWT with the identity, auth_token and expiration date
        /// </summary>
        /// <param name="identity"></param>
        /// <param name="jwtFactory"></param>
        /// <param name="userName"></param>
        /// <param name="jwtOptions"></param>
        /// <param name="serializerSettings"></param>
        /// <returns></returns>
        public static async Task<string> GenerateJwt(ClaimsIdentity identity, IJwtFactory jwtFactory, string userName, JwtIssuerOptions jwtOptions, JsonSerializerSettings serializerSettings)
        {
            var response = new
            {
                id = identity.Claims.Single(c => c.Type == "id").Value,
                auth_token = await jwtFactory.GenerateEncodedToken(userName, identity),
                expires_in = (int)jwtOptions.ValidFor.TotalSeconds
            };

            return JsonConvert.SerializeObject(response, serializerSettings);
        }
        
    }
}
