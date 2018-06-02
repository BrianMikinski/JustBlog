using System.ComponentModel.DataAnnotations;

namespace JustBlog.ViewModels
{
    /// <summary>
    /// Encapsulates the information submitted by the contact form.
    /// </summary>
    public class Contact
    {
        [Required]
        public string Body { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        /// <summary>
        /// The user name.
        /// </summary>
        [Required]
        public string Name { get; set; }

        [Required]
        public string Subject { get; set; }

        [Url]
        public string Website { get; set; }
    }
}