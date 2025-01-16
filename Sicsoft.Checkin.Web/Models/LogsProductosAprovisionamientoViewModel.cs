using System.Collections.Generic;

namespace NOVAAPP.Models
{
    public class LogsProductosAprovisionamientoViewModel
    {
        public string PalabraClave { get; set; }
        public int idCategoria { get; set; }

        public int idUsuarioModificador { get; set; }
        public List<LogsProductosAprovViewModel> Detalle { get; set; }
    }
}
