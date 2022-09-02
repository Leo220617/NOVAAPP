using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MPOrdenes.Models
{
    public class ExistenciasViewModel
    {
        public Existencias[] Existencias { get; set; }
    }
    public class Existencias
    {
        public string Articulo { get; set; }
        public string ItemName { get; set; }
        public decimal Faltante { get; set; }
        public decimal Requerido { get; set; }
        public decimal Inventario_Disponible { get; set; }
    }
}
