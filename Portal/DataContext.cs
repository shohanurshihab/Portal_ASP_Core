using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Portal.Model;

namespace Portal
{
    
        [DbContext(typeof(DataContext))]
        public class DataContext : DbContext
        {
            public DataContext(DbContextOptions<DataContext> options) : base(options)
            { }
            public DbSet<User> Users { get; set; }
            public DbSet<Document> Documents { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure the relationship between Document and User
            modelBuilder.Entity<Document>()
                .HasOne(d => d.User)
                .WithMany(u => u.UploadedDocuments)
                .HasForeignKey(d => d.StudentId)
                .HasPrincipalKey(p => p.StudentId)
                .OnDelete(DeleteBehavior.Cascade); // You can change this behavior as needed
        }
    }
    
}
