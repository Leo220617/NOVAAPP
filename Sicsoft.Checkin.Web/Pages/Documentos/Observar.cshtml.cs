using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Refit;
using Sicsoft.Checkin.Web.Servicios;
using NOVAAPP.Models;


namespace NOVAAPP.Pages.Documentos
{
    public class ObservarModel : PageModel
    {
        private readonly ICrudApi<DocumentosViewModel, int> service;
        private readonly ICrudApi<ClientesViewModel, string> serviceE;
        private readonly ICrudApi<ProductosViewModel, string> serviceP;
        private readonly ICrudApi<ExoneracionesViewModel, int> exoneracion;
        private readonly ICrudApi<CondicionesPagosViewModel, int> condiconesPago;
        private readonly ICrudApi<VendedoresViewModel, int> vendedor;
        private readonly ICrudApi<ParametrosViewModel, int> parametro;
        private readonly ICrudApi<BodegasViewModel, int> bodegas;
        private readonly ICrudApi<TipoCambiosViewModel, int> tipoCambio;
        private readonly ICrudApi<RutasFacViewModel, int> ruta;
        private readonly ICrudApi<CuentasBancariasViewModel, int> cuentas;


        [BindProperty]
        public ClientesViewModel[] Clientes { get; set; }

        [BindProperty]
        public DocumentosViewModel Documento { get; set; }

        [BindProperty]
        public ProductosViewModel[] Productos { get; set; }

        [BindProperty]
        public ExoneracionesViewModel[] Exoneraciones { get; set; }

        [BindProperty]
        public CondicionesPagosViewModel CondicionesPago { get; set; }

        [BindProperty]
        public VendedoresViewModel Vendedor { get; set; }
        [BindProperty]
        public ParametrosViewModel[] Parametro { get; set; }

        [BindProperty]
        public BodegasViewModel[] Bodegas { get; set; }

        [BindProperty]
        public TipoCambiosViewModel[] TP { get; set; }

        [BindProperty]
        public RutasFacViewModel[] Rutas { get; set; }

        [BindProperty]
        public CuentasBancariasViewModel[] Cuentas { get; set; }

        public ObservarModel(ICrudApi<DocumentosViewModel, int> service, ICrudApi<CuentasBancariasViewModel, int> cuentas, ICrudApi<RutasFacViewModel, int> ruta, ICrudApi<TipoCambiosViewModel, int> tipoCambio, ICrudApi<ClientesViewModel, string> serviceE, ICrudApi<ProductosViewModel, string> serviceP, ICrudApi<ExoneracionesViewModel, int> exoneracion, ICrudApi<CondicionesPagosViewModel, int> condiconesPago, ICrudApi<VendedoresViewModel, int> vendedor, ICrudApi<ParametrosViewModel, int> parametro, ICrudApi<BodegasViewModel, int> bodegas)
        {
            this.service = service;
            this.serviceE = serviceE;
            this.serviceP = serviceP;
            this.exoneracion = exoneracion;
            this.condiconesPago = condiconesPago;
            this.vendedor = vendedor;
            this.parametro = parametro;
            this.bodegas = bodegas;
            this.tipoCambio = tipoCambio;
            this.ruta = ruta;
            this.cuentas = cuentas;
        }
        public async Task<IActionResult> OnGetAsync(int id)
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "49").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }

                var CondPago = await condiconesPago.ObtenerLista("");
                var Vendedores = await vendedor.ObtenerLista("");
                Parametro = await parametro.ObtenerLista("");
                

                ParametrosFiltros filtro = new ParametrosFiltros();
                filtro.Externo = true;

                Documento = await service.ObtenerPorId(id);
                CondicionesPago = CondPago.Where(a => a.id == Documento.idCondPago).FirstOrDefault();
                Vendedor = Vendedores.Where(a => a.id == Documento.idVendedor).FirstOrDefault();
                ParametrosFiltros filtroCB = new ParametrosFiltros();
                filtroCB.Texto = Documento.CodSuc;
                Cuentas = await cuentas.ObtenerLista(filtroCB);
                Clientes = await serviceE.ObtenerLista(filtro);

                filtro.FechaInicial = DateTime.Now.Date;
                TP = await tipoCambio.ObtenerLista(filtro);


                if (Parametro.FirstOrDefault().Pais == "P" && TP.Length == 0)
                {
                    TP = new TipoCambiosViewModel[1];
                    var TipoCambiosViewModel = new TipoCambiosViewModel();
                    TipoCambiosViewModel.TipoCambio = 1;
                    TipoCambiosViewModel.Moneda = "USD";
                    TP[0] = TipoCambiosViewModel;
                }

                Productos = await serviceP.ObtenerLista("");
                Exoneraciones = await exoneracion.ObtenerLista("");
                Bodegas = await bodegas.ObtenerLista("");
                Rutas = await ruta.ObtenerLista("");
                return Page();
            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, ex.Message);
                return Page();
            }
        }
    }
}
