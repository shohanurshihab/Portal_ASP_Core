using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Portal.Model;

namespace Portal.Repo
{
    public class DocumentRepo : IDocumentRepo
    {
        private DataContext _context;
        public DocumentRepo(DataContext context)
        {
            _context = context;
        }
        public void Create(Document document)
        {
            _context.Documents.Add(document);
            _context.SaveChanges();

        }

        public void Delete(int id)
        {
            _context.Documents.Remove(GetById(id));
            _context.SaveChanges();
        }

        public IEnumerable<Document> GetAll()
        {
            return _context.Documents;
        }

        public Document? GetById(int? id)
        {
            return _context.Documents.Find(id);
        }

        public IEnumerable<Document> GetDocumentsByStudentId(int studentId)
        {
            // Use Entity Framework to query documents by studentId
            return _context.Documents
                .Where(d => d.StudentId == studentId)
                .ToList();
        }

        public void Update(Document document)
        {
            _context.Documents.Update(document);
            _context.SaveChanges(); 
        }
    }
}
