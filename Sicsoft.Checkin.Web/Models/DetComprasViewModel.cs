namespace NOVAAPP.Models
{
    public class DetComprasViewModel
    {
        public int id { get; set; }
        public int idEncabezado { get; set; }
        public int idDetAprovisionamiento { get; set; }
        public string CodigoProducto { get; set; }
        public string NombreProducto { get; set; }
        public decimal Cantidad { get; set; }
        public string Impuesto { get; set; }
        public decimal TotalImpuesto { get; set; }
        public decimal PrecioUnitario { get; set; }
        public decimal TotalLinea { get; set; }
        public string Bodega { get; set; }
    }
}
