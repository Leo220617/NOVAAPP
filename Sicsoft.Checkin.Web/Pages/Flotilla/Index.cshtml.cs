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
using NOVAAPP.Models;
using Refit;
using Sicsoft.Checkin.Web.Models;
using Sicsoft.Checkin.Web.Servicios;

namespace NOVAAPP.Pages.Flotilla
{
    public class IndexModel : PageModel
    {
        private readonly ICrudApi<FlotillaViewModel, int> flotilla;
        private readonly ICrudApi<ChoferesViewModel, int> choferes;

        [BindProperty]
        public FlotillaViewModel[] Flotilla { get; set; }
        [BindProperty]
        public ChoferesViewModel[] Chofer { get; set; }

        [BindProperty(SupportsGet = true)]
        public ParametrosFiltros filtro { get; set; }

        public IndexModel(ICrudApi<FlotillaViewModel, int> flotilla, ICrudApi<ChoferesViewModel, int> choferes)
        {
            this.flotilla = flotilla;
            this.choferes = choferes;
        }

        public async Task<IActionResult> OnGetAsync()
        {
            try
            {
                var Roles1 = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles1.Where(a => a == "9").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }

                Flotilla = await flotilla.ObtenerLista(filtro);
                Chofer = await choferes.ObtenerLista("");


                return Page();
            }
            catch (ApiException ex)
            {
                Errores error = JsonConvert.DeserializeObject<Errores>(ex.Content.ToString());
                ModelState.AddModelError(string.Empty, error.Message);

                return Page();
            }
            catch (Exception ex)
            {
                ModelState.AddModelError(string.Empty, ex.Message);

                return Page();
            }
        }

        public async Task<IActionResult> OnGetEliminar(int id)
        {
            try
            {

                await flotilla.Eliminar(id);
                return new JsonResult(true);
            }
            catch (ApiException ex)
            {
                return new JsonResult(false);
            }
            catch (Exception ex)
            {
                return new JsonResult(false);
            }
        }
    }
}
