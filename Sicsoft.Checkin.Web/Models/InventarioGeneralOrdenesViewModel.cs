using System;

namespace NOVAAPP.Models
{
    public class InventarioGeneralOrdenesViewModel
    {
        public string NumeroOC { get; set; }
        public DateTime FechaOC { get; set; }
        public string Estado { get; set; }
        public DateTime FechaEstimadaArribo { get; set; }
        public string Producto { get; set; }

        public decimal Cantidad { get; set; }
        public decimal MesesCobertura { get; set; }
    }
}
