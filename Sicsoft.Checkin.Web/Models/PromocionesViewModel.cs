using Org.BouncyCastle.Asn1.X509;
using System.ComponentModel.DataAnnotations.Schema;
using System;

namespace NOVAAPP.Models
{
    public class PromocionesViewModel
    {
        public string ItemCode { get; set; }
      
        public int idCategoria { get; set; }

  
        public int idListaPrecio { get; set; }

        public string Moneda { get; set; }

        public decimal PrecioFinal { get; set; }

        public DateTime FechaVen { get; set; }
    }
}
