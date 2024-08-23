using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using NOVAAPP.Models;
using Sicsoft.Checkin.Web.Servicios;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace NOVAAPP.Pages.Exoneraciones
{
    public class ObservarModel : PageModel
    {
        private readonly ICrudApi<ExoneracionesViewModel, int> service; //API
        private readonly ICrudApi<ClientesViewModel, string> serviceC;
        private readonly ICrudApi<CabysViewModel, int> cabys;

        [BindProperty]
        public ExoneracionesViewModel Exoneracion { get; set; }
        [BindProperty]
        public ClientesViewModel[] Cliente { get; set; }
        [BindProperty]
        public CabysViewModel[] Cabys { get; set; }

        public ObservarModel(ICrudApi<ExoneracionesViewModel, int> service, ICrudApi<ClientesViewModel, string> serviceC, ICrudApi<CabysViewModel, int> cabys) //CTOR 
        {
            this.service = service;
            this.serviceC = serviceC;
            this.cabys = cabys;

        }
        public async Task<IActionResult> OnGetAsync(int id)
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "14").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
                Exoneracion = await service.ObtenerPorId(id);
                Exoneracion.ImagenBase64 = Convert.ToBase64String(Exoneracion.Imagen)
                            .Replace("&#x2B;", "")
                            .Replace("#&;", "");
                ParametrosFiltros filtro = new ParametrosFiltros();
                filtro.Externo = true;
                Cliente = await serviceC.ObtenerLista(filtro);
                Cabys = await cabys.ObtenerLista("");

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
