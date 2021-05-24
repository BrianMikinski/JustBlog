using JustBlog.Domain.Services;
using JustBlog.IdentityManagement;
using JustBlog.IdentityManagement.Account;
using JustBlog.IdentityManagement.Login;
using JustBlog.IdentityManagement.Services;
using JustBlog.Models;
using JustBlog.UI.Filters;
using JustBlog.UI.Infrastructure;
using JustBlog.UI.Models;
using JustBlog.UI.Services;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
//using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Serialization;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Threading.Tasks;

namespace JustBlog.UI
{
    /// <summary>
    /// Configure http pipeline
    /// </summary>
    public class Startup
    {
        private const string ERROR_PATH = "/Home/Error";
        private const string DATABASE_APP_SETTINGS = "ConnectionStrings";
        private const string JUST_BLOG_CONNECTION_STRING = "JustBlogDbConnection";
        private const string SECRET_KEY_STRING = "SecretKey";
        private const string DOMAIN_KEY = "Domain";
        private const string JUST_BLOG_CORS_POLICY = "just_blog_cors";

        private readonly SymmetricSecurityKey _signingKey;

        public IConfiguration Configuration { get; }

        private IWebHostEnvironment Environment { get; }

        /// <summary>
        /// Configure the environment the app will run in
        /// </summary>
        /// <param name="env"></param>
        public Startup(IConfiguration configuration, IWebHostEnvironment environment)
        {
            Configuration = configuration;
            Environment = environment;

            string secretKey = Configuration.GetValue<string>(SECRET_KEY_STRING);
            _signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secretKey));
        }

        /// <summary>
        /// This method gets called by the runtime. Use this method to add services to the container.
        /// </summary>
        /// <param name="services"></param>
        public void ConfigureServices(IServiceCollection services)
        {
            // configure angularjs header name for xsrf tokens
            services.AddAntiforgery(options =>
            {
                options.HeaderName = "X-XRSF-TOKEN";
            });

            services.AddCors(options =>
            {
                options.AddPolicy(name: JUST_BLOG_CORS_POLICY,
                    builder =>
                    {
                        builder.WithOrigins("https://localhost:6005", "http://localhost:6005");
                        builder.AllowAnyHeader();
                        builder.AllowAnyMethod();
                        builder.AllowCredentials();
                        builder.WithExposedHeaders("x-filename");
                    });
            });

            services.AddApplicationInsightsTelemetry();

            // Asp.NET core switched default json serialization from pascal casing to camel casing,
            // the just blog angular app expects pascal casing so we have to switch this back
            services.AddMvc(options =>
            {
                // configure anti forgery tokens to be added in X-XSRF-Token areas
                options.Filters.AddService(typeof(AngularAntiforgeryCookieResultFilterAttribute));
            }).AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.ContractResolver = new DefaultContractResolver();
            });

            services.AddAntiforgery(opts => opts.HeaderName = "X-XSRF-Token");

            services.Configure<BlogOptions>(Configuration.GetSection("BlogSettings"));
            services.Configure<SocialMedia>(Configuration.GetSection("SocialMedia"));

            services.AddTransient<IJustBlogContext, JustBlogContext>();
            services.AddTransient<IPostService, PostService>();
            services.AddTransient<ICategoryService, CategoryService>();
            services.AddTransient<ITagService, TagService>();
            services.AddTransient<IAccountService, AccountService>();
            services.AddTransient<AngularAntiforgeryCookieResultFilterAttribute>();
            services.AddTransient<IMessagingService, MessagingService>();
            services.AddTransient<IJwtFactory, JwtFactory>();

            var connectionString = configureBlogServices();

            identityManagementServices(connectionString);

            authenticationServices();

            services.AddAuthorization(options =>
            {
                options.AddPolicy("ApiUser", policy => policy.RequireClaim(Constants.ROLE, Constants.API_ACCESS));
            });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
                {
                    Title = "JustBlog API",
                    Version = "v1"
                });
            });

            domainServices();

            // where all the files live we are trying to serve
            services.AddSpaStaticFiles(configuration=> {
                configuration.RootPath = "ClientApp/dist";
            });

            string configureBlogServices()
            {
                var blogConnectionString = Configuration.GetSection(DATABASE_APP_SETTINGS).GetValue<string>(JUST_BLOG_CONNECTION_STRING);

                blogConnectionString = "Filename =./justblog.sqlite";

                if (string.IsNullOrEmpty(blogConnectionString))
                {
                    // load connection string from environment variables
                    blogConnectionString = Configuration.GetValue<string>(JUST_BLOG_CONNECTION_STRING);
                }

                services.AddDbContext<JustBlogContext>(options =>
                {
                    options.UseSqlite(blogConnectionString);
                });

                services.AddDatabaseDeveloperPageExceptionFilter();


                return blogConnectionString;
            }

            void identityManagementServices(string dbConnectionString)
            {
                // identity management
                services.AddDbContext<IdentityDbContext>(options =>
                {
                    if (string.IsNullOrEmpty(dbConnectionString))
                    {
                        dbConnectionString = Configuration.GetValue<string>(JUST_BLOG_CONNECTION_STRING);
                    }
                    options.UseSqlite(dbConnectionString);
                });

                services.AddIdentity<ApplicationUser, IdentityRole>()
                    .AddEntityFrameworkStores<IdentityDbContext>()
                    .AddDefaultTokenProviders();
            }

            void authenticationServices()
            {
                // authentication
                var _jwtOptions = Configuration.GetSection(nameof(JwtIssuerOptions));

                services.Configure<JwtIssuerOptions>(options =>
                {
                    options.Issuer = _jwtOptions[nameof(JwtIssuerOptions.Issuer)];
                    options.Audience = _jwtOptions[nameof(JwtIssuerOptions.Audience)];
                    options.SigningCredentials = new SigningCredentials(_signingKey, SecurityAlgorithms.HmacSha256);
                });

                JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear(); // remove default claims
                services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = false;
                    options.SaveToken = true;

                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = _jwtOptions[nameof(JwtIssuerOptions.Issuer)],

                        ValidateAudience = true,
                        ValidAudience = _jwtOptions[nameof(JwtIssuerOptions.Audience)],

                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = _signingKey,

                        RequireExpirationTime = false,
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero
                    };
                });
            }

            void domainServices()
            {
                services.Configure<DomainOptions>(options =>
                {
                    options.BaseUrl = Configuration.GetValue<string>(DOMAIN_KEY);
                });
            }
        }

        /// <summary>
        /// Configure the HTTP request pipeline
        /// </summary>
        /// <param name="app"></param>
        /// <param name="env"></param>
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IAntiforgery antiforgery)
        {
            app.UseSpaStaticFiles();
            app.UseRouting();
            app.UseCors(JUST_BLOG_CORS_POLICY);

            app.UseAuthentication();
            // must be between routing and authorization
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
                    endpoints.MapRazorPages();

                endpoints.MapFallbackToFile("/index.html");
            });

            app.UseSwagger();
            app.UseSwaggerUI(p => p.SwaggerEndpoint("/swagger/v1/swagger.json", "JustBlog API V1"));

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseMigrationsEndPoint();

                //app.Use((context, next) =>
                //{
                //    var request = context.Request;
                //    var path = request.Path;
                //    if (path.HasValue && path.Value.Equals("/warmup", StringComparison.InvariantCultureIgnoreCase))
                //    {
                //        context.Response.Redirect("/swagger");
                //        return Task.CompletedTask;
                //    }
                //    return next();
                //});
            }
            else
            {
                app.UseDefaultFiles();
                app.UseStaticFiles();
                app.UseExceptionHandler(ERROR_PATH);
            }

            //app.UseHsts();
            app.UseHttpsRedirection();

            app.UseSpa(spa =>
            {
                // keep this to the souce path and not wwwroot where the build is output
                spa.Options.SourcePath = "ClientApp";

                // proxy to the webpack dev server. This will allow us to do hot module reloading
                //spa.UseProxyToSpaDevelopmentServer("https://localhost:8400/");

                //Console.WriteLine($"Environment: ${env.IsDevelopment()}")
                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });
        }
    }
}
