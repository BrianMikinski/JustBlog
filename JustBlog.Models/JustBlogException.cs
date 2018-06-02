using System;

namespace JustBlog.Models
{
    /// <summary>
    /// Custom application exception that is used to identify a programmer created exception.
    /// </summary>
    public class JustBlogException : Exception {
        public JustBlogException(string message) : base(message) { }
    }
}
