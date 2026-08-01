using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using NOVAAPP.Models;
using Refit;
using Sicsoft.Checkin.Web.Servicios;
using System.Security.Claims;
using System.Threading.Tasks;
using System;
using System.Linq;

namespace NOVAAPP.Pages.ReporteVendedoresVentas
{
    public class IndexModel : PageModel
    {
        private readonly ICrudApi<ReporteVentasVendedoresViewModel, int> service;
        private readonly ICrudApi<VendedoresViewModel, int> vendedores;
        private readonly ICrudApi<SucursalesViewModel, string> sucursales;



        [BindProperty(SupportsGet = true)]
        public ParametrosFiltros filtro { get; set; }

        [BindProperty]
        public ReporteVentasVendedoresViewModel[] ReporteVentasVendedores { get; set; }

        [BindProperty]
        public VendedoresViewModel[] Vendedores { get; set; }

        [BindProperty]
        public SucursalesViewModel[] Sucursales { get; set; }


        public IndexModel(ICrudApi<ReporteVentasVendedoresViewModel, int> service, ICrudApi<VendedoresViewModel, int> vendedores, ICrudApi<SucursalesViewModel, string> sucursales)
        {
            this.service = service;
            this.vendedores = vendedores;
            this.sucursales = sucursales;

        }
        public async Task<IActionResult> OnGetAsync()
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "136").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }

                DateTime time = new DateTime();

                if (filtro.FechaInicial == DateTime.MinValue)
                {
                    filtro.FechaInicial = DateTime.Today;
                    filtro.FechaFinal = DateTime.Today;
                }

                ParametrosFiltros filtroV = new ParametrosFiltros();
                filtroV.Activo = true;
                Vendedores = await vendedores.ObtenerLista(filtroV);
                Sucursales = await sucursales.ObtenerLista("");
                ReporteVentasVendedores = await service.ObtenerLista(filtro);






                return Page();
            }
            catch (ApiException ex)
            {
                Errores error = JsonConvert.DeserializeObject<Errores>(ex.Content.ToString());
                ModelState.AddModelError(string.Empty, error.Message);

                return Page();
            }
        }
    }
}
