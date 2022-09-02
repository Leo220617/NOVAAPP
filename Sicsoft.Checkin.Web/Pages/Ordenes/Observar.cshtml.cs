using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;
using MPOrdenes.Models;
using Newtonsoft.Json;
using Refit;
using Sicsoft.Checkin.Web.Servicios;

namespace MPOrdenes.Pages.Ordenes
{
    public class ObservarModel : PageModel
    {
        private readonly ICrudApi<EncOrdenesCompraViewModel, int> service;
        private readonly ICrudApi<OrdenesViewModel, int> serviceO;
        private readonly ICrudApi<ExistenciasViewModel, int> serviceE;
        private readonly ICrudApi<FabricacionViewModel, int> serviceF;



        [BindProperty]
        public EncOrdenesCompraViewModel Orden { get; set; }

        [BindProperty]
        public OrdenesViewModel Ordenes { get; set; }

        [BindProperty]
        public ExistenciasViewModel Existencias { get; set; }

        public ObservarModel(ICrudApi<EncOrdenesCompraViewModel, int> service, ICrudApi<OrdenesViewModel, int> serviceO, ICrudApi<ExistenciasViewModel, int> serviceE, ICrudApi<FabricacionViewModel, int> serviceF)
        {
            this.service = service;
            this.serviceO = serviceO;
            this.serviceE = serviceE;
            this.serviceF = serviceF;
        }

        public async Task<IActionResult> OnGetAsync(int id)
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "8").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
                var Filt = new ParametrosFiltros();
                Filt.Codigo1 = id;
                Orden = await service.ObtenerPorId(id);
                Ordenes = await serviceO.ObtenerListaEspecial(Filt);
                Existencias = await serviceE.ObtenerListaEspecial(Filt);


                return Page();
            }
            catch (ApiException ex)
            {
                ModelState.AddModelError(string.Empty, ex.Message);
                return Page();
            }
        }

       
    }
}
