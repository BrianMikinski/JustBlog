using System;
using System.ComponentModel.DataAnnotations;

namespace JustBlog.Models.Tests
{
    /// <summary>
    /// Class used to test paging and sorting
    /// </summary>
    internal class TestPost
    {
        public int Category { get; set; }
        [Required]
        public string Description { get; set; }

        public int Id { get; set; }

        [Required]
        [StringLength(1000)]
        public string Meta { get; set; }

        public DateTime? Modified { get; set; }

        public DateTime? PostedOn { get; set; }

        public bool Published { get; set; }

        [Required]
        public string ShortDescription { get; set; }

        [Required]
        [StringLength(500)]
        public string Title { get; set; }
        [Required]
        [StringLength(200)]
        public string UrlSlug { get; set; }
    }
}
