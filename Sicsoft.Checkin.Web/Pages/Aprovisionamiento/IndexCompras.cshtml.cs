using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using NOVAAPP.Models;
using Refit;
using Sicsoft.Checkin.Web.Servicios;
using System.Security.Claims;
using System.Threading.Tasks;
using System;
using System.Linq;

namespace NOVAAPP.Pages.Aprovisionamiento
{
    public class IndexComprasModel : PageModel
    {
        private readonly ICrudApi<EncComprasViewModel, int> service;
        private readonly ICrudApi<UsuariosViewModel, int> serviceU;



        [BindProperty]
        public EncComprasViewModel[] Compras { get; set; }

        [BindProperty]
        public UsuariosViewModel[] Users { get; set; }


        [BindProperty(SupportsGet = true)]
        public ParametrosFiltros filtro { get; set; }
        public IndexComprasModel(ICrudApi<EncComprasViewModel, int> service, ICrudApi<UsuariosViewModel, int> serviceU) //CTOR 
        {
            this.service = service;
            this.serviceU   = serviceU;

        }

        public async Task<IActionResult> OnGetAsync(int id)
        {
            try
            {
                var Roles1 = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles1.Where(a => a == "82").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
                filtro.Codigo1 = id;
                Compras = await service.ObtenerLista(filtro);
                Users = await serviceU.ObtenerLista("");
  
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
        public async Task<IActionResult> OnGetSincronizarSAP(int idCompra)
        {
            try
            {

                await service.SincronizarSAP(idCompra);
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
