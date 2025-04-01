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
using Sicsoft.Checkin.Web.Servicios;


namespace NOVAAPP.Pages.Rutas
{
    public class NuevoModel : PageModel
    {
        private readonly ICrudApi<FlotillaViewModel, int> serviceF;
        private readonly ICrudApi<RutasViewModel, int> service;

        [BindProperty]
        public FlotillaViewModel[] Flotilla { get; set; }

        [BindProperty]
        public RutasViewModel Ruta { get; set; }

        public NuevoModel(ICrudApi<RutasViewModel, int> service, ICrudApi<FlotillaViewModel, int> serviceF)
        {
            this.service = service;
            this.serviceF = serviceF;
        }
        public async Task<IActionResult> OnGetAsync()
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "102").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
                Flotilla = await serviceF.ObtenerLista("");
                Flotilla = Flotilla.Where(a => a.Estado == "1").ToArray();
                return Page();
            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, ex.Message);
                return Page();
            }
        }
        public async Task<IActionResult> OnPostAsync()
        {
            try
            {
                await service.Agregar(Ruta);
                return RedirectToPage("./Index");
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
    }
}
