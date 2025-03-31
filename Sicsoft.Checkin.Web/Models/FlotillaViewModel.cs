using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace NOVAAPP.Models
{
    public class FlotillaViewModel
    {
        public int id { get; set; }

        [StringLength(100)]
        public string Nombre { get; set; }

        [StringLength(50)]
        public string Placa { get; set; }

        [Column(TypeName = "money")]
        public decimal? Peso { get; set; }

        [Column(TypeName = "money")]
        public decimal? Volumen { get; set; }

        [StringLength(1)]
        public string Estado { get; set; }
    }
}
