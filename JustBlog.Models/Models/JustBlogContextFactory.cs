using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace JustBlog.Models.Models
{
    /// <summary>
    /// Just blog context factory, used to create a proper justblog context when creating
    /// a new database from the command line
    /// </summary>
    public class JustBlogContextFactory : IDesignTimeDbContextFactory<JustBlogContext>
    {
        /// <summary>
        /// Accept command line arguments to provide for options when generating the context from the command line
        /// dotnet ef database update --connection-string "Data Source=prod.db"
        /// This probably isn't available in EF yet
        /// </summary>
        /// <param name="args"></param>
        /// <returns></returns>
        public JustBlogContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<JustBlogContext>();
            optionsBuilder.UseSqlite("Filename=./justblog.sqlite");

            return new JustBlogContext(optionsBuilder.Options);
        }
    }
}
