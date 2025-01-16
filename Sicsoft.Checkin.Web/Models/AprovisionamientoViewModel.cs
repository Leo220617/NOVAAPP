using System.Collections.Generic;
using System;

namespace NOVAAPP.Models
{
    public class AprovisionamientoViewModel
    {
        public int id { get; set; }
        public int idCategoria { get; set; }
        public int idSubCategoria { get; set; }
        public int idUsuarioCreador { get; set; }
        public DateTime Fecha { get; set; }
        public string Status { get; set; }

        public string Clasificacion { get; set; }
        public decimal IndicadorMenor { get; set; }
        public decimal IndicadorMayor { get; set; }

        public string FiltroSeleccionado { get; set; }

        public DateTime FechaActualizacion { get; set; }
        public List<DetAprovisionamientoViewModel> Detalle { get; set; }
    }
}
