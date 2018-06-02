using JustBlog.Models;
using JustBlog.ViewModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace JustBlog.Domain.Services
{
    /// <summary>
    /// Service class for handling all actions involving tags
    /// </summary>
    public class TagService : Repository<Tag>, ITagService
    {
        private readonly IJustBlogContext _Context;

        public TagService(IJustBlogContext context) : base(context.Tags, (DbContext)context)
        {
            _Context = context;
        }
      
        public List<TagViewModel> AllTags()
        {
            var results = _Context.Tags.Where(p => true).ToList();

            var viewModelResults = new List<TagViewModel>();

            foreach (Tag currentTag in results)
            {
                viewModelResults.Add(new TagViewModel()
                {
                    Description = currentTag.Description,
                    Id = currentTag.Id,
                    Name = currentTag.Name,
                    UrlSlug = currentTag.UrlSlug
                });
            }

            return viewModelResults;
        }
   
        public TagViewModel Tag(int id)
        {
            Tag result = _Context.Tags.First(p => p.Id == id);

            return new TagViewModel()
            {
                Id = result.Id,
                Modified = result.Modified,
                Description = result.Description,
                Name = result.Name,
                UrlSlug = result.UrlSlug,
                PostCount = result.Posts != null ? result.Posts.Count : 0
            };
        }
    
        public IQuery<TagViewModel, StandardFilter> Tags(IPagingProperties<TagViewModel> pagingProperties)
        {
            //Disable proxies for json serialization

            //Set default paging direction if none is present
            if (pagingProperties.SortFields.Count <= 0)
            {
                pagingProperties.SortFields.Add(new SortField<TagViewModel>(p => p.Name, false));
            }

            IQuery<TagViewModel, StandardFilter> query = new Query<TagViewModel, StandardFilter>(pagingProperties)
            {
                Queryable = from tag in _Context.Tags
                            select new TagViewModel
                            {
                                Description = tag.Description,
                                Id = tag.Id,
                                Modified = tag.Modified,
                                Name = tag.Name,
                                PostCount = 0,
                                UrlSlug = tag.UrlSlug
                            }
            };

            query.SortAndPage();

            return query;
        }
        
        public bool Save(TagViewModel tag)
        {
            JustBlogContext currentContext = (JustBlogContext)_Context;
            Tag currentCategory = new Tag()
            {
                Description = tag.Description,
                Id = tag.Id.HasValue ? tag.Id.Value : -1,
                Modified = DateTime.UtcNow,
                Name = tag.Name,
                Posts = null,
                UrlSlug = tag.UrlSlug
            };

            //Edit an existing tag
            if (tag.Id.HasValue)
            {
                currentContext.Tags.Attach(currentCategory);
                currentContext.Entry(currentCategory).State = EntityState.Modified;
                currentContext.SaveChanges();

                return true;
            }
            else //Add a new tag
            {
                currentContext.Tags.Add(currentCategory);
                return currentContext.SaveChanges() > 0 ? true : false;
            }
        }
    }
}
