﻿
using Castle.MicroKernel.SubSystems.Conversion;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NOVAAPP.Models
{
    public class ParametrosViewModel
    {
        public int id { get; set; }

        public string SQLClientes { get; set; }

        public string SQLProductos { get; set; }

        public string SQLImpuestos { get; set; }

        public string SQLListaPrecios { get; set; }

        public string SQLBodegas { get; set; }

        public string SQLCondiciones { get; set; }

        public string SQLGrupos { get; set; }

        public string SQLTipoCambio { get; set; }

        public string SQLVendedores { get; set; }

        public int SerieProforma { get; set; }

        public int SerieOrden { get; set; }

        public int SerieCliente { get; set; }

        public string UrlFacturaElectronica { get; set; }

        public string UrlConsultaFacturas { get; set; }

        public string SQLDocumentoCredito { get; set; }

        public string SQLDetDocumentoCredito { get; set; }

        public string CostingCode { get; set; }

        public string CostingCode2 { get; set; }

        public string CostingCode3 { get; set; }

        public string SQLCuentasBancarias { get; set; }

        public string MonedaLocal { get; set; }

        public string CampoClave { get; set; }

        public string CampoConsecutivo { get; set; }

        public bool NumeroSerie { get; set; }

        public bool MontosPagosSeparados { get; set; }


        public string SQLSeriesProductos { get; set; }
        public string Pais { get; set; }

        public string SQLAprovisionamiento { get; set; }

    }
}
