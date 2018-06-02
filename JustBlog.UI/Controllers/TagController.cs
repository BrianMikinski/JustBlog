using JustBlog.Domain.Services;
using JustBlog.Models;
using JustBlog.UI.Infrastructure;
using JustBlog.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace JustBlog.UI.Controllers
{
    [Route(RoutePrefixes.TAG_RESOURCE)]
    public class TagController : Controller
    {
        private readonly ITagService _tagService;

        public TagController(ITagService tagService)
        {
            _tagService = tagService;
        }

        /// <summary>
        /// Get a paged list of post items.
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [HttpPost]
        [Route(nameof(TagController.RetrieveTags))]
        public IQuery<TagViewModel, StandardFilter> RetrieveTags(Query<TagViewModel, StandardFilter> query)
        {
            return _tagService.Tags(query.PagingProperties);
        }

        /// <summary>
        /// Retrieve all blog tags
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route(nameof(TagController.RetrieveAllTags))]
        public List<TagViewModel> RetrieveAllTags()
        {
            List<TagViewModel> results = _tagService.AllTags();

            return results;
        }

        /// <summary>
        /// Retrieve a tag by Id
        /// </summary>
        /// <param name="tagId"></param>
        /// <returns></returns>
        [HttpPost]
        [Route(nameof(TagController.RetrieveTag))]
        public TagViewModel RetrieveTag(int tagId)
        {
            TagViewModel result = _tagService.Tag(tagId);

            return result;
        }

        /// <summary>
        /// Save an edited or new tag
        /// </summary>
        /// <param name="tag"></param>
        /// <returns></returns>
        [HttpPost, Authorize, ValidateAntiForgeryToken]
        [Route(nameof(TagController.Save))]
        public bool Save(TagViewModel tag)
        {
            bool result = _tagService.Save(tag);
            return result;
        }
    }
}