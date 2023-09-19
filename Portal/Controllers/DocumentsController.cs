using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Portal.DTOs;
using Portal.Model;
using Portal.Repo;

namespace Portal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentsController : ControllerBase
    {
        private IDocumentRepo repo;
        private IFileProvider _fileProvider;
        private readonly IMapper _mapper;
        private DataContext _context;

        public DocumentsController(IDocumentRepo repository, IFileProvider fileProvider, IMapper mapper, DataContext context)
        {
            repo = repository;
            _fileProvider = fileProvider;
            _mapper = mapper;
            _context = context;
        }
        // GET api/documents
       
        // GET api/documents/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAsync(int id)
        {
            var document = repo.GetById(id);
            if (document == null)
            {
                return NotFound();
            }
            string filepath = document.FilePath;

            if (System.IO.File.Exists(filepath))
            {
                var imageBytes = await System.IO.File.ReadAllBytesAsync(filepath);

                var contenttype = "application/pdf";
                return File(imageBytes, contenttype, Path.GetFileName(filepath));

            }
            return Ok(document);
        }

        // POST api/documents
        [HttpPost]
        public IActionResult Post([FromForm] DocumentDTO document,IFormFile file)
        {
            if (file != null)
            {
                string filename2 = Path.GetFileNameWithoutExtension(file.FileName) + @"_" + DateTime.Now.ToString("HH.mm.ss_dd-MM-yyyy") + Path.GetExtension(file.FileName);
                string productPath2 = Path.Combine(Directory.GetCurrentDirectory(), "Files", document.StudentId.ToString());
                if (!Directory.Exists(productPath2))
                {
                    Directory.CreateDirectory(productPath2);
                }

                using (var fileStream = new FileStream(Path.Combine(productPath2, filename2), FileMode.Create))
                {
                    file.CopyTo(fileStream);
                }
                document.FilePath = Path.Combine(productPath2,filename2);
                document.FileName = filename2;
            }
            if (document == null)
            {
                return BadRequest();
            }
            var documentmap = _mapper.Map<Document>(document);
            repo.Create(documentmap);
            return Ok();
        }

        // PUT api/documents/5
        [HttpPut]
        public async Task<IActionResult> PutAsync([FromForm] DocumentDTO document, IFormFile file)
        {
            if (file != null)
            {

                // Use AsNoTracking() to retrieve the entity without tracking
                
                var userEntity = _context.Set<Document>().AsNoTracking().FirstOrDefault(u => u.DocumentId == document.DocumentId);
                // Get the existing image path
                string existingfilepath = userEntity.FilePath;
                var itemid = document.StudentId.ToString();
                string itemDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Files", itemid);
                // Generate new filename
                string newFilename = Path.GetFileNameWithoutExtension(file.FileName) + "_" +
                                    DateTime.Now.ToString("HH.mm.ss_dd-MM-yyyy") +
                                    Path.GetExtension(file.FileName);

                // If there was already an image, delete it
                if (!string.IsNullOrEmpty(existingfilepath))
                {
                    System.IO.File.Delete(existingfilepath);
                }


                // Generate and save the new image
                string newfilepath = Path.Combine(itemDirectory, newFilename);
                using (var stream = new FileStream(newfilepath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Update userEntity with the new image path
                document.FilePath = newfilepath;
                document.FileName = newFilename;
                var documentmap = _mapper.Map<Document>(document);
                // Now update the repository with the modified userEntity
                repo.Update(documentmap);
            }

            return NoContent();
        }

        // DELETE api/documents/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var userEntity = _context.Set<Document>().AsNoTracking().FirstOrDefault(u => u.DocumentId == id);
            // Get the existing image path
            string existingImagePath = userEntity.FilePath;
            if (!string.IsNullOrEmpty(existingImagePath))
            {
                System.IO.File.Delete(existingImagePath);
            }

            repo.Delete(id);
            return NoContent();
        }
        [HttpGet]
        public IActionResult Get()
        {
            var documents = repo.GetAll();
            return Ok(documents);
        }

        [HttpGet("user/{studentId}")]
        public IActionResult GetByStudent(int studentId)
        {
            var documents = repo.GetDocumentsByStudentId(studentId);
            return Ok(documents);
        }
    }
}
