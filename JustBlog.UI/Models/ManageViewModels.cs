//using Microsoft.AspNet.Identity;
//using Microsoft.AspNetCore.Mvc.Rendering;
//using Microsoft.Owin.Security;
//using System.Collections.Generic;

//namespace JustBlog.UI.Models
//{
//    public class ConfigureTwoFactorViewModel
//    {
//        public ICollection<SelectListItem> Providers { get; set; }

//        public string SelectedProvider { get; set; }
//    }

//    public class IndexViewModel
//    {
//        public bool BrowserRemembered { get; set; }
//        public bool HasPassword { get; set; }
//        public IList<UserLoginInfo> Logins { get; set; }
//        public string PhoneNumber { get; set; }
//        public bool TwoFactor { get; set; }
//    }

//    public class ManageLoginsViewModel
//    {
//        public IList<UserLoginInfo> CurrentLogins { get; set; }
//        public IList<AuthenticationDescription> OtherLogins { get; set; }
//    }
//}