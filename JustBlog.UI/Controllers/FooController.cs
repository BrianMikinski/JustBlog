using Microsoft.AspNetCore.Mvc;

namespace JustBlog.UI.Controllers
{
    [Route("api/[controller]/[action]")]
    public class FooController : Controller
    {
        public string Index()
        {
            return "I am a gummy bear.";
        }
    }
}
