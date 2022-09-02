namespace MPOrdenes.Models
{
    public class PLineasViewModel
    {
        public PLineas[] PLineas { get; set; }
    }
    public class PLineas
    {
        public string Articulo { get; set; }
        public string ItemName { get; set; }
        public decimal Requerido { get; set; }
        public int Orden { get; set; }
        public int OrdenFabricacion { get; set; }
        public int Linea { get; set; }
    }
}
