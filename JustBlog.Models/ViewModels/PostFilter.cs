namespace JustBlog.Models.ViewModels
{
    /// <summary>
    /// Filter for post grid queries
    /// </summary>
    public class PostFilter : IQueryFilter
    {
        /// <summary>
        /// Show only active or inactive queries
        /// </summary>
        public bool? IsActive { get; set; }
    }
}
