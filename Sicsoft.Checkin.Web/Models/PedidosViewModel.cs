using System.Collections.Generic;
using System;

namespace NOVAAPP.Models
{
    public class PedidosViewModel
    {
        public int id { get; set; }
        public int idUsuarioCreador { get; set; }
        public string CodSuc { get; set; }
        public DateTime Fecha { get; set; }
        public string Comentarios { get; set; }
        public string Status { get; set; }
        public List<DetPedidosViewModel> Detalle { get; set; }
    }
}
