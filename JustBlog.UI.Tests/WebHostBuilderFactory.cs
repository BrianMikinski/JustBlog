using JustBlog.IdentityManagement;
using JustBlog.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;

namespace JustBlog.UI.Tests
{
    /// <summary>
    /// Adapted from Uli Weltersbach at https://reasoncodeexample.com/2016/08/29/how-to-keep-things-tidy-when-using-asp-net-core-testserver/
    /// </summary>
    public static class WebHostBuilderFactory
    {
        private const string SQLITE_DB_LOCATION = "Filename=./justblog.sqlite";

        /// <summary>
        /// Create the proper db contexts for ensuring creationg and deletion of databases
        /// </summary>
        /// <returns></returns>
        private static (JustBlogContext justBlogContext, AppIdentityDbContext appIdentityContext) JustBlogDbContextForIntegrationTesting()
        {
            var justBlogOptionsBuilder = new DbContextOptionsBuilder<JustBlogContext>();
            justBlogOptionsBuilder.UseSqlite(SQLITE_DB_LOCATION);

            var appIdentityBuilder = new DbContextOptionsBuilder<AppIdentityDbContext>();
            appIdentityBuilder.UseSqlite(SQLITE_DB_LOCATION);

            return (new JustBlogContext(justBlogOptionsBuilder.Options), new AppIdentityDbContext(appIdentityBuilder.Options));
        }

        /// <summary>
        /// Ensure the database has been created
        /// </summary>
        public static void EnsureDatabaseAvailable()
        {
            (var justBlogDbContext, var appIdentityDbContext) = JustBlogDbContextForIntegrationTesting();

            justBlogDbContext.Database.EnsureCreated();
            appIdentityDbContext.Database.Migrate();
        }

        /// <summary>
        /// Ensure database has been deleted once we reset the tests
        /// </summary>
        public static void CleanUpDatabases()
        {
            (var justBlogDbContext, var appIdentityDbContext) = JustBlogDbContextForIntegrationTesting();

            justBlogDbContext.Database.EnsureDeleted();
        }

        public static IWebHostBuilder Create()
        {
            return Create(Enumerable.Empty<Action<IServiceCollection>>());
        }

        public static IWebHostBuilder Create(IEnumerable<Action<IServiceCollection>> configureServices)
        {
            var configureApplication = Enumerable.Empty<Action<IApplicationBuilder>>();
            return Create(configureServices, configureApplication);
        }

        public static IWebHostBuilder Create(IEnumerable<Action<IApplicationBuilder>> configureApplication)
        {
            var configureServices = Enumerable.Empty<Action<IServiceCollection>>();
            return Create(configureServices, configureApplication);
        }

        public static IWebHostBuilder Create(IEnumerable<Action<IServiceCollection>> configureServices,  IEnumerable<Action<IApplicationBuilder>> configureApplication)
        {
            // We can't use ".UseStartup<T>" as we want to be able to affect "MyStartup.Configure(IApplicationBuilder)".
            Startup app = null;
            var contentRoot = GetContentRoot();
            var webHostBuilder = new WebHostBuilder()
              .UseContentRoot(contentRoot.FullName)
              .UseEnvironment(EnvironmentName.Development)
              .ConfigureAppConfiguration((hostingContext, config) =>
              {
                  config.AddEnvironmentVariables();
              })
              .ConfigureServices(services =>
              {
                  var hostingEnvironment = GetHostingEnvironment(services);
                  var configuration = GetHostingConfiguration(services);

                  app = new Startup(configuration, hostingEnvironment);
                  ConfigureServices(app, services, configureServices);

                  services.AddDbContext<JustBlogContext>(options =>
                  {
                      options.UseSqlite(SQLITE_DB_LOCATION);
                  });
              })
              .Configure(builder =>
              {
                  ConfigureApplication(app, builder, configureApplication);
              });

            return webHostBuilder;
        }

        /// <summary>
        /// Locate the root directory of startup
        /// </summary>
        /// <returns></returns>
        private static DirectoryInfo GetContentRoot()
        {
            // Change to match your directory layout.
            const string relativeContentRootPath = @"..\..\..\..\JustBlog.UI\";
            var contentRoot = new DirectoryInfo(Path.Combine(Directory.GetCurrentDirectory(), relativeContentRootPath));

            if (!contentRoot.Exists)
            {
                throw new DirectoryNotFoundException($"Directory '{contentRoot.FullName}' not found.");
            }

            return contentRoot;
        }

        private static void ConfigureServices(Startup app, IServiceCollection services, IEnumerable<Action<IServiceCollection>> configureServices)
        {
            app.ConfigureServices(services);
            foreach (var serviceConfiguration in configureServices)
            {
                serviceConfiguration(services);
            }
        }

        /// <summary>
        /// Retrieve the hosting environment from your startup
        /// </summary>
        /// <param name="services"></param>
        /// <returns></returns>
        private static IHostingEnvironment GetHostingEnvironment(IServiceCollection services)
        {
            bool isHostingEnvironmet(ServiceDescriptor service) => service.ImplementationInstance is IHostingEnvironment;

            var hostingEnvironment = (IHostingEnvironment)services.First(isHostingEnvironmet).ImplementationInstance;
            var assembly = typeof(Startup).GetTypeInfo().Assembly;

            // This can be skipped if you keep your tests and production code in the same assembly.
            hostingEnvironment.ApplicationName = assembly.GetName().Name;
            return hostingEnvironment;
        }

        private static IConfiguration GetHostingConfiguration(IServiceCollection services)
        {
            bool isHostingEnvironmet(ServiceDescriptor service) => service.ImplementationInstance is IConfiguration;
            var hostingEnvironment = (IConfiguration)services.First(isHostingEnvironmet).ImplementationInstance;
           
            return hostingEnvironment;
        }

        private static void ConfigureApplication(Startup app, IApplicationBuilder builder, IEnumerable<Action<IApplicationBuilder>> configureApplication)
        {
            foreach (var applicationConfiguration in configureApplication)
            {
                applicationConfiguration(builder);
            }

            app.Configure(builder, app.Environment);
        }
    }
}