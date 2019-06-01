using SendGrid;
using System.Threading.Tasks;

namespace JustBlog.IdentityManagement.Services
{
    public interface IMessagingService
    {
        Task<Response> SendEmailAsync(string recipientName,  string email, string subject, string message);

        Task<Response> SendEmailConfirmationAsync(string email, string link);

        Task<Response> SendPasswordResetAsync(string email, string link);

        Task<Response> MultipleRecipientsExample();

        string EmailConfirmationLink(string userId, string code, string baseUrl, string scheme);

        string PasswordResetLink(string emailAddress, string code, string baseUrl, string scheme);

        string ToBase64(string text);

        string FromBase64(string text);
    }
}
