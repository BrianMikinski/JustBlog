using JustBlog.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace JustBlog.ViewModels
{
    public class PostViewModel
    {
        public PostViewModel()
        {
            Tags = new List<Tag>();
        }

        /// <summary>
        /// A category that has been associated with the post
        /// </summary>
        public CategoryViewModel Category { get; set; }

        /// <summary>
        /// The content of the post
        /// </summary>
        [Required]
        public string Description { get; set; }

        /// <summary>
        /// The unique identitier of hte post
        /// </summary>
        public int? Id { get; set; }

        /// <summary>
        /// The title of the last post based on the published date
        /// </summary>
        public string LastPostTitle { get; set; }

        /// <summary>
        /// The url of the last post based on the published date
        /// </summary>
        public string LastPostUrlSlug { get; set; }

        [Required]
        [StringLength(1000)]
        public string Meta { get; set; }

        public DateTime? Modified { get; set; }

        /// <summary>
        /// The title of the next post based on the published date
        /// </summary>
        public string NextPostTitle { get; set; }

        /// <summary>
        /// The url of the next posted based on the published date
        /// </summary>
        public string NextPostUrlSlug { get; set; }

        /// <summary>
        /// The date the post was published on
        /// </summary>
        public DateTime? PostedOn { get; set; }

        /// <summary>
        /// Has the post been published or not?
        /// </summary>
        public bool Published { get; set; }

        /// <summary>
        /// A short description of the post
        /// </summary>
        [Required]
        public string ShortDescription { get; set; }

        /// <summary>
        /// Tags that have been associated to the post
        /// </summary>
        public virtual List<Tag> Tags { get; set; }

        /// <summary>
        /// The title of hte post
        /// </summary>
        [Required]
        [StringLength(500)]
        public string Title { get; set; }

        /// <summary>
        /// The Url of the post
        /// </summary>
        [Required]
        [StringLength(200)]
        public string UrlSlug { get; set; }
    }
}
