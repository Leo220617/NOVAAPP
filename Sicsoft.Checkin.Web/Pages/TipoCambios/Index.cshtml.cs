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

namespace NOVAAPP.Pages.TipoCambios
{
    public class IndexModel : PageModel
    {
        private readonly IConfiguration configuration;
        private readonly ICrudApi<TipoCambiosViewModel, int> service;


        [BindProperty(SupportsGet = true)]
        public ParametrosFiltros filtro { get; set; }

        [BindProperty]
        public TipoCambiosViewModel[] Objeto { get; set; }

        public IndexModel(ICrudApi<TipoCambiosViewModel, int> service)
        {
            this.service = service;
        }

        public async Task<IActionResult> OnGetAsync()
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "30").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
                Objeto = await service.ObtenerLista(filtro);


                return Page();
            }
            catch (ApiException ex)
            {
                Errores error = JsonConvert.DeserializeObject<Errores>(ex.Content.ToString());
                ModelState.AddModelError(string.Empty, error.Message);

                return Page();
            }
        }
        public async Task<IActionResult> OnGetInsertarSAP()
        {
            try
            {

                await service.InsertarSAP();
                return new JsonResult(true);
            }
            catch (Exception ex)
            {
                return new JsonResult(false);
            }
        }
    }
}

