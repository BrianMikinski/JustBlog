using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace JustBlog.Models
{
    public partial class Tag
    {
        public Tag()
        {
            Posts = new HashSet<Post>();
        }

        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        [Required]
        [StringLength(50)]
        public string UrlSlug { get; set; }

        [StringLength(200)]
        public string Description { get; set; }

        public ICollection<Post> Posts { get; set; }

        public DateTime? Modified { get; set; }

        public IEnumerable<PostTagMap> PostTags { get; private set; }
    }
}
