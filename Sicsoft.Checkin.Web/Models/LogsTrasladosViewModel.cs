using System;

namespace NOVAAPP.Models
{
    public class LogsTrasladosViewModel
    {
        public int id { get; set; }
        public int idEncabezado { get; set; }
        public int Tipo { get; set; }
        public int DocEntry { get; set; }
        public string DocNum { get; set; }
        public DateTime Fecha { get; set; }
        public string BodInicial { get; set; }
        public string BodFinal { get; set; }
        public string Detalle { get; set; }
    }
}
