using JustBlog.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace JustBlog.ViewModels
{
    public class CategoryViewModel
    {
        [Required]
        [StringLength(200)]
        public string Description { get; set; }

        public int? Id { get; set; }

        public DateTime? Modified { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; }
        public int PostCount { get; set; }

        public List<Post> Posts { get; set; }

        [Required]
        [StringLength(50)]
        public string UrlSlug { get; set; }
    }
}
