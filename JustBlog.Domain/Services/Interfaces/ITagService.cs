using JustBlog.Models;
using JustBlog.ViewModels;
using System.Collections.Generic;

namespace JustBlog.Domain.Services
{
    public interface ITagService
    {
        /// <summary>
        /// Retrieve a list of all available tags
        /// </summary>
        /// <param name="pagingProperties"></param>
        /// <returns></returns>
        List<TagViewModel> AllTags();

        /// <summary>
        /// Retrieve a tag by Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        TagViewModel Tag(int id);

        /// <summary>
        /// Retrieve paged tag data
        /// </summary>
        /// <param name="pagingProperties"></param>
        /// <returns></returns>
        IQuery<TagViewModel, StandardFilter> Tags(IPagingProperties<TagViewModel> pagingProperties);

        /// <summary>
        /// Save an edited or new tag
        /// </summary>
        /// <param name="tag"></param>
        /// <returns></returns>
        bool Save(TagViewModel tag);
    }
}
