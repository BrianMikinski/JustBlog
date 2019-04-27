using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace JustBlog.Models
{
    public class JustBlogContext : DbContext, IJustBlogContext
    {
        public virtual DbSet<Category> Categories { get; set; }

        public virtual DbSet<Post> Posts { get; set; }

        public virtual DbSet<Tag> Tags { get; set; }

        /// <summary>
        /// Allow for specification of connection string in the constructor.
        /// 
        /// Useful when mocking so that we can submit an connection that doesn't exist and 
        /// won't pull the database.
        /// </summary>
        /// <param name="connectionString"></param>
        public JustBlogContext(DbContextOptions<JustBlogContext> options)
            : base(options)
        {
         
        }

        /// <summary>
        /// This method can be used to determine if  the options builder has already been
        /// specified or if you want to override some options every time a dbcontext is created
        /// </summary>
        /// <param name="optionsBuilder"></param>
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlite("Filename=../JustBlog.UI/justblog.sqlite");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            ConfigureCategories(modelBuilder);
            ConfigureTags(modelBuilder);
            ConfigurePosts(modelBuilder);
            ConfigurePostTags(modelBuilder);
        }

        private void ConfigureCategories(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(p => p.Id);

                entity.Property(p => p.Id)
                    .ValueGeneratedOnAdd();

                entity.ToTable("Category")
                .HasMany(e => e.Posts)
                .WithOne(e => e.Category)
                .HasForeignKey(e => e.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);

                // configure data
                aspNetCategory = new Category()
                {
                    Description = "Microsoft Asp.NET",
                    Id = 1,
                    Modified = DateTime.UtcNow,
                    Name = "Asp.Net",
                    UrlSlug = "aspnet"
                };

                angularJsCategory = new Category()
                {
                    Description = "The Google AngularJs client side library.",
                    Id = 2,
                    Modified = DateTime.UtcNow,
                    Name = "AngularJs",
                    UrlSlug = "angularjs"
                };

                karmaCategory = new Category()
                {
                    Description = "The Google JavaScript test runner Karma.",
                    Id = 3,
                    Modified = DateTime.UtcNow,
                    Name = "KarmaJs",
                    UrlSlug = "karmajs"
                };

                humorCategory = new Category()
                {
                    Description = "Humorous things from the internet",
                    Modified = DateTime.UtcNow,
                    Id = 4,
                    Name = "Humor",
                    UrlSlug = "humor"
                };

                programmingCategory = new Category()
                {
                    Description = "Programming of all shades and colors",
                    Modified = DateTime.UtcNow,
                    Id = 5,
                    Name = "Programming",
                    UrlSlug = "programming"
                };

                entity.HasData(aspNetCategory, 
                    angularJsCategory, 
                    karmaCategory, 
                    humorCategory, 
                    programmingCategory);
            });
        }

        private void ConfigurePosts(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Post>(entity => {

                entity.ToTable("Post");

                entity.HasKey(p => p.Id);

                entity.Property(p => p.Id)
                    .ValueGeneratedOnAdd();

                entity.Ignore(p => p.Tags);

                entity.HasData(new Post()
                {
                    CategoryId = aspNetCategory.Id,
                    Content = LOREM_IPSUM_TEXT,
                    Id = 1,
                    Meta = "This is some meta data about Asp.NET",
                    Modified = null,
                    PostedOn = DateTime.UtcNow,
                    Published = true,
                    Title = "Asp.Net Development",
                    ShortDescription = LOREM_IPSUM_SHORT_DESCRIPTION,
                    UrlSlug = "asp_net",
                    Tags = new List<Tag>()
                    {
                        cSharp,
                        htmlTag
                    }
                },
                new Post()
                {
                    CategoryId = angularJsCategory.Id,
                    Content = LOREM_IPSUM_TEXT,
                    Id = 2,
                    Meta = "This is some meta data about AngularJs",
                    Modified = null,
                    PostedOn = DateTime.UtcNow,
                    Published = true,
                    Title = "Front-End Development With AngularJs",
                    ShortDescription = LOREM_IPSUM_SHORT_DESCRIPTION,
                    UrlSlug = "angular_js",
                    Tags = new List<Tag>()
                    {
                        angularTag,
                        clientSideDevelopment,
                        javaScriptTag
                    }
                },
                new Post()
                {
                    CategoryId = programmingCategory.Id,
                    Content = LOREM_IPSUM_TEXT,
                    Id = 3,
                    Meta = "Things every developer should know.",
                    Modified = null,
                    PostedOn = DateTime.UtcNow,
                    Published = true,
                    Title = "10 Things Every Developer Should Know",
                    ShortDescription = LOREM_IPSUM_SHORT_DESCRIPTION,
                    UrlSlug = "development_basics",
                    Tags = new List<Tag>()
                    {
                        htmlTag,
                        angularTag,
                        cssTag,
                        clientSideDevelopment,
                        javaScriptTag
                    }
                },
                new Post()
                {
                    CategoryId = humorCategory.Id,
                    Content = LOREM_IPSUM_TEXT,
                    Id = 4,
                    Meta = "These jokes are so funny!",
                    Modified = null,
                    PostedOn = DateTime.UtcNow,
                    Published = true,
                    Title = "What did the dev say to the product owner?",
                    ShortDescription = LOREM_IPSUM_SHORT_DESCRIPTION,
                    UrlSlug = "dev_humor"
                },
                new Post()
                {
                    CategoryId = karmaCategory.Id,
                    Content = LOREM_IPSUM_TEXT,
                    Id = 5,
                    Meta = "This is some meta data about KarmaJs",
                    Modified = null,
                    PostedOn = DateTime.UtcNow,
                    Published = true,
                    Title = "Angular Unit Tests with Karma Js",
                    ShortDescription = LOREM_IPSUM_SHORT_DESCRIPTION,
                    UrlSlug = "karma_js",
                    Tags = new List<Tag>()
                    {
                        angularTag,
                        clientSideDevelopment,
                        javaScriptTag
                    }
                });
            });
        }

        private void ConfigurePostTags(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PostTagMap>(entity =>
            {
                entity.HasKey(p => new { p.Post_id, p.Tag_id });

                entity.ToTable("PostTagMap")
                .HasOne(p => p.Post)
                .WithMany(p => p.PostTags)
                .HasForeignKey(p => p.Post_id);

                entity.HasOne(p => p.Tag)
                .WithMany(p => p.PostTags)
                .HasForeignKey(p => p.Tag_id);
            });
        }

        private void ConfigureTags(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Tag>(entity =>
            {
                entity.HasKey(p => p.Id);
                entity.Ignore(p => p.Posts);
                entity.ToTable("Tag");

                // configure data
                clientSideDevelopment = new Tag()
                {
                    Description = "Development taking place in a client browser.",
                    Id = 1,
                    Modified = DateTime.UtcNow,
                    Name = "Client Side",
                    UrlSlug = "client_side",
                };

                angularTag = new Tag()
                {
                    Description = "AngularJs",
                    Id = 2,
                    Modified = DateTime.UtcNow,
                    Name = "Angularjs",
                    UrlSlug = "angular_js"
                };

                cSharp = new Tag()
                {
                    Description = "C#",
                    Id = 3,
                    Modified = DateTime.UtcNow,
                    Name = "C#",
                    UrlSlug = "c_sharp"
                };

                cssTag = new Tag()
                {
                    Description = "CSS - how you describe and organize HTML layouts",
                    Id = 4,
                    Modified = DateTime.UtcNow,
                    Name = "CSS",
                    UrlSlug = "css"
                };

                javaScriptTag = new Tag()
                {
                    Description = "JavaScript - programming for browsers",
                    Id = 5,
                    Modified = DateTime.UtcNow,
                    Name = "JavaScript",
                    UrlSlug = "javascript"
                };

                htmlTag = new Tag()
                {
                    Description = "Html - creating World Wide Web content",
                    Id = 6,
                    Modified = DateTime.UtcNow,
                    Name = "HTML",
                    UrlSlug = "html"
                };

                entity.HasData(clientSideDevelopment,
                    angularTag,
                    cSharp,
                    javaScriptTag,
                    htmlTag,
                    cssTag);
            });
        }
        
        /**
         * Seed data
         */ 
        private Tag clientSideDevelopment, angularTag, cSharp, cssTag, javaScriptTag, htmlTag;
        private Category aspNetCategory, angularJsCategory, karmaCategory, humorCategory, programmingCategory;

        /// <summary>
        /// Short description text for posts
        /// </summary>
        private const string LOREM_IPSUM_SHORT_DESCRIPTION = @"<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut 
                                                     laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper 
                                                    suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate 
                                                    velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio 
                                                    dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor 
                                                    cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent 
                                                    claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me 
                                                    lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est 
                                                    notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta 
                                                    decima et quinta decima.</p>";

        /// <summary>
        /// Description text for posts
        /// </summary>
        private const string LOREM_IPSUM_TEXT = @"<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut 
                                                     laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper 
                                                    suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate 
                                                    velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio 
                                                    dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor 
                                                    cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent 
                                                    claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me 
                                                    lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est 
                                                    notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta 
                                                    decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.</p>', '<p>Lorem 
                                                    ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam 
                                                    erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea 
                                                    commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore 
                                                    eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue 
                                                    duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod 
                                                    mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. 
                                                    Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, 
                                                    qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, 
                                                    anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur 
                                                    parum clari, fiant sollemnes in futurum.</p><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy 
                                                    nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
                                                    ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu 
                                                    feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option 
                                                    congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes 
                                                    demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. 
                                                    Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi,
                                                    qui nunc nobis videntur parum clari, fiant sollemnes in futurum.</p><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt 
                                                    ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. 
                                                    Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, 
                                                    vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta 
                                                    nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam;
                                                    est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, 
                                                    qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula
                                                    quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.</p>";
    }
}
