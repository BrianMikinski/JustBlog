using System;
using System.Runtime.Serialization;

namespace JustBlog.UI.Infrastructure
{
    [Serializable]
    public class AccountException : Exception
    {
        public AccountException()
        {
        }

        public AccountException(string message) : base(message)
        {
        }

        public AccountException(string message, Exception innerException) : base(message, innerException)
        {
        }

        protected AccountException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }
}
