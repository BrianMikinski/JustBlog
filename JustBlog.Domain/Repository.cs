using Microsoft.EntityFrameworkCore;

namespace JustBlog.Domain.Services
{
    /// <summary>
    /// For more information on the generic repository pattern see the following asp.net tutorial 
    /// by Tom Dykstra
    /// 
    /// http://www.asp.net/mvc/overview/older-versions/getting-started-with-ef-5-using-mvc-4/implementing-the-repository-and-unit-of-work-patterns-in-an-asp-net-mvc-application
    /// </summary>
    /// <typeparam name="TEntity"></typeparam>
    public abstract class Repository<TEntity> where TEntity : class
    {
        protected DbContext _context;
        private DbSet<TEntity> _dbSet { get; set; }

        protected Repository(DbSet<TEntity> dbSet, DbContext context)
        {
            _dbSet = dbSet;
            _context = context;
        }

        /// <summary>
        /// Delete an entity by ID
        /// </summary>
        /// <param name="id"></param>
        public virtual void Delete(object id)
        {
            TEntity entityToDelete = _dbSet.Find(id);
            Delete(entityToDelete);
        }

        /// <summary>
        /// Delete the entity passed to the context
        /// </summary>
        /// <param name="entityToDelete"></param>
        public virtual void Delete(TEntity entityToDelete)
        {
            if (_context.Entry(entityToDelete).State == EntityState.Detached)
            {
                _dbSet.Attach(entityToDelete);
            }

            _dbSet.Remove(entityToDelete);
        }

        /// <summary>
        /// Get an entity by a specified ID
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public virtual TEntity GetByID(object id)
        {
            return _dbSet.Find(id);
        }

        /// <summary>
        /// Attach and update an entity
        /// </summary>
        /// <param name="entity"></param>
        public virtual void Update(TEntity entity)
        {
            _dbSet.Attach(entity);
            _context.Entry(entity).State = EntityState.Modified;
        }

        /// <summary>
        /// Save changes made to the Entity Framework context
        /// </summary>
        /// <returns></returns>
        public int SaveChanges()
        {
           return _context.SaveChanges();
        }
    }
}
