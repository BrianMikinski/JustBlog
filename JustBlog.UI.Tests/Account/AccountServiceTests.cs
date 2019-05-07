using JustBlog.IdentityManagement;
using JustBlog.IdentityManagement.Account;
using JustBlog.IdentityManagement.Login;
using JustBlog.IdentityManagement.ManageViewModels;
using JustBlog.IdentityManagement.Register;
using JustBlog.IdentityManagement.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;

namespace JustBlog.UI.Tests
{
    [TestClass]
    [TestCategory(TestCategories.UNIT_TEST)]
    public class AccountServiceTests
    {
        private Mock<UserManager<ApplicationUser>> _userManager;
        private Mock<SignInManager<ApplicationUser>> _signInManager;
        private IAccountService _accountService;
        private RegisterViewModel newRegistrationUser;
        private ApplicationUser newApplicationUser;
        private ClaimsPrincipal myClaimsPrincipal;

        [TestInitialize]
        public void Init()
        {
            _userManager = new Mock<UserManager<ApplicationUser>>(
                Mock.Of<IUserStore<ApplicationUser>>(), null, null, null, null, null, null, null, null);

            _signInManager = new Mock<SignInManager<ApplicationUser>>(_userManager.Object,
                Mock.Of<IHttpContextAccessor>(),
                Mock.Of<IUserClaimsPrincipalFactory<ApplicationUser>>(), null, null, null);

            Mock<IMessagingService> _emailSender = new Mock<IMessagingService>();

            Mock<ILogger<IAccountService>> _logger = new Mock<ILogger<IAccountService>>();

            _accountService = new AccountService(_userManager.Object, _signInManager.Object, _emailSender.Object, _logger.Object);

            newRegistrationUser = new RegisterViewModel()
            {
                ConfirmPassword = "thisIsABadPassword123$",
                Email = "john.doe@gmail.com",
                Password = "thisIsABadPassword123$"
            };

            newApplicationUser = new ApplicationUser()
            {
                Id = Guid.NewGuid().ToString()
            };

            GenericIdentity myIdentity = new GenericIdentity("userToRemove");
            string[] myRoles = { "user" };

            GenericPrincipal myPrincipal = new GenericPrincipal(myIdentity, myRoles);
            myClaimsPrincipal = new ClaimsPrincipal(myPrincipal);
        }

        [TestMethod]
        public async Task Delete_Login_From_Principal_Success()
        {
            // arrange
            _userManager = SetupUserAsyncMock(_userManager);

            _userManager.Setup(p => p.DeleteAsync(It.IsAny<ApplicationUser>()))
                .ReturnsAsync(IdentityResult.Success);

            _signInManager.Setup(p => p.SignOutAsync())
                .Returns(Task.CompletedTask);

            // act
            await _accountService.DeleteUserAsync(myClaimsPrincipal);

            _userManager.Verify(p => p.GetUserAsync(It.IsAny<ClaimsPrincipal>()), Times.Once());
            _userManager.Verify(p => p.DeleteAsync(It.IsAny<ApplicationUser>()), Times.Once());
        }

        [TestMethod]
        public async Task Delete_Login_From_Application_User_Success()
        {
            _userManager.Setup(p => p.DeleteAsync(It.IsAny<ApplicationUser>()))
                .ReturnsAsync(IdentityResult.Success);

            // act
            await _accountService.DeleteUserAsync(newApplicationUser);

            _userManager.Verify(p => p.DeleteAsync(It.IsAny<ApplicationUser>()), Times.Once());
        }

        [TestMethod]
        public async Task Login_User_Success()
        {
            // arrange
            _signInManager.Setup(p => p.PasswordSignInAsync(It.IsAny<string>(), It.IsAny<String>(), It.IsAny<bool>(), It.IsAny<bool>()))
                .ReturnsAsync( SignInResult.Success);

            var loginModel = new LoginViewModel()
            {
                Email = "joe.smith@joesmith.com",
                Password = "password",
                RememberMe = false
            };

            // act
            var result = await _accountService.Login(loginModel);

            // assert
            Assert.IsTrue(result.Succeeded);
        }

        [TestMethod]
        [ExpectedException(typeof(ApplicationException))]
        public async Task Login_User_Failure()
        {
            // arrange
            _signInManager.Setup(p => p.PasswordSignInAsync(It.IsAny<string>(), It.IsAny<String>(), It.IsAny<bool>(), It.IsAny<bool>()))
                .ReturnsAsync(SignInResult.Failed);

            var loginModel = new LoginViewModel()
            {
                Email = "joe.smith@joesmith.com",
                Password = "password",
                RememberMe = false
            };

            // act
            var result = await _accountService.Login(loginModel);

            // assert
            Assert.IsTrue(result.Succeeded);
        }

        [TestMethod]
        public async Task Register_New_User_Success()
        {
            // arrange
            _userManager.Setup(x => x.CreateAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>()))
                .ReturnsAsync(IdentityResult.Success);

