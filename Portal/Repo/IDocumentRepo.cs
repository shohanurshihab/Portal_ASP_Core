using Portal.Model;

namespace Portal.Repo
{
    public interface IDocumentRepo
    {
        IEnumerable<Document> GetDocumentsByStudentId(int studentId);
        IEnumerable<Document> GetAll();
        Document? GetById(int? id);
        void Create(Document document);
        void Update(Document document);
        void Delete(int id);
    }
}
