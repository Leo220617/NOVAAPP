using System;

namespace NOVAAPP.Models
{
    public class EstadoCuentaViewModel
    {
        public EstadoCuenta[] EstadoCuenta { get; set; }
    }
    public class EstadoCuenta
    {
    
        public string CardCode { get; set; }
        public string NombreCliente { get; set; }
        public string DocNum { get; set; }
        public string Consecutivo { get; set; }
        public string Factura { get; set; }
        public DateTime Fecha { get; set; }
        public DateTime FechaVen { get; set; }
        public int Dias { get; set; }
        public string MonedaDet { get; set; }
        public decimal TotalDet { get; set; }
        public decimal Saldo { get; set; }
        public string comments { get; set; }
        public decimal SinVen { get; set; }
        public decimal Intereses { get; set; }

    }
}
