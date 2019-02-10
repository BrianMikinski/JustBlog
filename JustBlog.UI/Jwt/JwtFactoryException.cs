using System;
using System.Runtime.Serialization;

namespace JustBlog.UI.Services
{
    [Serializable]
    public class JwtFactoryException : Exception
    {
        public JwtFactoryException()
        {
        }

        public JwtFactoryException(string message) : base(message)
        {
        }

        public JwtFactoryException(string message, Exception innerException) : base(message, innerException)
        {
        }

        protected JwtFactoryException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }
}
