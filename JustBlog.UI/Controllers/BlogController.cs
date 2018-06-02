using JustBlog.Domain.Services;
using JustBlog.Models;
using JustBlog.UI.Infrastructure;
using JustBlog.UI.Models;
using JustBlog.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Linq;
using System.Net.Mail;
using System.Text;

namespace JustBlog.UI.Controllers
{
    /// <summary>
    /// Home controller that contain actions to return list/view pages and others.
    /// </summary>
    [AllowAnonymous]
    [Route(RoutePrefixes.BLOG_RESOURCE)]
    public class BlogController : Controller
    {
        private readonly IPostService _postService;
        private readonly BlogOptions _blogSettings;
        private readonly SocialMedia _socialMediaSettings;

        public BlogController(IPostService postService, IOptions<BlogOptions> blogSettings, IOptions<SocialMedia> socialMediaSettings)
        {
            _postService = postService;
            _blogSettings = blogSettings.Value;
            _socialMediaSettings = socialMediaSettings.Value;
        }

        /// <summary>
        /// Retrieve all of the Blog Meta Data
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route(nameof(BlogController.MetaData))]
        public Profile MetaData()
        {
            Profile profile = new Profile();

            // get the latest 10 posts
            IQuery<Post, PostFilter> query = _postService.Posts(new PagingProperties<Post>(p => p.PostedOn), new PostFilter()
            {
                IsPublished = true
            });

            profile.Posts = query.Results.Select(p => new Post()
            {
                CategoryId = p.CategoryId,
                Content = p.Content,
                Id = p.Id,
                Meta = p.Meta,
                Modified = p.Modified,
                PostedOn = p.PostedOn,
                Published = p.Published,
                ShortDescription = p.ShortDescription,
                Title = p.Title,
                UrlSlug = p.UrlSlug
            }).OrderBy(p => p.PostedOn).ToList();

            profile.Author = _blogSettings.Author;
            profile.AdminEmail = _blogSettings.AdminEmail;
            profile.Domain = _blogSettings.Domain;
            profile.Description = _blogSettings.Description;
            profile.Facebook = _socialMediaSettings.Facebook;
            profile.Github = _socialMediaSettings.Github;
            profile.Twitter = _socialMediaSettings.Twitter;
            profile.Motto = _blogSettings.Motto;
            profile.Title = _blogSettings.Title;
            profile.XMLFeed = _blogSettings.FeedBurnerUrl;
            profile.URL = _blogSettings.Url;

            return profile;
        }

        /// <summary>
        /// Send an email to the blog admin from the POSTed contact form.
        /// </summary>
        /// <param name="contact"></param>
        /// <returns></returns>
        [HttpPost]
        [Route(nameof(BlogController.Contact))]
        public void Contact(Contact contact)
        {
            if (ModelState.IsValid)
            {
                using (var client = new SmtpClient())
                {
                    var adminEmail = _blogSettings.AdminEmail;
                    var from = new MailAddress(adminEmail, "JustBlog Messenger");
                    var to = new MailAddress(adminEmail, "JustBlog Admin");

                    using (var message = new MailMessage(from, to))
                    {
                        message.Body = contact.Body;
                        message.IsBodyHtml = true;
                        message.BodyEncoding = Encoding.UTF8;

                        message.Subject = contact.Subject;
                        message.SubjectEncoding = Encoding.UTF8;

                        message.ReplyTo = new MailAddress(contact.Email);

                        client.Send(message);
                    }
                }
            }
        }
    }
}
