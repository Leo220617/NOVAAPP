using System.Collections.Generic;

namespace NOVAAPP.Models
{
    public class ListasCorreosViewModel
    {
        public int id { get; set; }
        public string Nombre { get; set; }
        public bool Activo { get; set; }
        public List<DetListaCorreoViewModel> Detalle { get; set; }
    }
}
