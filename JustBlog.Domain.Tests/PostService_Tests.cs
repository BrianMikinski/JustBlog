using JustBlog.Models;
using JustBlog.ViewModels;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;

namespace JustBlog.Domain.Tests
{
    /// <summary>
    /// Test class for the post service. For test setup,
    /// see the TestsConfig class in Tests.Config.cs
    /// </summary>
    [TestCategory(TestCategories.UNIT_TEST)]
    [TestClass]
    public class PostService_Tests : UnitTestBase
    {
        /// <summary>
        /// Test retrieving a new post. This illustrates a good example of testing an entity framework
        /// method that uses the "include" statement
        /// </summary>
        [TestMethod]
        public void Post_By_Id_Test()
        {
            //Act
            _postService.Post(postId_1);

            //Assert
            Assert.AreEqual(postId_1, postData.First().Id);
        }

        /// <summary>
        /// Test retrieving a post by post url
        /// </summary>
        [TestMethod]
        public void Post_By_UrlSlug_Test()
        {
            //Act
            _postService.Post(postUrlSlug_1);

            //Assert
            Assert.AreEqual(postUrlSlug_1, postData.First().UrlSlug);
        }

        /// <summary>
        /// Method to test retrieving paged posts
        /// </summary>
        [TestMethod]
        public void RetrievePosts_Test()
        {
            PagingProperties<Post> pagingProperties = new PagingProperties<Post>();

            //Act
            var result = _postService.Posts(pagingProperties, new PostFilter());

            //Assert
            Assert.AreEqual(2, result.Results.Count);
        }

        /// <summary>
        /// Test saving a new post
        /// </summary>
        [TestMethod]
        [Ignore("Ignoring because the in memory test will not allow us to test as we would like to.")]
        public void SavePost_NewPost_Test()
        {
            // arrange
            CategoryViewModel newCategory = new CategoryViewModel()
            {
                Description = "Category Description",
                Id = 99,
                Modified = new DateTime(),
                Name = "Name",
                PostCount = 0,
                Posts = new List<Post>(),
                UrlSlug = "Category Url Slug"
            };

            Tag newTag = new Tag()
            {
                Description = "Tag Description",
                Id = 99,
                Modified = new DateTime(),
                Name = "Tag Name",
                Posts = new List<Post>(),
                UrlSlug = "Url Slug"
            };

            Tag newTag2 = new Tag()
            {
                Description = "Tag Description 2",
                Id = 100,
                Modified = new DateTime(),
                Name = "Tag Name 2",
                Posts = new List<Post>(),
                UrlSlug = "UrlSlug2"
            };

            List<Tag> tags = new List<Tag>();

            tags.Add(newTag);
            tags.Add(newTag2);

            // setup new post
            PostViewModel newPost = new PostViewModel()
            {
                Category = newCategory,
                Description = "Test Descritpion",
                Meta = "Meta text",
                Modified = new DateTime(),
                Published = false,
                PostedOn = null,
                ShortDescription = "Short Description",
                Title = "TestTitle",
                UrlSlug = "TestUrlSlug",
                Tags = tags,
                Id = null
            };

            // act
            var post = _postService.Save(newPost, false);

            // assert
            Assert.IsNotNull(post);
        }

        /// <summary>
        /// Test publishing a post
        /// </summary>
        [TestMethod]
        public void Publish_Test()
        {
            PostViewModel initialPost = _postService.Post(postId_1);
            Assert.IsFalse(initialPost.Published);

            PostViewModel post = _postService.Publish(postId_1);

            //Assert
            Assert.IsTrue(post.Published);
        }

        /// <summary>
        /// Test unpublishing a post
        /// </summary>
        [TestMethod]
        public void Unpublish_Test()
        {
            //Arrange
            Post publishTestMockPost = new Post()
            {
                CategoryId = -1,
                Content = "Test Descritpion",
                Meta = "Meta text",
                Modified = new DateTime(),
                Published = false,
                PostedOn = null,
                ShortDescription = "Short Description",
                Title = "TestTitle",
                UrlSlug = "TestUrlSlug",
                Tags = tagData,
                Id = 1
            };

            PostViewModel post = _postService.Unpublish(postId_1);

            //Assert
            Assert.AreEqual(publishTestMockPost.Id, post.Id);
            Assert.AreEqual(publishTestMockPost.Published, post.Published);
        }

        /// <summary>
        /// Retreive categories by post Id
        /// </summary>
        [TestMethod]
        [Ignore("Test will not work with in memory provider because of the database generated keys.")]
        public void RetrievePostsForCategory_Test()
        {
            //Act
            List<PostViewModel> posts = _postService.CategoryPosts(categoryId_Mock_1);

            //Assert
            Assert.AreEqual(2, posts.Count);
        }
    }
}
