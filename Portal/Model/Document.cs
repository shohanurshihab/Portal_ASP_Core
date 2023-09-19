using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Portal.Model
{
    public class Document
    {
        [Key]
        public int DocumentId { get; set; }

        [MaxLength(255)]
        public string? FileName { get; set; }

        [MaxLength(255)]
        public string? FilePath { get; set; }

        public DateTime? UploadDate { get; set; }
        public int? StudentId { get; set; }
        public User? User { get; set; }
    }
}

