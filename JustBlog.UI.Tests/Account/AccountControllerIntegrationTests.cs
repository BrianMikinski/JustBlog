using JustBlog.IdentityManagement.Account;
using JustBlog.IdentityManagement.Login;
using JustBlog.IdentityManagement.Register;
using JustBlog.IdentityManagement.Services;
using JustBlog.UI.Controllers;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.TestHost;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Concurrent;
using System.Linq;
using System.Threading.Tasks;

namespace JustBlog.UI.Tests
{
    [TestClass]
    [TestCategory(TestCategories.INTEGRATION)]
    public class AccountControllerIntegrationTests : IDisposable
    {
        private readonly ConcurrentQueue<HttpContext> _httpContexts = new ConcurrentQueue<HttpContext>();
        private readonly TestServer _testServer;
        private TestServerBrowser _browser;
        private IAccountService _accountService;
        private SignInManager<ApplicationUser> _signInManager;
        private UserManager<ApplicationUser> _userManager;

        private RegisterViewModel newRegistrationUser;
        private ApplicationUser currentApplicationUser;

        private readonly string loginUrl = $"Authentication/{nameof(AuthenticationController.Login)}";

        public AccountControllerIntegrationTests()
        {
            // This middleware stores all HTTP contexts created by the test server to be inspected by our tests.
            Action<IApplicationBuilder> captureHttpContext = builder => builder.Use(async (httpContext, requestHandler) =>
            {
                await requestHandler.Invoke();
                _httpContexts.Enqueue(httpContext);
            });

            var webHostBuilder = WebHostBuilderFactory.Create(new[]
             {
              captureHttpContext
            });

            _testServer = new TestServer(webHostBuilder);
        }

        /// <summary>
        /// Create the base test server that can be used to recieve requests
        /// </summary>
        [ClassInitialize]
        public static void ClassInitialize(TestContext context)
        {
            WebHostBuilderFactory.EnsureDatabaseAvailable();
        }

        /// <summary>
        /// Clean up databases after tests have been run
        /// </summary>
        [ClassCleanup]
        public static void TestCleanup()
        {
            WebHostBuilderFactory.CleanUpDatabases();
        }

        [TestInitialize]
        public async Task TestInitialize()
        {
            _browser = new TestServerBrowser(_testServer);
            _accountService = _browser.GetConfiguredService<IAccountService>();
            _signInManager = _browser.GetConfiguredService<SignInManager<ApplicationUser>>();
            _userManager = _browser.GetConfiguredService<UserManager<ApplicationUser>>();

            newRegistrationUser = new RegisterViewModel()
            {
                ConfirmPassword = "thisIsABadPassword123$",
                Email = "john.doe@gmail.com",
                Password = "thisIsABadPassword123$"
            };

            currentApplicationUser = new ApplicationUser()
            {
                Id = Guid.NewGuid().ToString(),
                Email = newRegistrationUser.Email,
                UserName = newRegistrationUser.Email,
                SecurityStamp = Guid.NewGuid().ToString() // required otherwise you get a null reference error
            };

            _browser.GenerateAntiForgeryTokenForBrowser();

            await UserCreationTestCleanup(newRegistrationUser.Email, "TestInit", nameof(AccountController));
        }

        [TestMethod]
        public async Task NewUserRegistration()
        {
            // arrange
            var registerUserURL = $"Account/{nameof(AccountController.Register)}";

            var formValues = _browser.SerializeObjectForPost(newRegistrationUser);

            // act
            var response = _browser.Post(registerUserURL, formValues);

            // assert
            var registrationAttempt = _browser.DeserializeViewModel<RegistrationAttempt>(await response.Content.ReadAsStringAsync());

            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.IsTrue(registrationAttempt.Succeeded);
            Assert.AreEqual(0, registrationAttempt.Errors.Count());

            var createdUser = _userManager.FindByEmailAsync(newRegistrationUser.Email);
            Assert.IsNotNull(createdUser);

            // cleanup

            await UserCreationTestCleanup(currentApplicationUser.Email,
            nameof(AccountControllerIntegrationTests.NewUserRegistration),
                    nameof(AccountController));
        }

        [TestMethod]
        [Ignore("Ignore for build")]
        public async Task LoginNew_User()
        {
            // arrange
            var login = new LoginViewModel()
            {
                Email = newRegistrationUser.Email,
                Password = newRegistrationUser.Password,
                RememberMe = false
            };

            await CreateUserSetup(newRegistrationUser);

            var formValues = _browser.SerializeObjectForPost(login);

            // act
            var response = _browser.Post(loginUrl, formValues);

            Assert.IsTrue(response.IsSuccessStatusCode);

            // cleanup
            await UserCreationTestCleanup(currentApplicationUser.Email,
                    nameof(AccountControllerIntegrationTests.LoginNew_User),
                    nameof(AccountController));
        }

        [TestMethod]
        public async Task LoginUser_Failure()
        {
            // arrange

            var login = new LoginViewModel()
            {
                Email = newRegistrationUser.Email,
                Password = "",
                RememberMe = false
            };

            await CreateUserSetup(newRegistrationUser);

            var formValues = _browser.SerializeObjectForPost(login);

            // act
            var response = _browser.Post(loginUrl, formValues);

            Assert.IsTrue(response.IsSuccessStatusCode);

            // cleanup
            await UserCreationTestCleanup(currentApplicationUser.Email,
                    nameof(AccountControllerIntegrationTests.LoginUser_Failure),
                    nameof(AccountController));
        }

        /// <summary>
        /// Create a user to be used for integration tests
        /// </summary>
        /// <param name="unitTest"></param>
        /// <returns></returns>
        private async Task CreateUserSetup(RegisterViewModel user)
        {
            // arrange
            var registerUserURL = $"Account/{nameof(AccountController.Register)}";

            var formValues = _browser.SerializeObjectForPost(user);

            // act
            var response = _browser.Post(registerUserURL, formValues);

            // assert
            Assert.IsTrue(response.IsSuccessStatusCode);

            var createdUser = await _userManager.FindByEmailAsync(user.Email);
            Assert.IsNotNull(createdUser);

            // we must regenerate the anti forgery token for the browser
            _browser.GenerateAntiForgeryTokenForBrowser();
        }

        /// <summary>
        /// Delete a user created for integration tests
        /// </summary>
        /// <param name="emailAddress"></param>
        /// <param name="unitTest"></param>
        /// <returns></returns>
        private async Task UserCreationTestCleanup(string emailAddress, string unitTest, string controller)
        {
            var currentUser = await _userManager.FindByEmailAsync(emailAddress);

            if (currentUser != null)
            {
                await _accountService.DeleteUserAsync(currentUser);
                currentUser = await _userManager.FindByEmailAsync(currentApplicationUser.Email);

                if (currentUser != null)
                {
                    throw new ApplicationException($"User {currentUser.Email} could not deleted for unit test \"{unitTest}\" of controller \"{controller}\"");
                }
            }
        }

        public void Dispose()
        {
            _testServer.Dispose();
        }
    }
}
