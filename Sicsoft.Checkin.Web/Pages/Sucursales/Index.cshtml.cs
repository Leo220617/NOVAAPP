using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using NOVAAPP.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Refit;
using Sicsoft.Checkin.Web.Servicios;

using NOVAAPP.Models;
using InversionGloblalWeb.Models;

namespace NOVAAPP.Pages.Sucursales
{
    public class IndexModel : PageModel
    {
        private readonly IConfiguration configuration;
        private readonly ICrudApi<SucursalesViewModel, string> service;
        private readonly ICrudApi<ListaPreciosViewModel, int> precios;

        [BindProperty(SupportsGet = true)]
        public ParametrosFiltros filtro { get; set; }

        [BindProperty]
        public SucursalesViewModel[] Objeto { get; set; }


        [BindProperty]
        public ListaPreciosViewModel[] Precio { get; set; }

        public IndexModel(ICrudApi<SucursalesViewModel, string> service, ICrudApi<ListaPreciosViewModel, int> precios)
        {
            this.service = service;
            this.precios = precios;
        }
        public async Task<IActionResult> OnGetAsync()
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "16").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
                Objeto = await service.ObtenerLista(filtro);
                Precio = await precios.ObtenerLista("");


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


