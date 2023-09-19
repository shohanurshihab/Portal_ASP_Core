using Portal.Model;

namespace Portal.Repo
{
    public interface IUserRepo
    {
        IEnumerable<User> GetAll();
        User? GetById(int? id);
        void Create(User Upload);
        void Update(User Upload);
        void Delete(int id);
        User GetByIdWithDocuments(int id);
    }
}
