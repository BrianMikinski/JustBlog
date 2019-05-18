using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace JustBlog.IdentityManagement
{
    /// <summary>
    /// Just blog context factory, used to create a proper justblog identity context when creating
    /// a new database from the command line.
    /// </summary>
    public class IdentityContextFactory : IDesignTimeDbContextFactory<IdentityDbContext>
    {
        /// <summary>
        /// Accept command line arguments to provide for options when generating the context from the command line
        /// dotnet ef database update --connection-string "Data Source=prod.db"
        /// This probably isn't available in EF yet
        /// </summary>
        /// <param name="args"></param>
        /// <returns></returns>
        public IdentityDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<IdentityDbContext>();
            optionsBuilder.UseSqlite("Filename=../JustBlog.UI/justblog.sqlite");

            return new IdentityDbContext(optionsBuilder.Options);
        }
    }
}
