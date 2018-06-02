using JustBlog.Models;
using System.Collections.Generic;

namespace JustBlog.ViewModels
{
    public class Profile
    {
        public string AdminEmail { get; set; }

        public string Author { get; set; }

        public string Description { get; set; }

        public string Domain { get; set; }

        public string Facebook { get; set; }

        public string Github { get; set; }

        public string Motto { get; set; }

        public List<Post> Posts { get; set; }

        public string Title { get; set; }

        public string Twitter { get; set; }

        public string URL { get; set; }

        public string XMLFeed { get; set; }
    }
}