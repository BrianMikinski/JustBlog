using Microsoft.EntityFrameworkCore;

namespace JustBlog.Models
{
    public interface IJustBlogContext
    {
        DbSet<Category> Categories { get; set; }
        DbSet<Post> Posts { get; set; }
        DbSet<Tag> Tags { get; set; }
    }
}