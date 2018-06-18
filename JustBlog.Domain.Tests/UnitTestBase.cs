using JustBlog.Domain.Services;
using JustBlog.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System;
using System.Collections.Generic;

namespace JustBlog.Domain.Tests
{
    /// <summary>
    /// Base class that initializes unit test of the JustBlog.Domain
    /// </summary>
    public abstract class UnitTestBase
    {
        protected JustBlogContext justBlogContext;
        protected IPostService _postService { get; private set; }
        protected ICategoryService _categoryService { get; private set; }
        protected ITagService _tagService { get; private set; }

        // posts
        protected string postUrlSlug_1 { get; private set; } = "UrlSlugTest1";
        protected string postUrlSlug_Mock_2 { get; private set; } = "UrlSlugTest2";
        protected int postId_1 { get; private set; } = 1;
        protected int postId_Mock_2 { get; private set; } = 2;
       
        protected List<Post> postData { get; private set; }

        // categorys
        protected Category category1;
        protected int categoryId_Mock_1 { get; private set; } = 1;

        // tags
        protected List<Tag> tagData { get; private set; }
        protected int tagId_Mock_1 { get; private set; } = 1;
        protected Mock<JustBlogContext> justBlogContextMock;

        /// <summary>
        /// DbContext setup before each test is run
        /// </summary>
        [TestInitialize()]
        public void ConfigureInMemoryDatabase()
        {
            // must setup in this order! postSet depends on category and tag set!
            var categoryData = ConfigureCategoryDbSetMock();
            tagData = ConfigureTagDbSetMock();
            postData = ConfigurePostsDbSetMock();

            // configure in memory database
            var options = new DbContextOptionsBuilder<JustBlogContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .EnableSensitiveDataLogging(true)
                //.ReplaceService<IValueGeneratorCache, InMemoryValueGeneratorCache>() // used to get around generated key values
                .Options;

            justBlogContext = new JustBlogContext(options);

            // save in memory data
            justBlogContext.AddRange(categoryData);
            justBlogContext.AddRange(postData);
            justBlogContext.AddRange(tagData);

            justBlogContext.SaveChanges();

            _categoryService = new CategoryService(justBlogContext);
            _postService = new PostService(justBlogContext);
            _tagService = new TagService(justBlogContext);
        }

        /// <summary>
        /// Reset the entity framework in memory database
        /// </summary>
        [TestCleanup]
        public void ResetInMemoryDatabase()
        {
            justBlogContext.Database.EnsureDeleted();
        }

        /// <summary>
        /// Configure a post dbset for mock usage with a db context
        /// </summary>
        /// <returns></returns>
        private List<Post> ConfigurePostsDbSetMock()
        {
           var post_1 = new Post()
            {
                Title = "Title 1",
                CategoryId = categoryId_Mock_1,
                Id = postId_1,
                Content = "Post Description 1",
                Meta = "Meta Data Field 1",
                Modified = DateTime.Now,
                PostedOn = DateTime.Now,
                Published = false,
                ShortDescription = "Short description field 1",
                UrlSlug = postUrlSlug_1,
                Category = category1,
                Tags = tagData,
            };

            var post_2 = new Post()
            {
                Title = "Title 2",
                CategoryId = categoryId_Mock_1,
                Id = postId_Mock_2,
                Content = "Post Description 2",
                Meta = "Meta Data Field 2",
                Modified = DateTime.Now,
                PostedOn = DateTime.Now,
                Published = false,
                ShortDescription = "Short description field 2",
                UrlSlug = postUrlSlug_Mock_2,
                Category = category1,
                Tags = tagData,
            };

            postData = new List<Post>
            {
                post_1,
                post_2
            };

            return postData;
        }

        /// <summary>
        /// Configure a category dbset for mock usage with a db context
        /// </summary>
        /// <returns></returns>
        private List<Category> ConfigureCategoryDbSetMock()
        {
            category1 = new Category()
            {
                Description = "Category Description",
                Id = 0,
                Modified = new DateTime(),
                Name = "Name",
                Posts = new List<Post>(),
                UrlSlug = "Category Url Slug"
            };

            return new List<Category>
            {
                category1
            };
        }

        /// <summary>
        /// Configure the tag db set mock
        /// </summary>
        /// <returns></returns>
        private List<Tag> ConfigureTagDbSetMock()
        {
            var tag1 = new Tag()
            {
                Description = "Tag Description",
                Id = tagId_Mock_1,
                Modified = new DateTime(),
                Name = "Tag Name",
                Posts = new List<Post>(),
                UrlSlug = "Url Slug"
            };

            return new List<Tag>()
            {
                tag1
            };
        }
    }
}
