//namespace JustBlog.Models.Migrations
//{
//    using Models;
//    using System;
//    using System.Collections.Generic;
//    using System.Data.Entity.Migrations;

//    /// <summary>
//    /// Initialize and seed the JustBlog database. The namespace of this migration must be unique.
//    /// This configuration will delete all previous data.
//    /// </summary>
//    internal sealed class JustBlogDbConfiguration : DbMigrationsConfiguration<JustBlogContext>
//    {
//        private Tag clientSideDevelopment, angularTag, cSharp, cssTag, javaScriptTag, htmlTag;
//        private Category aspNetCategory, angularJsCategory, karmaCategory, humorCategory, programmingCategory;

//        public JustBlogDbConfiguration()
//        {
//            AutomaticMigrationsEnabled = true;
//            AutomaticMigrationDataLossAllowed = true;
//            ContextKey = "BlogContext";
//        }

//        /// <summary>
//        /// Seed migration with data
//        /// </summary>
//        /// <param name="context"></param>
//        protected override void Seed(JustBlogContext context)
//        {
//            context.Categories.AddOrUpdate(seedCatgories());
//            context.Tags.AddOrUpdate(seedTags());
//            context.Posts.AddOrUpdate(seedPosts());
//        }

//        /// <summary>
//        /// Seed data for the category table
//        /// </summary>
//        /// <returns></returns>
//        private Category[] seedCatgories()
//        {
//            // categories
//            aspNetCategory = new Category()
//            {
//                Description = "Microsoft Asp.NET",
//                Id = 0,
//                Modified = DateTime.UtcNow,
//                Name = "Asp.Net",
//                UrlSlug = "aspnet"
//            };

//            angularJsCategory = new Category()
//            {
//                Description = "The Google AngularJs client side library.",
//                Id = 1,
//                Modified = DateTime.UtcNow,
//                Name = "AngularJs",
//                UrlSlug = "angularjs"
//            };

//            karmaCategory = new Category()
//            {
//                Description = "The Google JavaScript test runner Karma.",
//                Id = 2,
//                Modified = DateTime.UtcNow,
//                Name = "KarmaJs",
//                UrlSlug = "karmajs"
//            };

//            humorCategory = new Category()
//            {
//                Description = "Humorous things from the internet",
//                Modified = DateTime.UtcNow,
//                Id = 4,
//                Name = "Humor",
//                UrlSlug = "humor"
//            };

//            programmingCategory = new Category()
//            {
//                Description = "Programming of all shades and colors",
//                Modified = DateTime.UtcNow,
//                Id = 5,
//                Name = "Programming",
//                UrlSlug = "programming"
//            };

//            List<Category> categories = new List<Category>();
//            categories.Add(aspNetCategory);
//            categories.Add(angularJsCategory);
//            categories.Add(karmaCategory);
//            categories.Add(humorCategory);
//            categories.Add(programmingCategory);

//            return categories.ToArray();
//        }

//        /// <summary>
//        /// Seed data for the tags table
//        /// </summary>
//        /// <returns></returns>
//        private Tag[] seedTags()
//        {
//            // tags
//            clientSideDevelopment = new Tag()
//            {
//                Description = "Development taking place in a client browser.",
//                Id = 0,
//                Modified = DateTime.UtcNow,
//                Name = "Client Side",
//                UrlSlug = "client_side",
//            };

//            angularTag = new Tag()
//            {
//                Description = "AngularJs",
//                Id = 1,
//                Modified = DateTime.UtcNow,
//                Name = "Angularjs",
//                UrlSlug = "angular_js"
//            };

//            cSharp = new Tag()
//            {
//                Description = "C#",
//                Id = 2,
//                Modified = DateTime.UtcNow,
//                Name = "C#",
//                UrlSlug = "c_sharp"
//            };

//            cssTag = new Tag()
//            {
//                Description = "CSS - how you describe and organize HTML layouts",
//                Id = 3,
//                Modified = DateTime.UtcNow,
//                Name = "CSS",
//                UrlSlug = "css"
//            };

//            javaScriptTag = new Tag()
//            {
//                Description = "JavaScript - programming for browsers",
//                Id = 4,
//                Modified = DateTime.UtcNow,
//                Name = "JavaScript",
//                UrlSlug = "javascript"
//            };

//            htmlTag = new Tag()
//            {
//                Description = "Html - creating World Wide Web content",
//                Id = 4,
//                Modified = DateTime.UtcNow,
//                Name = "HTML",
//                UrlSlug = "html"
//            };

//            List<Tag> tags = new List<Tag>();
//            tags.Add(clientSideDevelopment);
//            tags.Add(angularTag);
//            tags.Add(cSharp);
//            tags.Add(javaScriptTag);
//            tags.Add(htmlTag);
//            tags.Add(cssTag);

//            return tags.ToArray();
//        }

//        /// <summary>
//        /// Seed data for the post table
//        /// </summary>
//        /// <returns></returns>
//        private Post[] seedPosts()
//        {
//            // posts

