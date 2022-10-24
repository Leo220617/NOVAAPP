using Castle.Core.Configuration;
using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using NOVAAPP.Models;
using Refit;
using Sicsoft.Checkin.Web.Servicios;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace NOVAAPP.Pages.CuentasBancarias
{
        public class IndexModel : PageModel
        {
            private readonly IConfiguration configuration;
            private readonly ICrudApi<CuentasBancariasViewModel, int> service;

         private readonly ICrudApi<SucursalesViewModel, string> sucursales;

        [BindProperty]
        public SucursalesViewModel[] SucursalesLista { get; set; }

        [BindProperty(SupportsGet = true)]
            public ParametrosFiltros filtro { get; set; }

            [BindProperty]
            public CuentasBancariasViewModel[] Objeto { get; set; }

            public IndexModel(ICrudApi<CuentasBancariasViewModel, int> service, ICrudApi<SucursalesViewModel, string> sucursales)
            {
                this.service = service;
              this.sucursales = sucursales;
            }
            public async Task<IActionResult> OnGetAsync()
            {
                try
                {
                    var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                    if (string.IsNullOrEmpty(Roles.Where(a => a == "41").FirstOrDefault()))
                    {
                        return RedirectToPage("/NoPermiso");
                    }
                    Objeto = await service.ObtenerLista(filtro);
                    SucursalesLista = await sucursales.ObtenerLista("");

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

