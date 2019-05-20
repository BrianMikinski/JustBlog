using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JustBlog.UI.Controllers
{
    /// <summary>
    /// Test class for testing front end api errors
    /// </summary>
    [AllowAnonymous]
    [Route("api/[controller]/[action]")]
    public class ErrorController : Controller
    {
        /// <summary>
        /// 400 - Bad request error
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IActionResult BadRequestTest()
        {
            return BadRequest();
        }

        /// <summary>
        /// 401 - Unauthorized
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IActionResult UnauthorizedTest()
        {
            return Unauthorized();
        }

        /// <summary>
        /// 404 - Not found
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IActionResult NotfoundTest()
        {
            return NotFound();
        }

        /// <summary>
        /// 500 - Server Error
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IActionResult InternalServerErrorTest()
        {
            return StatusCode(StatusCodes.Status500InternalServerError);
        }

    }
}