//            List<Post> posts = new List<Post>()
//            {
//                new Post()
//                {
//                    CategoryId = aspNetCategory.Id,
//                    Content = LOREM_IPSUM_TEXT,
//                    Id = 0,
//                    Meta = "This is some meta data about Asp.NET",
//                    Modified = null,
//                    PostedOn = DateTime.UtcNow,
//                    Published = true,
//                    Title = "Asp.Net Development",
//                    ShortDescription = LOREM_IPSUM_SHORT_DESCRIPTION,
//                    UrlSlug = "asp_net",
//                    Tags = new List<Tag>()
//                    {
//                        cSharp,
//                        htmlTag
//                    }
//                },
//                new Post()
//                {
//                    CategoryId = angularJsCategory.Id,
//                    Content = LOREM_IPSUM_TEXT,
//                    Id = 1,
//                    Meta = "This is some meta data about AngularJs",
//                    Modified = null,
//                    PostedOn = DateTime.UtcNow,
//                    Published = true,
//                    Title = "Front-End Development With AngularJs",
//                    ShortDescription = LOREM_IPSUM_SHORT_DESCRIPTION,
//                    UrlSlug = "angular_js",
//                    Tags = new List<Tag>()
//                    {
//                        angularTag,
//                        clientSideDevelopment,
//                        javaScriptTag
//                    }
//                },
//                new Post()
//                {
//                    CategoryId = programmingCategory.Id,
//                    Content = LOREM_IPSUM_TEXT,
//                    Id = 2,
//                    Meta = "Things every developer should know.",
//                    Modified = null,
//                    PostedOn = DateTime.UtcNow,
//                    Published = true,
//                    Title = "10 Things Every Developer Should Know",
//                    ShortDescription = LOREM_IPSUM_SHORT_DESCRIPTION,
//                    UrlSlug = "development_basics",
//                    Tags = new List<Tag>()
//                    {
//                        htmlTag,
//                        angularTag,
//                        cssTag,
//                        clientSideDevelopment,
//                        javaScriptTag
//                    }
//                },
//                new Post()
//                {
//                    CategoryId = humorCategory.Id,
//                    Content = LOREM_IPSUM_TEXT,
//                    Id = 3,
//                    Meta = "These jokes are so funny!",
//                    Modified = null,
//                    PostedOn = DateTime.UtcNow,
//                    Published = true,
//                    Title = "What did the dev say to the product owner?",
//                    ShortDescription = LOREM_IPSUM_SHORT_DESCRIPTION,
//                    UrlSlug = "dev_humor"
//                },
//                new Post()
//                {
//                    CategoryId = karmaCategory.Id,
//                    Content = LOREM_IPSUM_TEXT,
//                    Id = 4,
//                    Meta = "This is some meta data about KarmaJs",
//                    Modified = null,
//                    PostedOn = DateTime.UtcNow,
//                    Published = true,
//                    Title = "Angular Unit Tests with Karma Js",
//                    ShortDescription = LOREM_IPSUM_SHORT_DESCRIPTION,
//                    UrlSlug = "karma_js",
//                    Tags = new List<Tag>()
//                    {
//                        angularTag,
//                        clientSideDevelopment,
//                        javaScriptTag
//                    }
//                }
//                // Add the following posts so we have more than 10
//                //'My Mouse Is Missing'
//                //'Computers Have Souls'
//                //'I'' Genius'
//                //'Best Practices in Programming'
//                //'Computers Are Awesome'
//                //'My Coding Is Bad'
//                //'I Like Steve', '
//                //'How JavaScript Works'
//                //'Best Practices in Client-Side Coding'
//                //'Mobile Programming'
//                //'How To Create Blog'
//                //'Introduction To Agile'
//                //'HTML5 And CSS3'
//                //'Eat, Pray And Love'
//                //'Responsive Websites'
//            };

//            return posts.ToArray();
//        }

//        private const string LOREM_IPSUM_SHORT_DESCRIPTION = @"<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut 
//                                                     laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper 
//                                                    suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate 
//                                                    velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio 
//                                                    dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor 
//                                                    cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent 
//                                                    claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me 
//                                                    lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est 
//                                                    notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta 
//                                                    decima et quinta decima.</p>";

//        /// <summary>
//        /// Description text
//        /// </summary>
//        private const string LOREM_IPSUM_TEXT = @"<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut 
//                                                     laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper 
//                                                    suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate 
//                                                    velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio 
//                                                    dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor 
//                                                    cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent 
//                                                    claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me 
//                                                    lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est 
//                                                    notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta 
//                                                    decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.</p>', '<p>Lorem 
//                                                    ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam 
//                                                    erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea 
//                                                    commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore 
//                                                    eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue 
//                                                    duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod 
//                                                    mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. 
//                                                    Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, 
//                                                    qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, 
//                                                    anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur 
//                                                    parum clari, fiant sollemnes in futurum.</p><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy 
//                                                    nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
//                                                    ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu 
//                                                    feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option 
//                                                    congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes 
//                                                    demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. 
//                                                    Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi,
//                                                    qui nunc nobis videntur parum clari, fiant sollemnes in futurum.</p><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt 
//                                                    ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. 
//                                                    Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, 
//                                                    vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta 
//                                                    nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam;
//                                                    est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, 
//                                                    qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula
//                                                    quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.</p>";
//    }
//}