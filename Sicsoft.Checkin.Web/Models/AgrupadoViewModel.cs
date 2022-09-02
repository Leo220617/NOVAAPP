namespace MPOrdenes.Models
{
    public class AgrupadoViewModel
    {
        public Agrupado[] Agrupado { get; set; }
    }
    public class Agrupado
    {
        public string Articulo { get; set; }
        public string ItemName { get; set; }
        public decimal Requerido { get; set; }
    }
}
