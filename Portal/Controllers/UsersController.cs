using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Portal.Model;
using Portal.Repo;

namespace Portal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private IUserRepo repo;
        private IDocumentRepo drepo;
        private IFileProvider _fileProvider;
        private DataContext _context; 

        public UsersController(IUserRepo repository, IFileProvider fileProvider, DataContext context)
        {
            repo = repository;
            _fileProvider = fileProvider;
            _context = context; 
        }
        [HttpGet]
        public IActionResult GetUsers()
        {
            return Ok(repo.GetAll());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserAsync(int id)
        {
            /*var user = repo.GetById(id);*/
            var user = repo.GetByIdWithDocuments(id);
            if (user == null)
            {
                return NotFound();
            }
            string imagePath = user.Image;

            if (System.IO.File.Exists(imagePath))
            {
                var imageBytes = await System.IO.File.ReadAllBytesAsync(imagePath);

                var contenttype = "application/octet-stream";
                return Ok(new {User =user, FileContentResult = File(imageBytes, contenttype, Path.GetFileName(imagePath)) });
            }
            return Ok(user);
        }
        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync(Login login)
        {
            /*var user = repo.GetById(id);*/
            var log_user = _context.Set<User>().AsNoTracking().FirstOrDefault(u => u.StudentId == login.StudentId && u.Password == login.Password);
            
            
            if (log_user == null)
            {
                return NotFound();
            }
            var user = repo.GetByIdWithDocuments((int)log_user.StudentId);
            string imagePath = user.Image;

            if (System.IO.File.Exists(imagePath))
            {
                var imageBytes = await System.IO.File.ReadAllBytesAsync(imagePath);

                var contenttype = "application/octet-stream";
                return Ok(new {User =user, FileContentResult = File(imageBytes, contenttype, Path.GetFileName(imagePath)) });
            }
            return Ok(user);
        }
        [HttpPost]
        public IActionResult CreateUser([FromForm] User user, IFormFile? pics)
        {
            if (pics != null)
            {
                // Assuming that item has an ID property, replace "ItemID" with the actual property name
                string itemId = user.StudentId.ToString();

                // Create a directory for each item based on its ID
                string itemDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Images",itemId);

                // Check if the directory exists, and create it if it doesn't
                if (!Directory.Exists(itemDirectory))
                {
                    Directory.CreateDirectory(itemDirectory);
                }

                string filename1 = Path.GetFileNameWithoutExtension(pics.FileName) + "_" +
                                  DateTime.Now.ToString("HH.mm.ss_dd-MM-yyyy") +
                                  Path.GetExtension(pics.FileName);

                string imagePath = Path.Combine(itemDirectory, filename1);

                using (var fileStream = new FileStream(imagePath, FileMode.Create))
                {
                    pics.CopyTo(fileStream);
                }

                user.Image = imagePath;
            }
          

                repo.Create(user);
                return NoContent();
        }

        [HttpPut]
        public async Task<IActionResult> UpdateUser([FromForm] User user, IFormFile? pics)
        {
            if (pics != null)
            {
                
                // Use AsNoTracking() to retrieve the entity without tracking
                var userEntity = _context.Set<User>().AsNoTracking().FirstOrDefault(u => u.Id == user.Id);
                // Get the existing image path
                string existingImagePath = userEntity.Image;
                var itemid = user.StudentId.ToString();
                string itemDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Images", itemid);
                // Generate new filename
                string newFilename = Path.GetFileNameWithoutExtension(pics.FileName) + "_" +
                                    DateTime.Now.ToString("HH.mm.ss_dd-MM-yyyy") +
                                    Path.GetExtension(pics.FileName);

                // If there was already an image, delete it
                if (!string.IsNullOrEmpty(existingImagePath))
                {
                    System.IO.File.Delete(existingImagePath);
                }

                // Get the directory 
                string directory = Path.GetDirectoryName(existingImagePath);

                // Generate and save the new image
                string newImagePath = Path.Combine(itemDirectory, newFilename);
                using (var stream = new FileStream(newImagePath, FileMode.Create))
                {
                    await pics.CopyToAsync(stream);
                }

                // Update userEntity with the new image path
              
                userEntity.Image = newImagePath;

                // Now update the repository with the modified userEntity
                repo.Update(userEntity);
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            var userEntity = _context.Set<User>().AsNoTracking().FirstOrDefault(u => u.Id == id);
            // Get the existing image path
            string existingImagePath = userEntity.Image;
            if (!string.IsNullOrEmpty(existingImagePath))
            {
                System.IO.File.Delete(existingImagePath);
            }
            repo.Delete(id);
            return NoContent();
        }

    }
}
