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

namespace NOVAAPP.Pages.Clientes
{
    public class ObservarModel : PageModel
    {
        private readonly IConfiguration configuration;
        private readonly ICrudApi<ClientesViewModel, string> service;
        private readonly ICrudApi<CantonesViewModel, int> serviceC;
        private readonly ICrudApi<DistritosViewModel, int> serviceD;
        private readonly ICrudApi<BarriosViewModel, int> serviceB;
        private readonly ICrudApi<ListaPreciosViewModel, int> precio;
        private readonly ICrudApi<CondicionesPagosViewModel, int> condicion;
        private readonly ICrudApi<GruposClientesViewModel, int> grupos;

        [BindProperty(SupportsGet = true)]
        public ParametrosFiltros filtro { get; set; }

        [BindProperty]
        public ClientesViewModel Cliente { get; set; }


        [BindProperty]
        public CantonesViewModel[] Cantones { get; set; }

        [BindProperty]
        public DistritosViewModel[] Distritos { get; set; }

        [BindProperty]
        public BarriosViewModel[] Barrios { get; set; }
        [BindProperty]
        public ListaPreciosViewModel[] PrecioLista { get; set; }

        [BindProperty]
        public CondicionesPagosViewModel[] Condiciones { get; set; }

        [BindProperty]
        public GruposClientesViewModel[] Grupos { get; set; }

        public ObservarModel(ICrudApi<ClientesViewModel, string> service, ICrudApi<CantonesViewModel, int> serviceC, ICrudApi<DistritosViewModel, int> serviceD, ICrudApi<BarriosViewModel, int> serviceB, ICrudApi<ListaPreciosViewModel, int> precio, ICrudApi<CondicionesPagosViewModel, int> condicion, ICrudApi<GruposClientesViewModel, int> grupos)
        {
            this.service = service;
            this.serviceC = serviceC;
            this.serviceD = serviceD;
            this.serviceB = serviceB;
            this.precio = precio;
            this.condicion = condicion;
            this.grupos = grupos;
        }
        public async Task<IActionResult> OnGetAsync(string id)
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "27").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
                Cliente = await service.ObtenerPorIdString(id);
                Cantones = await serviceC.ObtenerLista("");
                Distritos = await serviceD.ObtenerLista("");
                Barrios = await serviceB.ObtenerLista("");
                PrecioLista = await precio.ObtenerLista("");
                Condiciones = await condicion.ObtenerLista("");
                Grupos = await grupos.ObtenerLista("");

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
