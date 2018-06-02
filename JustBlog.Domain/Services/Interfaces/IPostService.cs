using JustBlog.Models;
using JustBlog.ViewModels;
using System;
using System.Collections.Generic;

namespace JustBlog.Domain.Services
{
    public interface IPostService
    {
        /// <summary>
        /// Return post based on unique id.
        /// </summary>
        /// <param name="postId">Post unique id</param>
        /// <returns></returns>
        PostViewModel Post(int id);

        /// <summary>
        /// Get a post by a unique url slug
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        PostViewModel Post(string url);

        /// <summary>
        /// Publish a post by post Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        PostViewModel Publish(int id);

        /// <summary>
        /// Retrieve a list of posts based on category Id
        /// </summary>
        /// <param name="categoryId"></param>
        /// <returns></returns>
        List<PostViewModel> CategoryPosts(int categoryId);

        /// <summary>
        /// Get a paged list of posts. Default sort field is PostedOn propert.
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        IQuery<Post, PostFilter> Posts(IPagingProperties<Post> pagingProperties, PostFilter filter);

        /// <summary>
        /// Save a post. This method is used to both save and publish a new post.
        /// </summary>
        /// <param name="currentPost"></param>
        /// <returns></returns>
        PostViewModel Save(PostViewModel currentPost, bool publishPost);

        /// <summary>
        /// Unpublish a post
        /// </summary>
        /// <param name="postId"></param>
        /// <returns></returns>
        PostViewModel Unpublish(int postId);
    }
}
