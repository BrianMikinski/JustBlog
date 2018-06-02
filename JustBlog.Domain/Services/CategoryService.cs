using JustBlog.Models;
using JustBlog.ViewModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace JustBlog.Domain.Services
{
    /// <summary>
    /// Service class for handling all actions involving categories
    /// </summary>
    public class CategoryService : Repository<Category>, ICategoryService
    {
        private readonly IJustBlogContext _Context;

        public CategoryService(IJustBlogContext context) : base(context.Categories, (DbContext)context)
        {
            _Context = context;
        }

        /// <summary>
        /// Get a list of all category view models
        /// </summary>
        /// <returns></returns>
        public List<CategoryViewModel> AllCategories(bool includePosts)
        {
            var categories = _Context.Categories.Include(p => p.Posts).Where(p => true).ToList();
            List<CategoryViewModel> viewModels = new List<CategoryViewModel>();
            CategoryViewModel newCategory;

            foreach (Category category in categories)
            {
                newCategory = new CategoryViewModel()
                {
                    Id = category.Id,
                    Name = category.Name,
                    Posts = null,
                    Modified = category.Modified,
                    PostCount = category.Posts != null ? category.Posts.Count : 0,
                    UrlSlug = category.UrlSlug
                };

                viewModels.Add(newCategory);
            }

            return viewModels;
        }

        /// <summary>
        /// Retrieve a paged list of categories
        /// </summary>
        /// <param name="pagingProperties"></param>
        /// <returns></returns>
        public IQuery<CategoryViewModel, StandardFilter> Categories(IPagingProperties<CategoryViewModel> pagingProperties)
        {
            //Set default paging direction if none is present
            if (pagingProperties.SortFields.Count <= 0)
            {
                pagingProperties.SortFields.Add(new SortField<CategoryViewModel>(p => p.Name, false));
            }

            Query<CategoryViewModel, StandardFilter> query = new Query<CategoryViewModel, StandardFilter>(pagingProperties);

            query.Queryable = from category in _Context.Categories
                              let postCount = (from post in _Context.Posts
                                               where post.CategoryId == category.Id
                                               select post).Count()
                              select new CategoryViewModel()
                              {
                                  Description = category.Description,
                                  Id = category.Id,
                                  Modified = category.Modified,
                                  Name = category.Name,
                                  PostCount = postCount,
                                  UrlSlug = category.UrlSlug
                              };

            query.SortAndPage();

            return query;
        }

        /// <summary>
        /// Retrieve a category based on a category Id
        /// </summary>
        /// <param name="categoryId"></param>
        /// <returns></returns>
        public CategoryViewModel Category(int categoryId)
        {
            Category result = _Context.Categories.Include(p => p.Posts).SingleOrDefault(p => p.Id == categoryId);

            return new CategoryViewModel()
            {
                Id = result.Id,
                Modified = result.Modified,
                Description = result.Description,
                Name = result.Name,
                UrlSlug = result.UrlSlug,
                Posts = null,
                PostCount = result.Posts != null ? result.Posts.Count : 0
            };
        }

        /// <summary>
        /// Save an edited or new category
        /// </summary>
        /// <param name="category"></param>
        /// <returns></returns>
        public CategoryViewModel Save(CategoryViewModel category)
        {
            JustBlogContext currentContext = (JustBlogContext)_Context;
            bool saveSuccess = false;
            Category currentCategory = new Category()
            {
                Description = category.Description,
                Id = category.Id.HasValue ? category.Id.Value : -1,
                Modified = DateTime.UtcNow,
                Name = category.Name,
                Posts = null,
                UrlSlug = category.UrlSlug
            };

            //Edit an existing category
            if (category.Id.HasValue)
            {
                currentContext.Categories.Attach(currentCategory);
                currentContext.Entry(currentCategory).State = EntityState.Modified;
                saveSuccess = currentContext.SaveChanges() > 0;
            }
            else //Add a new category
            {
                currentContext.Categories.Add(currentCategory);
                saveSuccess = currentContext.SaveChanges() > 0;
            }

            if (saveSuccess)
            {
                //Load posts after we save them
                currentContext.Entry(currentCategory).Collection(p => p.Posts).Load();

                return new CategoryViewModel()
                {
                    Description = currentCategory.Description,
                    Id = currentCategory.Id,
                    Modified = currentCategory.Modified,
                    Name = currentCategory.Name,
                    PostCount = currentCategory != null ? currentCategory.Posts.Count : 0,
                    Posts = null,
                    UrlSlug = currentCategory.UrlSlug
                };
            }
            else
            {
                throw new JustBlogException($"Error saving changes to {currentCategory.Name}");
            }
        }
    }
}