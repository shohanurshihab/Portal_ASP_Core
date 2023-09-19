using AutoMapper;
using Portal.Model;

namespace Portal.DTOs
{
    public class Map:Profile
    {
        public Map()
        {
            CreateMap<Document, DocumentDTO>();
            CreateMap<DocumentDTO, Document>();
        }
    }
}
