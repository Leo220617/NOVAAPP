namespace NOVAAPP.Models
{
    public class InventarioGeneralViewModel
    {
        public string Codigo { get; set; }
        public string NombreProducto { get; set; }
        public decimal PrecioUnitario { get; set; }
        public string Moneda { get; set; }
        public decimal Stock { get; set; }
        public string Bodega { get; set; }
        public decimal Costo { get; set; }
        public decimal Cobertura { get; set; }
        public decimal CoberturaTransito { get; set; }
        public decimal PromedioUnidadesGeneral { get; set; }
        public decimal PromedioUnidades { get; set; } 
        public string Categoria { get; set; }
        public string CategoriaGeneral { get; set; }
    }
}
