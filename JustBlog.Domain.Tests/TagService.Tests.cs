using JustBlog.Domain.Services;
using JustBlog.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;

namespace JustBlog.Domain.Tests
{
    [TestCategory(TestCategories.UNIT_TEST)]
    [TestClass]
    public class TagServiceTests : ServiceTestBase
    {

        private Mock<DbSet<Tag>> tagSet_Mocked;
        private IQueryable<Tag> tagData;
        private List<Tag> tags;
        private Category newCategory;
        private Tag newTag;
        private Mock<JustBlogContext> justBlogContext_Mock;
        private ITagService tagService_Mocked;
        private string tagUrlSlug_Mock = "UrlSlugTest1";
        private string tagUrlSlug_Mock_2 = "UrlSlugTest2";
        private int tagId_Mock_1 = 1;
        private int tagId_Mock_2 = 2;
        private Tag tag_1, tag_2;


        [TestInitialize()]
        public void TestSetups()
        {
            tags = new List<Tag>();

            //Must happen after we assign the variable
            tags.Add(newTag);

            tag_1 = new Tag()
            {
                Name = "Title 1",
                Description = "Tag Description",
                Id = tagId_Mock_1,
                Modified = new DateTime(),
                Posts = new List<Post>(),
                UrlSlug = tagUrlSlug_Mock
            };

            tag_2 = new Tag()
            {
                Name = "Title 2",
                Description = "Tag Description 2",
                Id = tagId_Mock_1,
                Modified = new DateTime(),
                Posts = new List<Post>(),
                UrlSlug = tagUrlSlug_Mock_2
            };

            List<Tag> tagList = new List<Tag>();
            tagList.Add(tag_1);
            tagList.Add(tag_2);

            //Mock up posts
            tagData = tagList.AsQueryable();

            tagSet_Mocked = GetMockDbSet(tagData);

            //Set includes after post setups
            tagSet_Mocked.Setup(m => m.Include(nameof(Post.Category))).Returns(tagSet_Mocked.Object);
            tagSet_Mocked.Setup(m => m.Include(nameof(Post.Tags))).Returns(tagSet_Mocked.Object);

            justBlogContext_Mock = new Mock<JustBlogContext>();
            justBlogContext_Mock.Setup(m => m.Tags).Returns(tagSet_Mocked.Object);

            //tagService_Mocked = new TagService(justBlogContext_Mock.Object);
        }


    }
}
