using System;
using System.ComponentModel.DataAnnotations;

namespace JustBlog.ViewModels
{
    public class TagViewModel
    {
        /// <summary>
        /// A description of the tag
        /// </summary>
        [StringLength(200)]
        public string Description { get; set; }

        /// <summary>
        /// A unique identifer for the tag
        /// </summary>
        public int? Id { get; set; }

        /// <summary>
        /// The last date the tag was modified
        /// </summary>
        public DateTime? Modified { get; set; }

        /// <summary>
        /// The name of the tag
        /// </summary>
        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        /// <summary>
        /// The number of posts associated to this tag
        /// </summary>
        public int PostCount { get; set; }

        /// <summary>
        /// The url of the tag
        /// </summary>
        [Required]
        [StringLength(50)]
        public string UrlSlug { get; set; }
    }
}