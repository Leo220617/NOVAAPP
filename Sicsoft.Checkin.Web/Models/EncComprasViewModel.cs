using System;

namespace NOVAAPP.Models
{
    public class EncComprasViewModel
    {
        public int id { get; set; }
        public int idAprovisionamiento { get; set; }
        public int idUsuarioCreador { get; set; }
        public string CodProveedor { get; set; }
        public string NombreProveedor { get; set; }
        public DateTime Fecha { get; set; }
        public DateTime FechaVencimiento { get; set; }
        public decimal Subtotal { get; set; }
        public decimal TotalImpuesto { get; set; }
        public decimal TotalCompra { get; set; }
        public string Moneda { get; set; }
        public string DocEntry { get; set; }
        public bool ProcesadaSAP { get; set; }

        public DetComprasViewModel[] Detalle { get; set; }
    }
}
