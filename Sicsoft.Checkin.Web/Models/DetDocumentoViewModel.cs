namespace NOVAAPP.Models
{
    public class DetDocumentoViewModel
    {
        public int id { get; set; }
        public int idEncabezado { get; set; }
        public int idProducto { get; set; }
        public int NumLinea { get; set; }
        public decimal Cantidad { get; set; }
        public decimal TotalImpuesto { get; set; }
        public decimal PrecioUnitario { get; set; }
        public decimal PorDescto { get; set; }
        public decimal Descuento { get; set; }

        public decimal TotalLinea { get; set; }
        public string Cabys { get; set; }
        public int idExoneracion { get; set; }

        public string Localizacion { get; set; }
        public string CodigoDescuento { get; set; }
        public string TipoTransaccion { get; set; }
        public string IVAFabrica { get; set; }
        public bool TaxOnly { get; set; }

        public bool Regalia { get; set; }
        public bool Escalonado { get; set; }
        public decimal TotalTransporte { get; set; }

        public decimal PrecioBase { get; set; }


    }
}
