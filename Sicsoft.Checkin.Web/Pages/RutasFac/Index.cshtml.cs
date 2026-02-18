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

namespace NOVAAPP.Pages.RutasFac
{
    public class IndexModel : PageModel
    {
        private readonly ICrudApi<RutasFacViewModel, int> rutas;
        private readonly ICrudApi<SucursalesViewModel, string> sucursales;
        [BindProperty]
        public RutasFacViewModel[] RutasFac { get; set; }

        [BindProperty]
        public SucursalesViewModel[] Sucursales { get; set; }


        [BindProperty(SupportsGet = true)]
        public ParametrosFiltros filtro { get; set; }

        public IndexModel(ICrudApi<RutasFacViewModel, int> rutas, ICrudApi<SucursalesViewModel, string> sucursales)
        {
            this.rutas = rutas;
            this.sucursales = sucursales;
        }

        public async Task<IActionResult> OnGetAsync()
        {
            try
            {
                var Roles1 = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles1.Where(a => a == "129").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }

                RutasFac = await rutas.ObtenerLista(filtro);
                Sucursales = await sucursales.ObtenerLista("");


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

                await rutas.Eliminar(id);
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
