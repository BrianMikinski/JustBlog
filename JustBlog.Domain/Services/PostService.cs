using JustBlog.Models;
using JustBlog.ViewModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace JustBlog.Domain.Services
{
    /// <summary>
    /// Service class for handling all actions involving posts
    /// </summary>
    public class PostService : Repository<Post>, IPostService
    {
        private readonly IJustBlogContext _Context;

        public PostService(IJustBlogContext context) : base(context.Posts, (DbContext)context)
        {
            _Context = context;
        }
      
        public PostViewModel Post(int id)
        {
            Post post = _Context.Posts.Include(p => p.PostTags).Include(p => p.Category).Where(p => p.Id == id).FirstOrDefault();

            if (post == null)
            {
                throw new JustBlogException($"Post with Id: \"{id}\" could not be found.");
            }

            //Next post information
            Post nextPost = _Context.Posts.Where(p => p.Published
                                                    && p.PostedOn > post.PostedOn)
                                                    .OrderBy(p => p.PostedOn)
                                                    .FirstOrDefault();

            //Last post information
            Post lastPost = _Context.Posts.Where(p => p.Published
                                                   && p.PostedOn < post.PostedOn)
                                                    .OrderByDescending(p => p.PostedOn)
                                                    .FirstOrDefault();

            return ConvertPostToViewModel(post, lastPost, nextPost);
        }
    
        public PostViewModel Post(string url)
        {
            Post post = _Context.Posts.Include(p => p.PostTags).Include(p => p.Category).SingleOrDefault(p => p.UrlSlug == url);
            Post nextPost = null;
            Post lastPost = null;

            if (post != null)
            {
                //Next post information
                nextPost = _Context.Posts.Where(p => p.Published && p.PostedOn > post.PostedOn)
                                                        .OrderBy(p => p.PostedOn)
                                                        .FirstOrDefault();

                //Last post information
                lastPost = _Context.Posts.Where(p => p.Published && p.PostedOn < post.PostedOn)
                                                        .OrderBy(p => p.PostedOn)
                                                        .FirstOrDefault();
            }

            return ConvertPostToViewModel(post, lastPost, nextPost);
        }
    
        public PostViewModel Publish(int id)
        {
            JustBlogContext currentContext = (JustBlogContext)_Context;
            Post currentPost = currentContext.Posts.Attach(_Context.Posts.Find(id)).Entity;
            currentPost.Published = true;
            currentPost.PostedOn = DateTime.UtcNow;
            currentPost.Modified = DateTime.UtcNow;

            bool saveSuccessful = currentContext.SaveChanges() > 0;

            if (saveSuccessful)
            {
                return LoadEditedPost(currentContext, currentPost);
            }
            else
            {
                throw new JustBlogException($"Post with Id: {id} could not be published");
            }
        }
   
        public List<PostViewModel> CategoryPosts(int categoryId)
        {
            List<Post> results = _Context.Posts.Include(p => p.PostTags).Include(p => p.Category).Where(p => p.CategoryId == categoryId).ToList();

            List<PostViewModel> viewModelResults = new List<PostViewModel>();

            foreach (Post dataModelPost in results)
            {
                viewModelResults.Add(new PostViewModel()
                {
                    Description = dataModelPost.Content,
                    Id = dataModelPost.Id,
                    PostedOn = dataModelPost.PostedOn != null ? dataModelPost.PostedOn.Value : new DateTime(),
                    Modified = dataModelPost.Modified,
                    Published = dataModelPost.Published,
                    Title = dataModelPost.Title,
                    UrlSlug = dataModelPost.UrlSlug,
                    Tags = new List<Tag>(),
                    Category = new CategoryViewModel(),
                    ShortDescription = dataModelPost.ShortDescription
                });
            }

            return viewModelResults;
        }
     
        public IQuery<Post, PostFilter> Posts(IPagingProperties<Post> pagingProperties, PostFilter filter)
        {
            if (pagingProperties.SortFields.Count <= 0)
            {
                pagingProperties.SortFields.Add(new SortField<Post>(p => p.PostedOn, false));
            }

            Query<Post, PostFilter> query = new Query<Post, PostFilter>(pagingProperties);

            if (filter.IsPublished)
            {
                query.Queryable = _Context.Posts.Where(p => p.Published)
                                                    .Include(p => p.PostTags)
                                                    .ThenInclude(p => p.Tag);
            }
            else
            {
                query.Queryable = _Context.Posts.Where(p => true);
            }
            
            query.SortAndPage();

            return query;
        }

        public PostViewModel Save(PostViewModel currentPost, bool publishPost)
        {
            JustBlogContext currentContext = (JustBlogContext)_Context;
            Post newPost = new Post();
            List<Tag> postTags = new List<Tag>();
            DateTime currentDateTime = DateTime.UtcNow;
            bool saveSuccess = false;

            if (currentPost != null)
            {
                //Post
                newPost = new Post()
                {
                    CategoryId = currentPost.Category.Id.Value,
                    Content = currentPost.Description,
                    ShortDescription = currentPost.ShortDescription,
                    Title = currentPost.Title,
                    UrlSlug = currentPost.UrlSlug,
                    Published = currentPost.Published || publishPost,
                    Meta = currentPost.Meta == "" || currentPost.Meta == null ? "No meta data" : currentPost.Meta,
                    PostedOn = currentPost.PostedOn,
                    Modified = currentDateTime
                };

                //Tags
                foreach (Tag currentTag in currentPost?.Tags)
                {
                    postTags.Add(new Tag()
                    {
                        Description = currentTag.Description,
                        Id = currentTag.Id,
                        Name = currentTag.Name,
                        UrlSlug = currentTag.UrlSlug
                    });
                }

                if (currentPost.PostedOn == null && publishPost)
                {
                    newPost.PostedOn = currentDateTime;
                }

                /**
                 * Note that you must track all entities
                 * from the Post side of the Post - PostTagMap - Tag database schema.
                 * If you incorrectly track entites you will add new tags as opposed to
                 * maintaining the many-to-many relationship.
                 **/
                if (currentPost?.Id == null)
                {
                    //Add a new post
                    //Attach tags from the database to post
                    foreach (Tag clientTag in postTags)
                    {
                        if (currentContext.Entry(clientTag).State == EntityState.Detached)
                        {
                            currentContext.Tags.Attach(clientTag);
                        }
                    }

                    newPost.Tags = postTags;
                    currentContext.Posts.Add(newPost);
                    saveSuccess = currentContext.SaveChanges() > 0;
                }
                else
                {
                    //Modify and existing post.
                    bool tagsModified = false;
                    newPost.Id = currentPost.Id.Value;
                    currentContext.Posts.Attach(newPost);
                    currentContext.Entry(newPost).State = EntityState.Modified;

                    saveSuccess = currentContext.SaveChanges() > 0 ? true : false;
                    List<Tag> dataTags = currentContext.Posts.Include(post => post.Tags).FirstOrDefault(p => p.Id == newPost.Id).Tags.ToList();

                    //Remove old tags
                    foreach (Tag tag in dataTags)
                    {
                        if (!postTags.Select(p => p.Id).ToList().Contains(tag.Id))
                        {
                            tagsModified = true;
                            newPost.Tags.Remove(tag);
                        }
                    }

                    if (postTags.Count > 0)
                    {
                        //Add new tags
                        foreach (Tag clientTag in postTags)
                        {
                            //Attach each tag because it comes from the client, not the database
                            if (!dataTags.Select(p => p.Id).ToList().Contains(clientTag.Id))
                            {
                                currentContext.Tags.Attach(clientTag);
                            }

                            if (!dataTags.Select(p => p.Id).ToList().Contains(clientTag.Id))
                            {
                                tagsModified = true;
                                newPost.Tags.Add(currentContext.Tags.Find(clientTag.Id));
                            }
                        }

                        //Only save changes if we modified the tags
                        if (tagsModified)
                        {
                            saveSuccess = currentContext.SaveChanges() > 0;
                        }
                    }
                }
            }

            if (saveSuccess)
            {
                return LoadEditedPost(currentContext, newPost);
            }
            else
            {
                throw new JustBlogException($"Error saving changes to {newPost.Title}");
            }
        }
      
        public PostViewModel Unpublish(int postId)
        {
            JustBlogContext currentContext = (JustBlogContext)_Context;
            Post currentPost = currentContext.Posts.Attach(_Context.Posts.Find(postId)).Entity;
            currentPost.Published = false;
            currentPost.PostedOn = null;
            currentPost.Modified = DateTime.UtcNow;

            bool saveSuccessful = currentContext.SaveChanges() > 0;

            if (saveSuccessful)
            {
                return LoadEditedPost(currentContext, currentPost);
            }
            else
            {
                throw new InvalidOperationException($"Post with Id: {postId} could not be unpublished");
            }
        }

        /// <summary>
        /// Convert a post to a view model post
        /// </summary>
        /// <param name="currentPost"></param>
        /// <returns></returns>
        private PostViewModel ConvertPostToViewModel(Post currentPost, Post lastPost, Post nextPost)
        {
            PostViewModel newPost;
            if (currentPost != null)
            {

                DateTime? currentDateTime = null;

                if (currentPost.PostedOn.HasValue)
                {
                    currentDateTime = currentPost.PostedOn;
                }

                newPost = new PostViewModel()
                {
                    Category = new CategoryViewModel()
                    {
                        Id = currentPost.Category.Id,
                        Name = currentPost.Category.Name,
                        UrlSlug = currentPost.UrlSlug,
                        Posts = null
                    },
                    Description = currentPost.Content,
                    Id = currentPost.Id,
                    Meta = currentPost.Meta,
                    Modified = currentPost.Modified,
                    PostedOn = currentDateTime,
                    Published = currentPost.Published,
                    ShortDescription = currentPost.ShortDescription,
                    Title = currentPost.Title,
                    UrlSlug = currentPost.UrlSlug
                };

                foreach (Tag tag in currentPost.Tags.ToList())
                {
                    newPost.Tags.Add(new Tag()
                    {
                        Description = tag.Description,
                        Id = tag.Id,
                        Name = tag.Name,
                        Posts = null,
                        UrlSlug = tag.UrlSlug
                    });
                }

                newPost.LastPostUrlSlug = lastPost?.UrlSlug;
                newPost.LastPostTitle = lastPost?.Title;

                newPost.NextPostUrlSlug = nextPost?.UrlSlug;
                newPost.NextPostTitle = nextPost?.Title;
            }
            else
            {
                newPost = new PostViewModel();
            }

            return newPost;
        }

        /// <summary>
        /// Load and edited post
        /// </summary>
        /// <returns></returns>
        private PostViewModel LoadEditedPost(JustBlogContext currentContext, Post currentPost)
        {
            currentContext.Posts.Attach(currentPost);

            currentContext.Entry(currentPost).Reference(p => p.Category).Load();
            currentContext.Entry(currentPost).Collection(p => p.PostTags).Load();

            PostViewModel editedPost = new PostViewModel()
            {
                Category = new CategoryViewModel()
                {
                    Description = currentPost.Category.Description,
                    Id = currentPost.Category.Id,
                    Modified = currentPost.Category.Modified,
                    Name = currentPost.Category.Name,
                    PostCount = currentPost.Category.Posts.Count,
                    Posts = null,
                    UrlSlug = currentPost.Category.UrlSlug
                },
                Description = currentPost.Content,
                Id = currentPost.Id,
                Meta = currentPost.Meta,
                Modified = currentPost.Modified,
                PostedOn = currentPost.PostedOn,
                Published = currentPost.Published,
                Tags = currentPost?.Tags.ToList(),
                Title = currentPost.Title,
                UrlSlug = currentPost.UrlSlug,
                ShortDescription = currentPost.ShortDescription
            };

            List<Tag> newTags = new List<Tag>();

            foreach (Tag currentTag in editedPost.Tags)
            {
                newTags.Add(new Tag()
                {
                    Description = currentTag.Description,
                    Id = currentTag.Id,
                    Modified = currentTag.Modified,
                    Name = currentTag.Name,
                    Posts = new List<Post>(),
                    UrlSlug = currentTag.UrlSlug
                });
            }

            editedPost.Tags = newTags;

            return editedPost;
        }

        /// <summary>
        /// Convert a list of Tags to a list of TagViewModels
        /// </summary>
        /// <param name="tags"></param>
        /// <returns></returns>
        private List<TagViewModel> ConvertToTagViewModels(List<Tag> tags)
        {
            List<TagViewModel> viewModels = new List<TagViewModel>();

            foreach (var tag in tags)
            {
                viewModels.Add(new TagViewModel()
                {
                    Description = tag.Description,
                    Id = tag.Id,
                    Modified = tag.Modified,
                    Name = tag.Name,
                    PostCount = -1,
                    UrlSlug = tag.UrlSlug
                });
            }

            return viewModels;
        }
    }
}
