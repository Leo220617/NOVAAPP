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

namespace NOVAAPP.Pages.BitacoraMovimientos
{
    public class ObservarModel : PageModel
    {
        private readonly ICrudApi<BitacoraMovimientosViewModel, int> service;
        private readonly ICrudApi<UsuariosViewModel, int> users;



        [BindProperty(SupportsGet = true)]
        public ParametrosFiltros filtro { get; set; }

        [BindProperty]
        public BitacoraMovimientosViewModel Movimiento { get; set; }


        [BindProperty]
        public UsuariosViewModel[] Users { get; set; }

        public ObservarModel(ICrudApi<BitacoraMovimientosViewModel, int> service, ICrudApi<UsuariosViewModel, int> users)
        {
            this.service = service;
            this.users = users;
        }

        public async Task<IActionResult> OnGetAsync(int id)
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "39").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
                Movimiento = await service.ObtenerPorId(id);
                Users = await users.ObtenerLista("");
               

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