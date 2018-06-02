using System;

namespace JustBlog.UI.Infrastructure
{
    /// <summary>
    /// Custom Exception for paging properties
    /// </summary>
    public class PagingPropertiesException : Exception
    {
        public PagingPropertiesException(string message) : base(message) { }

        public PagingPropertiesException(string message, Exception innerException) : base(message, innerException) { }
    }
}