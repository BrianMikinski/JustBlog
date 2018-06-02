using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace JustBlog.Models.Tests
{
    [TestCategory(TestCategories.UNIT_TEST)]
    [TestClass]
    public class Query_Tests
    {
        private Query<TestPost, StandardFilter> _postsQuery;
        private List<SortField<TestPost>> _sortFields;
        private PagingProperties<TestPost> _pagingProperties;
        private List<TestPost> _posts;
        private TestPost _post1, _post2, _post3, _post4, _post5, _post6, _post7, _post8, _post9, _post10, _post11, _post12;

        /// <summary>
        /// Test a simple sort and page method
        /// </summary>
        [TestMethod]
        public void SortAndPage_SingleFieldAscending()
        {
            //Arrange
            _postsQuery.PagingProperties.SortFields.Clear();
            _postsQuery.PagingProperties.SortFields.Add(new SortField<TestPost>()
            {
                Field = p => p.Id,
                IsAscending = true
            });

            //Act
            _postsQuery.Queryable = _posts.Where(p => true).AsQueryable();
            _postsQuery.SortAndPage();

            //Assert
            Assert_CorrectPaging();

            Assert.IsTrue(_postsQuery.Results[0].Id == _post1.Id);
            Assert.IsTrue(_postsQuery.Results[1].Id == _post2.Id);
            Assert.IsTrue(_postsQuery.Results[2].Id == _post3.Id);
            Assert.IsTrue(_postsQuery.Results[3].Id == _post4.Id);
        }

        /// <summary>
        /// Test sorting and paging multiple fields
        /// </summary>
        [TestMethod]
        public void SortAndPage_MultipleField()
        {
            //Arrange
            _postsQuery.PagingProperties.SortFields.Clear();
            _postsQuery.PagingProperties.SortFields.Add(new SortField<TestPost>()
            {
                Field = p => p.Modified,
                IsAscending = true
            });

            _postsQuery.PagingProperties.SortFields.Add(new SortField<TestPost>()
            {
                Field = p => p.Category,
                IsAscending = true
            });

            //Act
            _postsQuery.Queryable = _posts.Where(p => true).AsQueryable();
            _postsQuery.SortAndPage();

            //Assert

            Assert_CorrectPaging();

            Assert.IsTrue(_postsQuery.Results[0].Id == _post12.Id);
            Assert.IsTrue(_postsQuery.Results[1].Id == _post11.Id);
            Assert.IsTrue(_postsQuery.Results[2].Id == _post10.Id);
            Assert.IsTrue(_postsQuery.Results[3].Id == _post9.Id);
        }

        /// <summary>
        /// Test paging but not sorting and changing a page size
        /// </summary>
        [TestMethod]
        public void Page_ChangingPageSize()
        {
            //Arrange
            _postsQuery.Queryable = _posts.Where(p => true).AsQueryable();

            _postsQuery.PagingProperties.PageSize = 2;

            //Act
            _postsQuery.Page();

            //Assert
            Assert.AreEqual(2, _postsQuery.Results.Count);
            Assert.AreEqual(12, _postsQuery.PagingProperties.TotalResults);
            Assert.AreEqual(6, _postsQuery.PagingProperties.TotalPages);
            Assert.AreEqual(2, _postsQuery.PagingProperties.PageSize);
            Assert.AreEqual(2, _postsQuery.PagingProperties.SortFields.Count);
            Assert.AreEqual(0, _postsQuery.PagingProperties.Index);
        }

        /// <summary>
        /// Test sorting and paging with a custom field passed into the constructor
        /// </summary>
        [TestMethod]
        public void SortAndPage_CustomField()
        {
            //Act
            _postsQuery.Queryable = _posts.Where(p => true).AsQueryable();
            _postsQuery.SortAndPage(p => p.Category);

            //Assert
            Assert_CorrectPaging();

            Assert.AreEqual(_postsQuery.Results[0].Id, _post12.Id);
            Assert.AreEqual(_postsQuery.Results[1].Id, _post11.Id);
            Assert.AreEqual(_postsQuery.Results[2].Id, _post10.Id);
            Assert.AreEqual(_postsQuery.Results[3].Id, _post9.Id);
        }

        /// <summary>
        /// Test sorting and paging with a custom field and a custom direction passed into the list
        /// </summary>
        [TestMethod]
        public void SortAndPage_CustomField_CustomDirection()
        {
            //Act
            _postsQuery.Queryable = _posts.Where(p => true).AsQueryable();
            _postsQuery.SortAndPage(p => p.Category, false);

            //Assert
            Assert_CorrectPaging();

            Assert.AreEqual(_postsQuery.Results[0].Id, _post1.Id);
            Assert.AreEqual(_postsQuery.Results[1].Id, _post2.Id);
            Assert.AreEqual(_postsQuery.Results[2].Id, _post3.Id);
            Assert.AreEqual(_postsQuery.Results[3].Id, _post4.Id);
        }

        /// <summary>
        /// Test paging and sorting with a custom field passed in as the sorting parameter
        /// </summary>
        [TestMethod]
        public void SortAndPage_CustomFieldExpression()
        {
            //Arrange
            Expression<Func<TestPost, object>> field = p => p.Id;

            //Act
            _postsQuery.Queryable = _posts.Where(p => true).AsQueryable();
            _postsQuery.SortAndPage(field);

            //Assert
            Assert.IsTrue(_postsQuery.Results.Count == 10);

            Assert.IsTrue(_postsQuery.Results[0].Id == _post1.Id);
            Assert.IsTrue(_postsQuery.Results[1].Id == _post2.Id);
            Assert.IsTrue(_postsQuery.Results[2].Id == _post3.Id);
            Assert.IsTrue(_postsQuery.Results[3].Id == _post4.Id);

            Assert.AreEqual(12, _postsQuery.PagingProperties.TotalResults);
            Assert.AreEqual(0, _postsQuery.PagingProperties.Index);
            Assert.AreEqual(2, _postsQuery.PagingProperties.TotalPages);
        }

        /// <summary>
        /// Test paging and sorting with a custom field and sort direction
        /// </summary>
        [TestMethod]
        public void SortAndPage_CustomFieldExpression_Direction()
        {
            //Arrange
            Expression<Func<TestPost, object>> field = p => p.Id;

            //Act
            _postsQuery.Queryable = _posts.Where(p => true).AsQueryable();
            _postsQuery.SortAndPage(field, false);

            //Assert
            Assert.AreEqual(10, _postsQuery.Results.Count);
            Assert.AreEqual(0, _postsQuery.PagingProperties.Index);
            Assert.AreEqual(2, _postsQuery.PagingProperties.TotalPages);
            Assert.AreEqual(12, _postsQuery.PagingProperties.TotalResults);

            Assert.IsTrue(_postsQuery.Results[0].Id == _post12.Id);
            Assert.IsTrue(_postsQuery.Results[1].Id == _post11.Id);
            Assert.IsTrue(_postsQuery.Results[2].Id == _post10.Id);
            Assert.IsTrue(_postsQuery.Results[3].Id == _post9.Id);

            Assert.IsTrue(_postsQuery.Results[4].Id == _post8.Id);
            Assert.IsTrue(_postsQuery.Results[5].Id == _post7.Id);
            Assert.IsTrue(_postsQuery.Results[6].Id == _post6.Id);
            Assert.IsTrue(_postsQuery.Results[7].Id == _post5.Id);

            Assert.IsTrue(_postsQuery.Results[8].Id == _post4.Id);
            Assert.IsTrue(_postsQuery.Results[9].Id == _post3.Id);
        }

        [TestInitialize()]
        public void Init()
        {
            _sortFields = new List<SortField<TestPost>>()
            {
                new SortField<TestPost>()
                {
                    Field = p => p.UrlSlug,
                    IsAscending = true
                },
                new SortField<TestPost>()
                {
                    Field = p => p.PostedOn,
                    IsAscending = true
                }
            };

            DateTime modified = DateTime.Now;

            _post1 = new TestPost()
            {
                Category = 11,
                Description = "Description 1",
                Id = 0,
                Meta = "Meta Data 1",
                Modified = modified,
                PostedOn = DateTime.Now,
                UrlSlug = "TestSlug1",
                Title = "How are you doing today?"
            };

            _post2 = new TestPost()
            {
                Category = 10,
                Description = "Description 2",
                Id = 1,
                Meta = "Meta Data 2",
                Modified = modified,
                PostedOn = DateTime.Now,
                UrlSlug = "TestSlug2",
                Title = "What's up?"
            };

            _post3 = new TestPost()
            {
                Category = 9,
                Description = "Description 3",
                Id = 2,
                Meta = "Meta Data 3",
                Modified = modified,
                PostedOn = DateTime.Now,
                UrlSlug = "TestSlug3",
                Title = "Is This a post?"
            };

            _post4 = new TestPost()
            {
                Category = 8,
                Description = "Description 4",
                Id = 3,
                Meta = "Meta Data 4",
                Modified = modified,
                PostedOn = DateTime.Now,
                UrlSlug = "TestSlug4",
                Title = "Is This a post?"
            };

            _post5 = new TestPost()
            {
                Category = 7,
                Description = "Description 1",
                Id = 4,
                Meta = "Meta Data 1",
                Modified = modified,
                PostedOn = DateTime.Now,
                UrlSlug = "TestSlug5",
                Title = "How are you doing today?"
            };

            _post6 = new TestPost()
            {
                Category = 6,
                Description = "Description 2",
                Id = 5,
                Meta = "Meta Data 2",
                Modified = modified,
                PostedOn = DateTime.Now,
                UrlSlug = "TestSlug6",
                Title = "What's up?"
            };

            _post7 = new TestPost()
            {
                Category = 5,
                Description = "Description 3",
                Id = 6,
                Meta = "Meta Data 3",
                Modified = modified,
                PostedOn = DateTime.Now,
                UrlSlug = "TestSlug7",
                Title = "Is This a post?"
            };

            _post8 = new TestPost()
            {
                Category = 4,
                Description = "Description 4",
                Id = 7,
                Meta = "Meta Data 4",
                Modified = modified,
                PostedOn = DateTime.Now,
                UrlSlug = "TestSlug8",
                Title = "Is This a post?"
            };

            _post9 = new TestPost()
            {
                Category = 3,
                Description = "Description 1",
                Id = 8,
                Meta = "Meta Data 1",
                Modified = modified,
                PostedOn = DateTime.Now,
                UrlSlug = "TestSlug9",
                Title = "How are you doing today?"
            };

            _post10 = new TestPost()
            {
                Category = 2,
                Description = "Description 2",
                Id = 9,
                Meta = "Meta Data 2",
                Modified = modified,
                PostedOn = DateTime.Now,
                UrlSlug = "TestSlug10",
                Title = "What's up?"
            };

            _post11 = new TestPost()
            {
                Category = 1,
                Description = "Description 3",
                Id = 10,
                Meta = "Meta Data 3",
                Modified = modified,
                PostedOn = DateTime.Now,
                UrlSlug = "TestSlug11",
                Title = "Is This a post?"
            };

            _post12 = new TestPost()
            {
                Category = 0,
                Description = "Description 4",
                Id = 11,
                Meta = "Meta Data 4",
                Modified = modified,
                PostedOn = DateTime.Now,
                UrlSlug = "TestSlug12",
                Title = "Is This a post?"
            };

            _posts = new List<TestPost>();

            _posts.Add(_post1);
            _posts.Add(_post2);
            _posts.Add(_post3);
            _posts.Add(_post4);
            _posts.Add(_post5);
            _posts.Add(_post6);
            _posts.Add(_post7);
            _posts.Add(_post8);
            _posts.Add(_post9);
            _posts.Add(_post10);
            _posts.Add(_post11);
            _posts.Add(_post12);

            _pagingProperties = new PagingProperties<TestPost>(_sortFields);
            _postsQuery = new Query<TestPost, StandardFilter>(_pagingProperties);
        }

        /// <summary>
        /// Assert that the paging has not changed incorrectly
        /// </summary>
        private void Assert_CorrectPaging()
        {
            Assert.IsTrue(_postsQuery.Results.Count == 10);
            Assert.AreEqual(0, _postsQuery.PagingProperties.Index);
            Assert.AreEqual(10, _postsQuery.PagingProperties.PageSize);
            Assert.AreEqual(2, _postsQuery.PagingProperties.TotalPages);
            Assert.AreEqual(12, _postsQuery.PagingProperties.TotalResults);
        }
    }
}
