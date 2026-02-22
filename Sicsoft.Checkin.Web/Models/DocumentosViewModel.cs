using System;

namespace NOVAAPP.Models
{
    public class DocumentosViewModel
    {
        public int id { get; set; }
        public int idCliente { get; set; }
        public int idUsuarioCreador { get; set; }
        public int idOferta { get; set; }

        public int idCondPago { get; set; }
        public DateTime Fecha { get; set; }
        public DateTime FechaVencimiento { get; set; }
        public string Comentarios { get; set; }
        public decimal Subtotal { get; set; }
        public decimal TotalImpuestos { get; set; }
        public decimal TotalDescuento { get; set; }
        public decimal TotalCompra { get; set; }
        public decimal PorDescto { get; set; }

        public string Status { get; set; }

        public string CodSuc { get; set; }
        public string Moneda { get; set; }

        public string TipoDocumento { get; set; }
        public int idCaja { get; set; }

        public int BaseEntry { get; set; }

        public int idVendedor { get; set; }

        public bool ProcesadaSAP { get; set; }

        public bool PagoProcesadaSAP { get; set; }
        public string ClaveHacienda { get; set; }
        public string ConsecutivoHacienda { get; set; }

        public decimal Redondeo { get; set; }
        public bool Validado { get; set; }

        public string TipoIdentificacion { get; set; }
        public string CodActividadReceptor { get; set; }

        public string RefCodigo { get; set; }
        public string RefCodigoReferenciaOtro { get; set; }
        public string RefRazon { get; set; }
        public string RefTipoDocumento { get; set; }
        public string TipoDocRefOtro { get; set; }
        public string MedioPago { get; set; }

        public bool Interes { get; set; }

        public string RespuestaHacienda { get; set; }


        public int idRutaFac { get; set; }
        public bool Transporte { get; set; }
        public string Direccion { get; set; }

        public decimal TotalTransporte { get; set; }

        public string ModoTransporte { get; set; }
        public MetodosPagosViewModel[] MetodosPagos { get; set; }

        public DetDocumentoViewModel[] Detalle { get; set; }
        public LotesViewModel[] Lotes { get; set; }

    }
}
