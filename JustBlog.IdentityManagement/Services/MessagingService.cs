using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace JustBlog.IdentityManagement.Services
{
    public class MessagingService : IMessagingService
    {
        private const string sendGridEnvironmentVariable = "SENDGRID_APIKEY";

        public async Task<Response> SendEmailAsync(string recipientName, string email, string subject, string content)
        {
            var message = new SendGridMessage()
            {
                From = new EmailAddress(email, "DX Team"),
                Subject = subject,
                PlainTextContent = "Hello, Email!",
                HtmlContent = content
            };

            message.AddTo(new EmailAddress(email, recipientName));

            return await SendEmail(message);
        }

        public async Task<Response> MultipleRecipientsExample()
        {
            var apiKey = Environment.GetEnvironmentVariable(sendGridEnvironmentVariable);

            var client = new SendGridClient(apiKey);
            var from = new EmailAddress("test1@example.com", "Example User 1");

            List<EmailAddress> tos = new List<EmailAddress>
          {
              new EmailAddress("test2@example.com", "Example User 2"),
              new EmailAddress("test3@example.com", "Example User 3"),
              new EmailAddress("test4@example.com","Example User 4")
          };

            var subject = "Hello world email from Sendgrid ";
            var htmlContent = "<strong>Hello world with HTML content</strong>";

            var displayRecipients = false; // set this to true if you want recipients to see each others mail id

            var msg = MailHelper.CreateSingleEmailToMultipleRecipients(from, tos, subject, "", htmlContent, false);

            return await client.SendEmailAsync(msg);
        }

        public async Task<Response> SendEmailConfirmationAsync(string recipientName, string email, string link)
        {
            var message = new SendGridMessage()
            {
                From = new EmailAddress(email, "JustBlog Team"),
                Subject = "Just Blog Registeration",
                HtmlContent = $"<strong>Hello, {recipientName} Welcome to the Just Blog family!</strong> Please click the following link to <a href='{link}'>confirm your account</a>."
            };

            message.AddTo(new EmailAddress(email, recipientName));

            return await SendEmail(message);
        }

        /// <summary>
        /// Send a send grid email
        /// </summary>
        /// <param name="message"></param>
        /// <returns></returns>
        private async Task<Response> SendEmail(SendGridMessage message)
        {
            var apiKey = Environment.GetEnvironmentVariable(sendGridEnvironmentVariable);

            var client = new SendGridClient(apiKey);

            return await client.SendEmailAsync(message);
        }

        /// <summary>
        /// Generate an email confirmation link based on the user id, confirmation code and request protocol scheme
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="code"></param>
        /// <param name="scheme"></param>
        /// <returns></returns>
        public string EmailConfirmationLink(string userId, string code, string baseUrl, string scheme)
        {
            return $"{scheme}\\\\{baseUrl}\\\\manageContent\\userId?{userId}&code?{code}";
        }
    }
}
