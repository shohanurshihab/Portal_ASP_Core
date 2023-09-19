using Microsoft.EntityFrameworkCore;
using Portal.Model;

namespace Portal.Repo
{
    public class UserRepo : IUserRepo
    {
        private DataContext _context;
        public UserRepo(DataContext context)
        {
            _context = context;
        }
        public void Create(User user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entityToDelete = GetById(id);
            _context.Users.Remove(entityToDelete);
            _context.SaveChanges();
        }

        public IEnumerable<User> GetAll()
        {
            return _context.Users;
        }

        public User? GetById(int? id)
        {
            if (id == null)
            {
                throw new ArgumentNullException(nameof(id));
            }

            var entity = _context.Users.Find(id);

            if (entity == null)
            {
                throw new ArgumentException("Entity not found", nameof(id));
            }

            return entity;
        }

        public void Update(User user)
        {
            _context.Users.Update(user);
            _context.SaveChanges();
        }
        public User GetByIdWithDocuments(int id)
        {
            var studentId = _context.Users.Where(u => u.StudentId == id).Select(u => u.Id).FirstOrDefault();
            var dcs = _context.Users
                          .Include(u => u.UploadedDocuments)
                          .FirstOrDefault(u => u.Id == studentId);
            return dcs;
        }
    }
}
