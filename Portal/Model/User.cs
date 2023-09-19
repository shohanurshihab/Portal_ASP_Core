using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Portal.Model
{
    public class User
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public int? StudentId { get; set; }
        public string? Image { get; set; }   
        public string? Password { get; set; }
        public List<Document>? UploadedDocuments { get; set; }

    }
}
