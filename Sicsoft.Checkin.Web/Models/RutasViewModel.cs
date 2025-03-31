using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace NOVAAPP.Models
{
    public class RutasViewModel
    {
        public int id { get; set; }



        [StringLength(100)]
        public string Nombre { get; set; }

        [StringLength(100)]
        public string Origen { get; set; }

        [Column(TypeName = "money")]
        public decimal? Costos { get; set; }

        [Column(TypeName = "money")]
        public decimal? Km { get; set; }

        public string Codigo { get; set; }
    }
}
