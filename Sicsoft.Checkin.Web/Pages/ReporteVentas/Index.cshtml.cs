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

namespace NOVAAPP.Pages.ReporteVentas
{
    public class IndexModel : PageModel
    {
        private readonly ICrudApi<ReporteVentasViewModel, int> service;
        private readonly ICrudApi<BodegasViewModel, int> serviceBodegas;


        [BindProperty(SupportsGet = true)]
        public ParametrosFiltros filtro { get; set; }

        [BindProperty]
        public ReporteVentasViewModel[] ReporteVentas { get; set; }

        [BindProperty]
        public BodegasViewModel[] Bodegas { get; set; }


        public IndexModel(ICrudApi<ReporteVentasViewModel, int> service, ICrudApi<BodegasViewModel, int> serviceBodegas)
        {
            this.service = service;
            this.serviceBodegas = serviceBodegas;
          
        }
        public async Task<IActionResult> OnGetAsync()
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "10").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
                if (!string.IsNullOrEmpty(filtro.CardCode))
                {
                    ReporteVentas = await service.ObtenerLista(filtro);
                }
                else
                {
                    filtro.FechaInicial = DateTime.Now.AddMonths(-1);
                    filtro.FechaFinal = DateTime.Now;
                    ReporteVentas = new ReporteVentasViewModel[0];
                }
                
                
                Bodegas = await serviceBodegas.ObtenerLista("");

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
