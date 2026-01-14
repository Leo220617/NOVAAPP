namespace NOVAAPP.Models
{
    public class DetMargenesViewModel
    {
        public int id { get; set; }

        public string ItemCode { get; set; }

        public int idListaPrecio { get; set; }

        public int idCategoria { get; set; }

        public string Moneda { get; set; }

        public decimal PrecioSAP { get; set; }

        public decimal Cobertura { get; set; }

        public decimal Margen { get; set; }

        public decimal MargenMin { get; set; }

        public decimal PrecioFinal { get; set; }

        public decimal PrecioMin { get; set; }
        public decimal PrecioCob { get; set; }
        public bool Seteable { get; set; }
        public bool PrecioFijo { get; set; }
        public bool Escalonado { get; set; }

        public decimal CantMin1 { get; set; }
        public decimal CantMax1 { get; set; }
        public decimal CantMin2 { get; set; }
        public decimal CantMax2 { get; set; }
        public decimal CantMin3 { get; set; }
        public decimal CantMax3 { get; set; }

        public decimal Margen1 { get; set; }
        public decimal Margen2 { get; set; }
        public decimal Margen3 { get; set; }

        public decimal PrecioEscalonado1 { get; set; }
        public decimal PrecioEscalonado2 { get; set; }
        public decimal PrecioEscalonado3 { get; set; }

    }
}
