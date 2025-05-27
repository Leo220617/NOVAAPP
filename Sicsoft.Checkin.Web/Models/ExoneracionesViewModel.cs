using System;

namespace NOVAAPP.Models
{
    public class ExoneracionesViewModel
    {
        public int id { get; set; }
        public string TipoDoc { get; set; }
        public string NumDoc { get; set; }
        public string NomInst { get; set; }
        public DateTime FechaEmision { get; set; }
        public int PorExon { get; set; }
        public int idCliente { get; set; }
        public DateTime FechaVencimiento { get; set; }
        public byte[] Imagen { get; set; }
        public string ImagenBase64 { get; set; }


        public bool Activo { get; set; }
        public int idImpuesto { get; set; }
        public DetExoneracionesViewModel[] Detalle { get; set; }

       
    }
}
