using JustBlog.Domain.Services;
using JustBlog.Models;
using JustBlog.UI.Infrastructure;
using JustBlog.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace JustBlog.UI.Controllers
{
    /// <summary>
    /// Note the ApiController. We don't need the MVC controller because we aren't serving up views.
    /// </summary>
    [Route(RoutePrefixes.POST_RESOURCE)]
    public class PostController : Controller
    {
        private readonly IPostService _postService;

        public PostController(IPostService postService)
        {
            _postService = postService;
        }

        /// <summary>
        /// Get an individual post based on a url slug
        /// </summary>
        /// <param name="urlSlug"></param>
        /// <returns></returns>
        [HttpGet, Route(nameof(PostController.Retrieve))]
        public PostViewModel Retrieve(string urlSlug)
        {
            return _postService.Post(urlSlug);
        }

        /// <summary>
        /// Get an individual post based on the post Id
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        [HttpPost, Route(nameof(PostController.RetrieveById))]
        public PostViewModel RetrieveById(int postId)
        {
            return _postService.Post(postId);
        }

        /// <summary>
        /// Get a paged list of post items.
        /// </summary>
        /// <param name="pagingProperties"></param>
        /// <returns></returns>
        [HttpPost, Route(nameof(PostController.RetrievePosts))]
        public IQuery<Post, PostFilter> RetrievePosts(Query<Post, PostFilter> query)
        {
             return _postService.Posts(query.PagingProperties, query.Filter);
        }

        /// <summary>
        /// Retrieve a list of posts based on a category Id;
        /// </summary>
        /// <param name="categoryId"></param>
        /// <returns></returns>
        [HttpPost, Route(nameof(PostController.RetrieveCategoryPosts))]
        public List<PostViewModel> RetrieveCategoryPosts(int categoryId)
        {
            return _postService.CategoryPosts(categoryId);
        }

        /// <summary>
        /// Save a current or new post
        /// </summary>
        /// <param name="currentPost"></param>
        /// <returns></returns>
        [HttpPost, Authorize, AutoValidateAntiforgeryToken, Route(nameof(PostController.Save))]
        public PostViewModel Save([FromBody]PostViewModel currentPost, [FromQuery] bool publishPost)
        {
            return _postService.Save(currentPost, publishPost);
        }

        /// <summary>
        /// Unpublish a post by Id
        /// </summary>
        /// <param name="postId"></param>
        /// <returns></returns>
        [HttpPost, Authorize, AutoValidateAntiforgeryToken, Route(nameof(PostController.UnpublishPost))]
        public PostViewModel UnpublishPost(int postId)
        {
            return _postService.Unpublish(postId);
        }

        /// <summary>
        /// Publish a post by Id
        /// </summary>
        /// <param name="postId"></param>
        /// <returns></returns>
        [HttpPost, Authorize, AutoValidateAntiforgeryToken, Route(nameof(PostController.PublishPost))]
        public PostViewModel PublishPost(int postId)
        {
            return _postService.Publish(postId);
        }
        
        /// <summary>
        /// Method for trying out the "TestServer"
        /// </summary>
        /// <returns></returns>
        [HttpGet, Route(nameof(PostController.UnitTest))]
        public bool UnitTest()
        {
            return true;
        } 
    }
}