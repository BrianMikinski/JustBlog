using Microsoft.EntityFrameworkCore;

namespace JustBlog.Models
{
    public partial class JustBlogContext : DbContext, IJustBlogContext
    {
        public virtual DbSet<Category> Categories { get; set; }

        public virtual DbSet<Post> Posts { get; set; }

        public virtual DbSet<Tag> Tags { get; set; }

        /// <summary>
        /// Allow for specification of connection string in the constructor.
        /// 
        /// Useful when mocking so that we can submit an connection that doesn't exist and 
        /// won't pull the database.
        /// </summary>
        /// <param name="connectionString"></param>
        public JustBlogContext(DbContextOptions<JustBlogContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            ConfigureCategories(modelBuilder);
            ConfigurePosts(modelBuilder);
            ConfigurePostTags(modelBuilder);
            ConfigureTags(modelBuilder);
        }

        private void ConfigureCategories(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Category>()
                .HasKey(p => p.Id);

            modelBuilder.Entity<Category>()
                .ToTable("Category")
                .HasMany(e => e.Posts)
                .WithOne(e => e.Category)
                .HasForeignKey(e => e.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);
        }

        private void ConfigurePosts(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Post>()
                .ToTable("Post");

            modelBuilder.Entity<Post>()
                .Ignore(p => p.Tags);

            modelBuilder.Entity<Post>()
                .HasKey(p => p.Id);
        }

        private void ConfigurePostTags(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PostTagMap>()
            .HasKey(p => new { p.Post_id, p.Tag_id });

            modelBuilder.Entity<PostTagMap>()
                .ToTable("PostTagMap")
                .HasOne(p => p.Post)
                .WithMany(p => p.PostTags)
                .HasForeignKey(p => p.Post_id);

            modelBuilder.Entity<PostTagMap>()
                .HasOne(p => p.Tag)
                .WithMany(p => p.PostTags)
                .HasForeignKey(p => p.Tag_id);
        }

        private void ConfigureTags(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Tag>()
                .ToTable("Tag");

            modelBuilder.Entity<Tag>()
                .Ignore(p => p.Posts);

            modelBuilder.Entity<Tag>()
                .HasKey(p => p.Id);
        }
    }
}