            _signInManager.Setup(x => x.SignInAsync(It.IsAny<ApplicationUser>(), false, It.IsAny<string>()))
                .Returns(Task.CompletedTask);

            string requestSchema = "http";

            // act
            var registration = await _accountService.Register(newRegistrationUser, requestSchema);

            // assert
            Assert.IsTrue(registration.Succeeded);
            Assert.AreEqual(0, registration.Errors.Count());

            _userManager.Verify(p => p.CreateAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>()), Times.Once());
        }

        [TestMethod]
        public async Task Register_New_User_Create_Account_Errors()
        {
            // arrange
            _userManager.Setup(x => x.CreateAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>()))
                        .ReturnsAsync(() =>
                        {
                            var createAccountErrors = new IdentityError[]
                            {
                                new IdentityError()
                                {
                                    Code = "Email missing",
                                    Description = "You must include an email address"
                                },
                                new IdentityError()
                                {
                                    Code = "Passwords",
                                    Description = "Passwords do not match"
                                }
                            };

                            return IdentityResult.Failed(createAccountErrors);
                        });

            string requestSchema = "http";

            // act
            var registration = await _accountService.Register(newRegistrationUser, requestSchema);

            // assert
            Assert.IsFalse(registration.Succeeded);
            Assert.AreEqual(2, registration.Errors.Count());

            _userManager.Verify(x => x.CreateAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>()), Times.Once());
        }

        [TestMethod]
        public async Task Remove_Login_Success()
        {
            // arrange
            var loginToRemove = new RemoveLoginViewModel()
            {
                LoginProvider = string.Empty,
                ProviderKey = string.Empty
            };

            _userManager = SetupUserAsyncMock(_userManager);

            _userManager.Setup(p => p.RemoveLoginAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>(), It.IsAny<string>()))
                .ReturnsAsync(IdentityResult.Success);

            _signInManager.Setup(p => p.SignOutAsync())
                .Returns(Task.CompletedTask);

            // act
            await _accountService.RemoveLogin(loginToRemove, myClaimsPrincipal);

            _userManager.Verify(p => p.GetUserAsync(It.IsAny<ClaimsPrincipal>()), Times.Once());
            _userManager.Verify(p => p.RemoveLoginAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>(), It.IsAny<string>()), Times.Once());
        }

        [TestMethod]
        [ExpectedException(typeof(ApplicationException))]
        public async Task Remove_Login_No_User_Found()
        {
            var loginToRemove = new RemoveLoginViewModel()
            {
                LoginProvider = string.Empty,
                ProviderKey = string.Empty
            };

            _userManager.Setup(p => p.GetUserAsync(It.IsAny<ClaimsPrincipal>()))
                .ReturnsAsync(() =>
                {
                    return null;
                });

            // act
            await _accountService.RemoveLogin(loginToRemove, myClaimsPrincipal);
        }

        [TestMethod]
        [ExpectedException(typeof(ApplicationException))]
        public async Task Remove_Login_Remove_Failed()
        {
            // arrange
            var loginToRemove = new RemoveLoginViewModel()
            {
                LoginProvider = string.Empty,
                ProviderKey = string.Empty
            };

            _userManager = SetupUserAsyncMock(_userManager);

            _userManager.Setup(p => p.RemoveLoginAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>(), It.IsAny<string>()))
                .ReturnsAsync(IdentityResult.Failed());

            _signInManager.Setup(p => p.SignOutAsync())
                .Returns(Task.CompletedTask);

            // act
            await _accountService.RemoveLogin(loginToRemove, myClaimsPrincipal);
        }

        [TestMethod]
        [Ignore("Probably not going to use in memory db provider to test this.")]
        public void Register_New_User_InMemory()
        {
            var options = new DbContextOptionsBuilder<IdentityDbContext>()
                                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                                .EnableSensitiveDataLogging(true)
                                .Options;

            IdentityDbContext _identityDbContext = new IdentityDbContext(options);

            SignInManager<ApplicationUser> signInManager = new SignInManager<ApplicationUser>(null, null, null, null, null, null);
            IMessagingService emailSender;
            ILogger<IAccountService> logger;
            IAccountService accountService;

            string requestSchema = "OAuth";

            // act
            _accountService.Register(newRegistrationUser, requestSchema);
        }

        /// <summary>
        /// Configure a successful mock of the GetUserAsync mock
        /// </summary>
        /// <param name="userManagerMock"></param>
        /// <returns></returns>
        private Mock<UserManager<ApplicationUser>> SetupUserAsyncMock(Mock<UserManager<ApplicationUser>> userManagerMock)
        {
            userManagerMock.Setup(p => p.GetUserAsync(It.IsAny<ClaimsPrincipal>()))
                .ReturnsAsync(newApplicationUser);

            return userManagerMock;
        }
    }
}
