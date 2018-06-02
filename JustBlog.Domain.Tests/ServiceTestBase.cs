using Microsoft.EntityFrameworkCore;
using Moq;
using System.Linq;

namespace JustBlog.Domain.Tests
{
    /// <summary>
    /// Abstract class object used for testing service classes
    /// </summary>
    public abstract class ServiceTestBase
    {
        /// <summary>
        /// Help setup a mock db set
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="entities"></param>
        /// <returns></returns>
        protected virtual Mock<DbSet<T>> GetMockDbSet<T>(IQueryable<T> entities) where T : class
        {
            var mockSet = new Mock<DbSet<T>>();

            mockSet.As<IQueryable<T>>().Setup(m => m.Provider).Returns(entities.Provider);
            mockSet.As<IQueryable<T>>().Setup(m => m.Expression).Returns(entities.Expression);
            mockSet.As<IQueryable<T>>().Setup(m => m.ElementType).Returns(entities.ElementType);
            mockSet.As<IQueryable<T>>().Setup(m => m.GetEnumerator()).Returns(entities.GetEnumerator());

            return mockSet;
        }
    }
}
