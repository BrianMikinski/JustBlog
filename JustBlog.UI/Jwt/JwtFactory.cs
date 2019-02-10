using JustBlog.IdentityManagement.Login;
using JustBlog.UI.Models;
using Microsoft.Extensions.Options;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;

namespace JustBlog.UI.Services
{
    public class JwtFactory : IJwtFactory
    {
        private readonly JwtIssuerOptions _jwtOptions;

        public JwtFactory(IOptions<JwtIssuerOptions> jwtOptions)
        {
            _jwtOptions = jwtOptions.Value;
            ThrowIfInvalidOptions(_jwtOptions);
        }

        /// <summary>
        /// Create a jwt token
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="identity"></param>
        /// <returns></returns>
        public async Task<string> GenerateEncodedToken(string userName, ClaimsIdentity identity)
        {
            var claims = new[]
            {
                 new Claim(JwtRegisteredClaimNames.Sub, userName),
                 new Claim(JwtRegisteredClaimNames.Jti, await _jwtOptions.JtiGenerator()),
                 new Claim(JwtRegisteredClaimNames.Iat, ToUnixEpochDate(_jwtOptions.IssuedAt).ToString(), ClaimValueTypes.Integer64),
                 identity.FindFirst(Constants.ROLE),
                 identity.FindFirst(Constants.ID),
                 new Claim(Constants.ADMIN_CLAIM_VALUE_TYPE, $"{Constants.ADMIN_CLAIM_ACTION}|{Constants.ADMIN_CLAIM_RESOURCE}"),
                 new Claim(Constants.DATA_CLAIM_TYPE, $"{Constants.DATA_CLAIM_ACTION}|{Constants.DATA_CLAIM_RESOURCE}")
             };

            // Create the JWT security token and encode it.
            var jwt = new JwtSecurityToken(
                issuer: _jwtOptions.Issuer,
                audience: _jwtOptions.Audience,
                claims: claims,
                notBefore: _jwtOptions.NotBefore,
                expires: _jwtOptions.Expiration,
                signingCredentials: _jwtOptions.SigningCredentials);

            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            return encodedJwt;
        }

        /// <summary>
        /// Create the claims identity for the specified user. This is where we would generate specific claims or 
        /// retrieve claims that had been stored in the database
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public ClaimsIdentity GenerateClaimsIdentity(string userName, string id)
        {
            return new ClaimsIdentity(new GenericIdentity(userName, "Token"), new[]
            {
                new Claim(Constants.ID, id),
                new Claim(Constants.ROLE, Constants.API_ACCESS),
                new Claim(Constants.ADMIN_CLAIM_VALUE_TYPE, $"{Constants.ADMIN_CLAIM_RESOURCE}|{Constants.ADMIN_CLAIM_ACTION}"),
                new Claim(Constants.DATA_CLAIM_TYPE, $"{Constants.DATA_CLAIM_RESOURCE}|{Constants.DATA_CLAIM_ACTION}")
            });
        }

        /// <summary>
        /// Date converted to seconds since Unix epoch (Jan 1, 1970, midnight UTC).
        /// </summary>
        /// <param name="date"></param>
        /// <returns></returns>
        private long ToUnixEpochDate(DateTime date)
        {
            return (long)Math.Round((date.ToUniversalTime() -
                               new DateTimeOffset(1970, 1, 1, 0, 0, 0, TimeSpan.Zero))
                              .TotalSeconds);
        }

        /// <summary>
        /// Check for invalid options
        /// </summary>
        /// <param name="options"></param>
        private void ThrowIfInvalidOptions(JwtIssuerOptions options)
        {
            if (options == null) throw new ArgumentNullException(nameof(options));

            if (options.ValidFor <= TimeSpan.Zero)
            {
                throw new JwtFactoryException($"Must be a non-zero TimeSpan: {nameof(JwtIssuerOptions.ValidFor)}");
            }

            if (options.SigningCredentials == null)
            {
                throw new JwtFactoryException(nameof(JwtIssuerOptions.SigningCredentials));
            }

            if (options.JtiGenerator == null)
            {
                throw new JwtFactoryException(nameof(JwtIssuerOptions.JtiGenerator));
            }
        }
    }
}
