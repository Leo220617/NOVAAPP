namespace NOVAAPP.Models
{
    public class ProductosTrasladosViewModel
    {
        public Productos[] Productos { get; set; }
    }

    public class Productos
    {
        public string Codigo { get; set; }

        public string Nombre { get; set; }

        public string idBodega { get; set; }
        public decimal Stock { get; set; }

        public decimal Comprometido { get; set; }

        public decimal Factor { get; set; }

        public decimal StockReal { get; set; }
        public bool Serie { get; set; }

        public string Localizacion { get; set; }

    }
}
