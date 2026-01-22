namespace NOVAAPP.Models
{
    public class ReporteMargenesViewModel
    {
        public bool PrecioFijo { get; set; }
        public bool Seteble { get; set; }
        public bool Escalonado { get; set; }
        public string ItemCode { get; set; }
        public string Nombre { get; set; }
        public string Categoria { get; set; }
        public string NombreCategoria { get; set; }
        public string ListaPrecio { get; set; }
        public decimal PrecioCob { get; set; }
        public decimal MargenMin { get; set; }
        public decimal Margen { get; set; }
        public decimal Precio { get; set; }
        public decimal CantMin1 { get; set; }
        public decimal Margen1 { get; set; }
        public decimal CantMin2 { get; set; }
        public decimal Margen2 { get; set; }
        public decimal CantMin3 { get; set; }
        public decimal Margen3 { get; set; }
    }
}
