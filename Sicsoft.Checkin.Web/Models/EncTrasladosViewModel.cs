using Sicsoft.Checkin.Web.Models;
using System.Collections.Generic;
using System;

namespace NOVAAPP.Models
{
    public class EncTrasladosViewModel
    {
        public int id { get; set; }
        public int idUsuarioCreador { get; set; }
        public int idUsuarioAceptador { get; set; }

        public int idRuta { get; set; }
        public int idFlotilla { get; set; }
        public int idChofer { get; set; }
        public DateTime Fecha { get; set; }
        public DateTime FechaAceptacion { get; set; }
        public DateTime FechaVencimiento { get; set; }
        public int BodInicial { get; set; }
        public int BodFinal { get; set; }
        public string Status { get; set; } //0 esta apenas insertado, 1 aceptado, 2 procesado
        public int CantidadLineas { get; set; }
        public string Comentarios { get; set; }
        public string Series { get; set; }
        public bool Generar { get; set; }

        public bool Transitoria { get; set; }
        public bool Aprobado { get; set; }
        public bool Final { get; set; }
        public bool Alistado { get; set; }

        public decimal TotalKG { get; set; }
        public decimal TotalKGA { get; set; }

        public bool ProcesadoSAP { get; set; }
        public string DocEntry { get; set; }
        public List<DetTrasladosViewModel> Detalle { get; set; }
        public List<AdjuntosViewModel> Adjuntos { get; set; }
        public List<LotesViewModel> Lotes { get; set; }
        public List<LogsViewModel> Logs { get; set; }

        public List<LogsTrasladosViewModel> LogTraslados { get; set; }
    }
}
