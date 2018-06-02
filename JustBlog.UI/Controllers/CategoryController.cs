using JustBlog.Domain.Services;
using JustBlog.Models;
using JustBlog.UI.Infrastructure;
using JustBlog.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace JustBlog.UI.Controllers
{
    [Route(RoutePrefixes.CATEGORY_RESOURCE)]
    public class CategoryController : Controller
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        /// <summary>
        /// Get a paged list of post items.
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [HttpPost, Route(nameof(CategoryController.RetrieveCategories))]
        public IQuery<CategoryViewModel, StandardFilter> RetrieveCategories(Query<CategoryViewModel, StandardFilter> query)
        {
            return _categoryService.Categories(query.PagingProperties);
        }

        /// <summary>
        /// Retrieve all blog categories
        /// </summary>
        /// <returns></returns>
        [HttpPost, Route(nameof(CategoryController.RetrieveAllCategories))]
        public List<CategoryViewModel> RetrieveAllCategories(bool includePosts)
        {
            List<CategoryViewModel> results = _categoryService.AllCategories(includePosts);

            return results;
        }

        /// <summary>
        /// Retreive a category based on a category Id
        /// </summary>
        /// <param name="categoryId"></param>
        /// <returns></returns>
        [HttpPost, Route(nameof(CategoryController.RetrieveCategory))]
        public CategoryViewModel RetrieveCategory(int categoryId)
        {
            CategoryViewModel result = _categoryService.Category(categoryId);

            return result;
        }

        /// <summary>
        /// Save an edited or modified category
        /// </summary>
        /// <param name="category"></param>
        /// <returns></returns>
        [HttpPost, Authorize, ValidateAntiForgeryToken, Route(nameof(CategoryController.Save))]
        public CategoryViewModel Save(CategoryViewModel category)
        {
            CategoryViewModel result = _categoryService.Save(category);
            return result;
        }
    }
}