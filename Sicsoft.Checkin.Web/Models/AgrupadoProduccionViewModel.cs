namespace MPOrdenes.Models
{
    public class AgrupadoProduccionViewModel
    {
        public int id { get; set; }
        public int DocEntry { get; set; }
        public string Articulo { get; set; }
        public string SustPor { get; set; }
        public string ItemName { get; set; }
        public decimal Requerido { get; set; }
        public decimal CantidadReal { get; set; }
    }
}
