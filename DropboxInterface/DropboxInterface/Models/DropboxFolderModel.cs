using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DropboxInterface.Models
{
    public class DropboxFolderModel
    {
        public DropboxFolderModel()
        {
            this.FolderPaths = new List<string>();
        }

        public List<string> FolderPaths { get; set; }

        public string Token { get; set; }
    }
}
