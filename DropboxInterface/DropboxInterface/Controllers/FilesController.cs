using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Dropbox.Api;
using Dropbox.Api.Files;
using DropboxInterface.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DropboxInterface.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilesController : ControllerBase
    {

        [HttpPost]
        public async Task<HttpResponseMessage> SaveFile()
        {

            HttpResponseMessage result = null;

            var path = Request.Form["Path"].ToString();
            var files = Request.Form.Files;
            foreach (var file in files)
            {
                Upload(path, file.FileName, file.OpenReadStream());
            }
            return result;

        }

        /// <summary>  
        /// Method to upload files on Dropbox  
        /// </summary>  
        /// <param name="UploadfolderPath"> Dropbox path where we want to upload files</param>  
        /// <param name="UploadfileName"> File name to be created in Dropbox</param>  
        /// <param name="SourceFilePath"> Local file path which we want to upload</param>  
        /// <returns></returns>  

        private bool Upload(string UploadfolderPath, string UploadfileName, Stream stream)
        {
            var token = HttpContext.Session.GetString("AccessToken");
            try
            {
                using (DropboxClient DBClient = new DropboxClient(token))
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
    }
}