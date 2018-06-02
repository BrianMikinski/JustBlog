using Microsoft.EntityFrameworkCore;
using Moq;
using System.Collections.Generic;
using System.Linq;

namespace JustBlog.Domain.Tests
{
    /// <summary>
    /// Helper methods for creating EF test moqs
    /// </summary>
    public static class EFTestHelpers
    {
        /// <summary>
        /// Create a new mock db set
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static DbSet<T> MockDbSet<T>() where T : class
        {
            return MockDbSet<T>(null);
        }

        /// <summary>
        /// Setup a mock dbset so that it can be queried
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="inMemoryData"></param>
        /// <returns></returns>
        public static DbSet<T> MockDbSet<T>(List<T> inMemoryData) where T : class
        {
            if (inMemoryData == null)
            {
                inMemoryData = new List<T>();
            }
            var mockDbSet = new Mock<DbSet<T>>();
            var queryableData = inMemoryData.AsQueryable();

            mockDbSet.Setup(m => m.Add(It.IsAny<T>())).Callback<T>(inMemoryData.Add);
            mockDbSet.As<IQueryable<T>>().Setup(m => m.Expression).Returns(queryableData.Expression);
            mockDbSet.As<IQueryable<T>>().Setup(m => m.ElementType).Returns(queryableData.ElementType);
            mockDbSet.As<IQueryable<T>>().Setup(m => m.GetEnumerator()).Returns(queryableData.GetEnumerator());
            //mockDbSet.Setup(x => x.AsNoTracking()).Returns(mockDbSet.Object);
            //mockDbSet.Setup(x => x.Include(It.IsAny<string>())).Returns(mockDbSet.Object);

            mockDbSet.As<IAsyncEnumerable<T>>()
                  .Setup(m => m.GetEnumerator())
                  .Returns(new TestDbAsyncEnumerator<T>(queryableData.GetEnumerator()));

            mockDbSet.As<IQueryable<T>>()
                .Setup(m => m.Provider)
                .Returns(new EFCoreTestDbAsyncQueryProvider<T>(queryableData.Provider));

            return mockDbSet.Object;
        }
    }
}