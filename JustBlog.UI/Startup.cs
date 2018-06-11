using JustBlog.Domain.Services;
using JustBlog.IdentityManagement;
using JustBlog.IdentityManagement.Account;
using JustBlog.IdentityManagement.Login;
using JustBlog.IdentityManagement.Services;
using JustBlog.Models;
using JustBlog.UI.Filters;
using JustBlog.UI.Models;
using JustBlog.UI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Serialization;
using Swashbuckle.AspNetCore.Swagger;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

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

        private readonly SymmetricSecurityKey _signingKey ;

        public IConfiguration Configuration { get; }

        public IHostingEnvironment Environment { get; }

        /// <summary>
        /// Configure the environment the app will run in
        /// </summary>
        /// <param name="env"></param>
        public Startup(IConfiguration configuration, IHostingEnvironment environment)
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
            // Asp.NET core switched default json serialization from pascal casing to camel casing,
            // the just blog angular app expects pascal casing so we have to switch this back
            services.AddMvc(options =>
            {
                // configure anti forgery tokens to be added in X-XSRF-Token areas
                options.Filters.AddService(typeof(AngularAntiforgeryCookieResultFilterAttribute));
            })
            .AddJsonOptions(options => options.SerializerSettings.ContractResolver = new DefaultContractResolver());

            services.AddAntiforgery(opts => opts.HeaderName = "X-XSRF-Token");

            services.Configure<BlogOptions>(Configuration.GetSection("BlogSettings"));
            services.Configure<SocialMedia>(Configuration.GetSection("SocialMedia"));

            services.AddTransient<IJustBlogContext, JustBlogContext>();
            services.AddTransient<IPostService, PostService>();
            services.AddTransient<ICategoryService, CategoryService>();
            services.AddTransient<ITagService, TagService>();
            services.AddTransient<IAccountService, AccountService>();
            services.AddTransient<AngularAntiforgeryCookieResultFilterAttribute>();
            services.AddTransient<IEmailSender, EmailSender>();
            services.AddTransient<IJwtFactory, JwtFactory>();

            var blogConnectionString = Configuration.GetSection(DATABASE_APP_SETTINGS).GetValue<string>(JUST_BLOG_CONNECTION_STRING);

            if (string.IsNullOrEmpty(blogConnectionString))
            {
                // load connection string from environment variables
                blogConnectionString = Configuration.GetValue<string>(JUST_BLOG_CONNECTION_STRING);
            }

            blogConnectionString = "Filename=./justblog.sqlite";

            services.AddDbContext<JustBlogContext>(options =>
            {
                options.UseSqlite(blogConnectionString);
            });

            // identity management
            services.AddDbContext<AppIdentityDbContext>(options =>
            {
                if (string.IsNullOrEmpty(blogConnectionString))
                {
                    blogConnectionString = Configuration.GetValue<string>(JUST_BLOG_CONNECTION_STRING);
                }
                options.UseSqlite(blogConnectionString);
            });

            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<AppIdentityDbContext>()
                .AddDefaultTokenProviders();

            // authentication
            var jwtAppSettingOptions = Configuration.GetSection(nameof(JwtIssuerOptions));

            services.Configure<JwtIssuerOptions>(options =>
            {
                options.Issuer = jwtAppSettingOptions[nameof(JwtIssuerOptions.Issuer)];
                options.Audience = jwtAppSettingOptions[nameof(JwtIssuerOptions.Audience)];
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
                    ValidIssuer = jwtAppSettingOptions[nameof(JwtIssuerOptions.Issuer)],

                    ValidateAudience = true,
                    ValidAudience = jwtAppSettingOptions[nameof(JwtIssuerOptions.Audience)],

                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = _signingKey,

                    RequireExpirationTime = false,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
            });

            services.AddAuthorization(options =>
            {
                options.AddPolicy("ApiUser", policy => policy.RequireClaim(Constants.ROLE, Constants.API_ACCESS));
            });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info { Title = "JustBlog API", Version = "v1" });
            });
        }

        /// <summary>
        /// Configure the HTTP request pipeline
        /// </summary>
        /// <param name="app"></param>
        /// <param name="env"></param>
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseBrowserLink();
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
            }
            else
            {
                app.UseExceptionHandler(ERROR_PATH);
            }

            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseAuthentication();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });

            app.UseSwagger();
            app.UseSwaggerUI(p => p.SwaggerEndpoint("/swagger/v1/swagger.json", "JustBlog API V1"));
        }
    }
}
