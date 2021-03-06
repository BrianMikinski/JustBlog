using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace JustBlog.Models
{
    public partial class Category
    {
        public Category()
        {
            Posts = new HashSet<Post>();
        }
       
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        [Required]
        [StringLength(50)]
        public string UrlSlug { get; set; }

        [StringLength(200)]
        public string Description { get; set; }

        public virtual ICollection<Post> Posts { get; set; }

        public DateTime? Modified { get; set; }
    }
}
