using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace JustBlog.Models.Tests
{
    [TestCategory(TestCategories.UNIT_TEST)]
    [TestClass]
    public class PagingProperties_Tests
    {
        private PagingProperties<TestPost> _pagingProperties;
        private readonly int _defaultPageSize = 10;

        /// <summary>
        /// Test the paging properties object with a custom list of sorting fields
        /// </summary>
        [TestMethod]
        public void Constructor_FieldList()
        {
            //Arrange
            List<SortField<TestPost>> fields = new List<SortField<TestPost>>() { };

            fields.Add(new SortField<TestPost>()
            {
                Field = p => p.Category,
                IsAscending = true
            });
            fields.Add(new SortField<TestPost>()
            {
                Field = p => p.Id,
                IsAscending = true
            });

            //Act
            _pagingProperties = new PagingProperties<TestPost>(fields);

            //Assert
            Assert.AreEqual(2, _pagingProperties.SortFields.Count);
            Assert.AreEqual(_pagingProperties.DefaultPageSize, _defaultPageSize);
            Assert.AreEqual(0, _pagingProperties.TotalPages);
            Assert.AreEqual(0, _pagingProperties.TotalPages);
            Assert.AreEqual(0, _pagingProperties.TotalResults);
        }

        /// <summary>
        /// Test the paging properties object with a single field passed to the constructor
        /// </summary>
        [TestMethod]
        public void Constructor_Field()
        {
            //Arrange
            Expression<Func<TestPost, object>> field = p => p.Id;

            //Act
            _pagingProperties = new PagingProperties<TestPost>(field);

            //Assert
            Assert.AreEqual(1, _pagingProperties.SortFields.Count);
            Assert.AreEqual(_defaultPageSize, _pagingProperties.DefaultPageSize);
            Assert.AreEqual(0, _pagingProperties.TotalPages);
            Assert.AreEqual(0, _pagingProperties.TotalPages);
            Assert.AreEqual(0, _pagingProperties.TotalResults);
        }

        /// <summary>
        ///  Test paging properties constructor with a custom field and direction 
        /// </summary>
        [TestMethod]
        public void Constructor_Field_Direction()
        {
            //Arrange
            Expression<Func<TestPost, object>> field = p => p.Id;

            //Act
            _pagingProperties = new PagingProperties<TestPost>(field, false);

            //Assert
            Assert.AreEqual(1, _pagingProperties.SortFields.Count);
            Assert.AreEqual(_defaultPageSize, _pagingProperties.DefaultPageSize);
            Assert.AreEqual(0, _pagingProperties.TotalPages);
            Assert.AreEqual(0, _pagingProperties.TotalPages);
            Assert.AreEqual(0, _pagingProperties.TotalResults);
        }
    }
}
