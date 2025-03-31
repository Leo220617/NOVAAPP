namespace NOVAAPP.Models
{
    public class DetTrasladosViewModel
    {
        public int id { get; set; }
        public int idEncabezado { get; set; }
        public int NumLinea { get; set; }
        public string CodigoProducto { get; set; }
        public string NombreProducto { get; set; }
        public decimal Cantidad { get; set; }
        public decimal CantidadRecibido { get; set; }
        public decimal CantidadFaltante { get; set; }
        public decimal CantidadFaltanteAE { get; set; }
        public decimal CantidadAprobada { get; set; }
        public decimal Factor { get; set; }
        public bool Revisado { get; set; }
        public bool RevisadoT { get; set; }

        public bool Serie { get; set; }

        public string Ubicacion { get; set; }
    }
}
