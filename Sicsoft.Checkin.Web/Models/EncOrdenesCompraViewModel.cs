using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MPOrdenes.Models
{
    public class EncOrdenesCompraViewModel
    {
        public int DocEntry { get; set; }
        public int DocNum { get; set; }
        public string Moneda { get; set; }
        public string CardCode { get; set; }
        public string CardName { get; set; }
        public DateTime DocDate { get; set; }
        public string Series { get; set; }
        public string Estado { get; set; }
        public string Comentarios { get; set; }
        public List<DetOrdenesCompraViewModel> Detalle { get; set; }
    }
}
