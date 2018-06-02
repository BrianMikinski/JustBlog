namespace JustBlog.Models
{
    /// <summary>
    /// Query used to filter post entities
    /// </summary>
    public class PostFilter : IQueryFilter
    {
        public bool IsPublished { get; set; }
    }
}
