using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using NOVAAPP.Models; 
using Refit;
using Sicsoft.Checkin.Web.Servicios;
using System;
using System.IO.Compression;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace NOVAAPP.Pages.InventarioGeneral
{
    public class IndexModel : PageModel
    {
        private readonly ICrudApi<FamiliasViewModel, int> serviceF;
        private readonly ICrudApi<BodegasViewModel, int> serviceB;


        private readonly ICrudApi<InventarioGeneralViewModel, int> service;
        private readonly ICrudApi<InventarioGeneralOrdenesViewModel, int> serviceO;



        [BindProperty(SupportsGet = true)]
        public ParametrosFiltros filtro { get; set; }

        [BindProperty]
        public FamiliasViewModel[] Familias { get; set; }

        [BindProperty]
        public BodegasViewModel[] Bodegas { get; set; }

        [BindProperty]
        public InventarioGeneralViewModel[] Reporte { get; set; }

        [BindProperty]
        public InventarioGeneralOrdenesViewModel[] ReporteO { get; set; }

        public IndexModel(ICrudApi<FamiliasViewModel, int> serviceF, ICrudApi<BodegasViewModel, int> serviceB, ICrudApi<InventarioGeneralViewModel, int> service, ICrudApi<InventarioGeneralOrdenesViewModel, int> serviceO)
        {
            this.serviceF = serviceF;
            this.serviceB = serviceB;
            this.service = service;
            this.serviceO = serviceO;
        }

        public async Task<IActionResult> OnGetAsync()
        {
            try
            {
                var Roles1 = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles1.Where(a => a == "127").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }


                Familias = await serviceF.ObtenerLista("");
                Bodegas = await serviceB.ObtenerLista("");

                filtro.strCodigo1 = "";
                foreach (var item in filtro.seleccionMultipleString2)
                {
                    filtro.strCodigo1 += item + "|";
                }


                filtro.strCodigo2 = "";
                foreach (var item in filtro.seleccionMultipleString)
                {
                    filtro.strCodigo2 += item + "|";
                }

                if (!string.IsNullOrEmpty(filtro.Texto) || !string.IsNullOrEmpty(filtro.Texto2) || !string.IsNullOrEmpty(filtro.strCodigo1) || !string.IsNullOrEmpty(filtro.strCodigo2))
                {

                    Reporte = await service.ObtenerLista(filtro);
                    ReporteO = await serviceO.ObtenerLista(filtro);
                }
                else
                {
                    Reporte = new InventarioGeneralViewModel[1];
                    Reporte[0] = new InventarioGeneralViewModel();

                    ReporteO = new InventarioGeneralOrdenesViewModel[1];
                    ReporteO[0] = new InventarioGeneralOrdenesViewModel();
                }
            }
            catch (ApiException ex)
            {


            }
            catch (Exception ex)
            {


            }
            return Page();
        }
    }
}
