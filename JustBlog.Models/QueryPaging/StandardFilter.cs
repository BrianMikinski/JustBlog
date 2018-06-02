using System;

namespace JustBlog.Models
{
    [Serializable]
    public class StandardFilter : IQueryFilter {

        /// <summary>
        /// This is a test of the standard field
        /// </summary>
        public string StringProperty { get; set; }

        public int AnInteger { get; set; }

        public bool TestBool { get; set; }
    }
}
