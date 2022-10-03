using Castle.Core.Configuration;
using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using NOVAAPP.Models;
using Refit;
using Sicsoft.Checkin.Web.Servicios;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace NOVAAPP.Pages.Exoneraciones
{
    public class IndexModel : PageModel
    {
        private readonly IConfiguration configuration;
        private readonly ICrudApi<ExoneracionesViewModel, int> service;
        private readonly ICrudApi<ClientesViewModel, string> serviceC;


        [BindProperty(SupportsGet = true)]
        public ParametrosFiltros filtro { get; set; }

        [BindProperty]
        public ExoneracionesViewModel[] Objeto { get; set; }
        [BindProperty]
        public ClientesViewModel[] Cliente { get; set; }




        public IndexModel(ICrudApi<ExoneracionesViewModel, int> service, ICrudApi<ClientesViewModel, string> serviceC)
        {
            this.service = service;
            this.serviceC = serviceC;
            

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
                Objeto = await service.ObtenerLista(filtro);
                Cliente = await serviceC.ObtenerLista("");


                return Page();

            }
            catch (ApiException ex)
            {
                Errores error = JsonConvert.DeserializeObject<Errores>(ex.Content.ToString());
                ModelState.AddModelError(string.Empty, error.Message);

                return Page();
            }
        }
        public async Task<IActionResult> OnGetEliminar(int id)
        {
            try
            {

                await service.Eliminar(id);
                return new JsonResult(true);
            }
            catch (ApiException ex)
            {
                return new JsonResult(false);
            }
        }
    }
}


