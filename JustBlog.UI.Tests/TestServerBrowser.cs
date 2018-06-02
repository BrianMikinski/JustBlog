using JustBlog.UI.Controllers;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;

namespace JustBlog.UI.Tests
{
    /// <summary>
    /// Many different sites used to create this test server class
    /// </summary>
    /// <typeparam name="TStartup"></typeparam>
    public class TestServerBrowser
    {
        private readonly TestServer _server;
        private JsonSerializerSettings serializerSettings = new JsonSerializerSettings();

        // Modify to match your XSRF token requirements.
        private const string XsrfCookieName = "XSRF-TOKEN";
        private const string XsrfHeaderName = "X-XSRF-TOKEN";

        protected CookieContainer Cookies { get; private set; }

        /// <summary>
        /// Used to return services configured by the server to cleanup integration tests
        /// </summary>
        /// <typeparam name="TService"></typeparam>
        /// <param name="type"></param>
        /// <returns></returns>
        public TService GetConfiguredService<TService>() where TService : class
        {
            return (TService)_server.Host.Services.GetService(typeof(TService));
        }

        /// <summary>
        /// Deserialize content returned from the server
        /// </summary>
        /// <typeparam name="TViewModel"></typeparam>
        /// <param name="content"></param>
        /// <returns></returns>
        public TViewModel DeserializeViewModel<TViewModel>(string content) where TViewModel : class
        {
            return JsonConvert.DeserializeObject<TViewModel>(content, serializerSettings);
        }

        /// <summary>
        /// Serialize content for a server post method
        /// </summary>
        /// <param name="content"></param>
        /// <returns></returns>
        public Dictionary<string, string> SerializeObjectForPost(object content)
        {
            var newUserContent = JsonConvert.SerializeObject(content);
            return JsonConvert.DeserializeObject<Dictionary<string, string>>(newUserContent);
        }

        /// <summary>
        /// Regenerate an anti forgery token for the designated browser. This must be run after the browser
        /// has been configured
        /// </summary>
        public void GenerateAntiForgeryTokenForBrowser()
        {
            // must run before all calls to add anti-forgery token to the header
            var antiforgeryUrl = $"Account/{nameof(AccountController.AntiForgeryToken)}";
            Get(antiforgeryUrl);
        }

        public TestServerBrowser(TestServer testServer)
        {
            _server = testServer;

            Cookies = new CookieContainer();
            serializerSettings.ContractResolver = new DefaultContractResolver();
        }

        public HttpResponseMessage Get(string relativeUrl)
        {
            return Get(new Uri(relativeUrl, UriKind.Relative));
        }

        public HttpResponseMessage Get(Uri relativeUrl)
        {
            var absoluteUrl = new Uri(_server.BaseAddress, relativeUrl);
            var requestBuilder = _server.CreateRequest(absoluteUrl.ToString());

            AddCookies(requestBuilder, absoluteUrl);

            var response = requestBuilder.GetAsync().Result;
            UpdateCookies(response, absoluteUrl);

            return response;
        }

        private void AddCookies(RequestBuilder requestBuilder, Uri absoluteUrl)
        {
            var cookieHeader = Cookies.GetCookieHeader(absoluteUrl);
            if (!string.IsNullOrWhiteSpace(cookieHeader))
            {
                requestBuilder.AddHeader(HeaderNames.Cookie, cookieHeader);
            }
        }

        private void UpdateCookies(HttpResponseMessage response, Uri absoluteUrl)
        {
            if (response.Headers.Contains(HeaderNames.SetCookie))
            {
                var cookies = response.Headers.GetValues(HeaderNames.SetCookie);
                foreach (var cookie in cookies)
                {
                    Cookies.SetCookies(absoluteUrl, cookie);
                }
            }
        }

        public HttpResponseMessage Post(string relativeUrl, IDictionary<string, string> formValues)
        {
            return Post(new Uri(relativeUrl, UriKind.Relative), formValues);
        }

        public HttpResponseMessage Post(Uri relativeUrl, IDictionary<string, string> formValues)
        {
            var absoluteUrl = new Uri(_server.BaseAddress, relativeUrl);
            var requestBuilder = _server.CreateRequest(absoluteUrl.ToString());

            AddCookies(requestBuilder, absoluteUrl);
            SetXsrfHeader(requestBuilder, absoluteUrl);

            var content = new FormUrlEncodedContent(formValues);
            var response = requestBuilder.And(message =>
            {
                message.Content = content;
            }).PostAsync().Result;

            UpdateCookies(response, absoluteUrl);

            return response;
        }

        /// <summary>
        /// Modify to match your XSRF token requirements, e.g. "SetXsrfFormField".
        /// </summary>
        /// <param name="requestBuilder"></param>
        /// <param name="absoluteUrl"></param>
        private void SetXsrfHeader(RequestBuilder requestBuilder, Uri absoluteUrl)
        {
            var cookies = Cookies.GetCookies(absoluteUrl);
            var cookie = cookies[XsrfCookieName];

            if (cookie != null)
            {
                requestBuilder.AddHeader(XsrfHeaderName, cookie.Value);
            }
        }

        protected HttpResponseMessage FollowRedirect(HttpResponseMessage response)
        {
            if (response.StatusCode != HttpStatusCode.Moved && response.StatusCode != HttpStatusCode.Found)
            {
                return response;
            }

            var redirectUrl = new Uri(response.Headers.Location.ToString(), UriKind.RelativeOrAbsolute);
            if (redirectUrl.IsAbsoluteUri)
            {
                redirectUrl = new Uri(redirectUrl.PathAndQuery, UriKind.Relative);
            }

            return Get(redirectUrl);
        }

        public void Dispose()
        {
            _server.Dispose();
        }
    }
}
