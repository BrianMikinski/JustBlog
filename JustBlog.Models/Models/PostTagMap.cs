namespace JustBlog.Models
{
    /// <summary>
    /// Entity map for configuring many to many relationships between tags and posts
    /// </summary>
    public class PostTagMap
    {
        /// <summary>
        /// Foreign key for post ids
        /// </summary>
        public int Post_id { get; private set; }

        /// <summary>
        /// Foreign key for tag ids
        /// </summary>
        public int Tag_id { get; private set; }

        public Post Post { get; private set; }

        public Tag Tag { get; private set; }
    }
}
