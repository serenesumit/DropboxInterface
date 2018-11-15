using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Dropbox.Api;
using DropboxInterface.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DropboxInterface.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DropboxController : Controller
    {
        string hostName = "", scheme = "", path = "", token = "";

        public IActionResult Index()
        {
            string test = HttpContext.Session.GetString(token);
            return View();
        }

        string AppKey = "lthbutbf1rtovyx";
        string AppSecret = "om3vwurqicmaopo";
        string RedirectUri = "https://localhost:44358/api/Dropbox/AuthAsync";

        [HttpGet("[action]")]
        public JsonResult GetDropboxLoginUrl()
        {
            string hostName = this.Request.Host.ToString();
            string scheme = this.Request.Scheme;
            string path = this.Request.Path;
            string Url = "";
            string rediirectUrl = "";
            if (hostName.Contains("localhost"))
            {
                rediirectUrl = string.Format("{0}://{1}/api/Dropbox/AuthAsync", scheme, hostName);
            }
            else
            {
                var builder = new UriBuilder(
             Uri.UriSchemeHttps,
             hostName);

                builder.Path = "/api/Dropbox/AuthAsync";
                rediirectUrl = builder.ToString();
            }



            Url = "https://www.dropbox.com/oauth2/authorize?client_id=lthbutbf1rtovyx&response_type=code&redirect_uri=" + rediirectUrl;
            return Json(Url);
        }


        [HttpGet("[action]")]
        public async Task<ActionResult> AuthAsync(string code, string state)
        {
            try
            {
                var response = await DropboxOAuth2Helper.ProcessCodeFlowAsync(
                    code,
                    AppKey,
                    AppSecret,
                    RedirectUri);
                string test = response.AccessToken;
                HttpContext.Session.SetString(token, response.AccessToken);
                return RedirectToAction("Index");
            }
            catch (Exception e)
            {

                return Json("");
            }
        }


        [HttpPost]
        public async Task<HttpResponseMessage> SaveFile([FromBody] DropboxModel model)
        {

            HttpResponseMessage result = null;
            

            return result;

        }

    }
}