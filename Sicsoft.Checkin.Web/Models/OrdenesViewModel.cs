using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MPOrdenes.Models
{
    public class OrdenesViewModel
    {
        public Ordenes[] Ordenes { get; set; }
    }
    public class Ordenes
    {
        public int NoProducción { get; set; }
        public DateTime Fecha { get; set; }
        public string A_Producir { get; set; }
        public string Nombre { get; set; }
        public decimal Planificada { get; set; }
        public decimal Completada { get; set; }
    }
}
