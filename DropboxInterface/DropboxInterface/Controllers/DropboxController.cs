using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Dropbox.Api;
using Dropbox.Api.Files;
using DropboxInterface.Helpers;
using DropboxInterface.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DropboxInterface.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DropboxController : Controller
    {
        string hostName = "", scheme = "", path = "", AccessToken = "AccessToken";

        #region Variables  
        private DropboxClient DBClient;

        #endregion

        private  IOptions<DropboxConfig> _config;

        public DropboxController(IOptions<DropboxConfig> config)
        {
            this._config = config;
        }
        

        [HttpGet("[action]")]
        public JsonResult CheckSession()
        {
            return Json(HttpContext.Session.GetString(AccessToken));
        }

        [HttpPost("[action]")]
        public async Task<JsonResult> GetDropboxFolders()
        {
            string token = HttpContext.Session.GetString(AccessToken);

            string path = Request.Form["Path"].ToString();

            if (string.IsNullOrEmpty(path))
            {
                path = "";
            }

            DropboxFolderModel dropboxModel = new DropboxFolderModel();

            using (DropboxClient DBClient = new DropboxClient(token))
            {
                var list = await DBClient.Files.ListFolderAsync(path, false);

                foreach (var item in list.Entries)
                {
                    if (item.IsFolder)
                    {
                        dropboxModel.FolderPaths.Add(item.PathLower);
                    }

                }
            }


            return Json(dropboxModel);
        }

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
            string AppKey = _config.Value.AppKey;
            string AppSecret = _config.Value.AppSecret;
            string RedirectUri = _config.Value.Redirect_Url;

            try
            {
                var response = await DropboxOAuth2Helper.ProcessCodeFlowAsync(
                    code,
                    AppKey,
                    AppSecret,
                    RedirectUri);

                HttpContext.Session.SetString(AccessToken, response.AccessToken);
                return RedirectPermanent("/");
            }
            catch (Exception e)
            {

                return Json("");
            }
        }


        /// <summary>  
        /// Method is to check that whether folder exists on Dropbox or not.  
        /// </summary>  
        /// <param name="path"> Path of the folder we want to check for existance.</param>  
        /// <returns></returns>  
        public bool FolderExists(string path)
        {
            try
            {
                if (AccessToken == null)
                {
                    throw new Exception("AccessToken not generated !");
                }

                var folders = DBClient.Files.ListFolderAsync(path);
                var result = folders.Result;
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

    }
}