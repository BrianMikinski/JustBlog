using JustBlog.UI.Services;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace JustBlog.UI.Models
{
    public static class Tokens
    {
        /// <summary>
        /// Create a jwt with the identity, auth_token and expiration date
        /// </summary>
        /// <param name="identity"></param>
        /// <param name="jwtFactory"></param>
        /// <param name="userName"></param>
        /// <param name="jwtOptions"></param>
        /// <param name="serializerSettings"></param>
        /// <returns></returns>
        public static async Task<JwtAppToken> GenerateJwt(ClaimsIdentity identity, IJwtFactory jwtFactory, string userName, JwtIssuerOptions jwtOptions)
        {
            string userId = identity.Claims.Single(c => c.Type == "id").Value;

            string encodedToken = await jwtFactory.GenerateEncodedToken(userName, identity);

            int validFor = (int)jwtOptions.ValidFor.TotalSeconds;

            return new JwtAppToken(userId, encodedToken, validFor);
        }
    }
}
