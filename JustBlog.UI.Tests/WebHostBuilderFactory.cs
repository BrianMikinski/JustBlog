using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
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
              .ConfigureServices(services =>
              {
                  var hostingEnvironment = GetHostingEnvironment(services);
                  var configuration = GetHostingConfiguration(services);

                  app = new Startup(configuration, hostingEnvironment);
                  ConfigureServices(app, services, configureServices);
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
            Func<ServiceDescriptor, bool> isHostingEnvironmet = service => service.ImplementationInstance is IHostingEnvironment;
            var hostingEnvironment = (IHostingEnvironment)services.Single(isHostingEnvironmet).ImplementationInstance;
            var assembly = typeof(Startup).GetTypeInfo().Assembly;

            // This can be skipped if you keep your tests and production code in the same assembly.
            hostingEnvironment.ApplicationName = assembly.GetName().Name;
            return hostingEnvironment;
        }

        private static IConfiguration GetHostingConfiguration(IServiceCollection services)
        {
            Func<ServiceDescriptor, bool> isHostingEnvironmet = service => service.ImplementationInstance is IConfiguration;
            var hostingEnvironment = (IConfiguration)services.Single(isHostingEnvironmet).ImplementationInstance;
           
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