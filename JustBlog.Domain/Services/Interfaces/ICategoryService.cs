using JustBlog.Models;
using JustBlog.ViewModels;
using System.Collections.Generic;

namespace JustBlog.Domain.Services
{
    public interface ICategoryService
    {
        List<CategoryViewModel> AllCategories(bool includePosts);

        IQuery<CategoryViewModel, StandardFilter> Categories(IPagingProperties<CategoryViewModel> pagingProperties);

        CategoryViewModel Category(int categoryId);

        CategoryViewModel Save(CategoryViewModel category);
    }
}
