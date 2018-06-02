using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace JustBlog.Models
{
    public partial class Post
    {
        public Post()
        {
            Tags = new HashSet<Tag>();
        }

        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(500)]
        public string Title { get; set; }

        [Required]
        public string ShortDescription { get; set; }

        [Required]
        public string Content { get; set; }

        [Required]
        [StringLength(1000)]
        public string Meta { get; set; }

        [Required]
        [StringLength(200)]
        public string UrlSlug { get; set; }

        public bool Published { get; set; }

        public DateTime? PostedOn { get; set; }

        public DateTime? Modified { get; set; }

        public int CategoryId { get; set; }

        public virtual Category Category { get; set; }

        public virtual ICollection<Tag> Tags { get; set; }

        public IEnumerable<PostTagMap> PostTags { get; private set; }
    }
}
