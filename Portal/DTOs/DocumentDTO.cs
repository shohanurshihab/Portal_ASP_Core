using System.ComponentModel.DataAnnotations;

namespace Portal.DTOs
{
    public class DocumentDTO
    {
        public int? DocumentId { get; set; }
        public string? FileName { get; set; }
        public string? FilePath { get; set; }
        public DateTime? UploadDate { get; set; }
        public int? StudentId { get; set; }
    }
}
