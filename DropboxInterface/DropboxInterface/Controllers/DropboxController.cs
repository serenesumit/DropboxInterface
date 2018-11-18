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

namespace DropboxInterface.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DropboxController : Controller
    {
        string hostName = "", scheme = "", path = "", AccessToken = "";

        #region Variables  
        private DropboxClient DBClient;
        private string oauth2State;
        List<string> folderPaths = new List<string>();
        // private const string RedirectUri = "https://localhost/authorize"; // Same as we have configured Under [Application] -> settings -> redirect URIs.  
        #endregion
        [HttpGet("Index")]
        public async Task<IActionResult> Index()
        {
            string test = HttpContext.Session.GetString(AccessToken);


            DBClient = new DropboxClient(test);
            var get = await DBClient.Users.GetCurrentAccountAsync();

            Console.WriteLine(get.Name.DisplayName);

            var list = await DBClient.Files.ListFolderAsync("", true);

            foreach (var item in list.Entries)
            {
                if (item.IsFolder)
                {
                    folderPaths.Add(item.PathLower);
                }
                Console.WriteLine(item.Name);
            }


            this.Upload(folderPaths[0], "Sample-test.txt", @"D:\AppointmentLive2.txt");

            return View();
        }

        string AppKey = "lthbutbf1rtovyx";
        string AppSecret = "om3vwurqicmaopo";
        string RedirectUri = "https://localhost:44358/api/Dropbox/AuthAsync";


        [HttpGet("[action]")]
        public JsonResult CheckSession()
        {
            return Json(HttpContext.Session.GetString(AccessToken));
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


        /// <summary>  
        /// Method to upload files on Dropbox  
        /// </summary>  
        /// <param name="UploadfolderPath"> Dropbox path where we want to upload files</param>  
        /// <param name="UploadfileName"> File name to be created in Dropbox</param>  
        /// <param name="SourceFilePath"> Local file path which we want to upload</param>  
        /// <returns></returns>  

        private bool Upload(string UploadfolderPath, string UploadfileName, string SourceFilePath)
        {
            try
            {
                using (var stream = new MemoryStream(System.IO.File.ReadAllBytes(SourceFilePath)))
                {
                    var response = DBClient.Files.UploadAsync(UploadfolderPath + "/" + UploadfileName, WriteMode.Overwrite.Instance, body: stream);
                    var rest = response.Result; //Added to wait for the result from Async method  
                }

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }

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

                HttpContext.Session.SetString(AccessToken, response.AccessToken);
                return RedirectToAction("Index");
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


        [HttpPost("[action]")]
        //public async Task<HttpResponseMessage> SaveFile()
        public async Task<HttpResponseMessage> SaveFile(DropboxModel model)
        {

            HttpResponseMessage result = null;


            return result;

        }

    }
}