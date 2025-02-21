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

namespace NOVAAPP.Pages.SubCategorias
{
    public class IndexModel : PageModel
    {
        private readonly ICrudApi<SubCategoriasViewModel, int> service;
        private readonly ICrudApi<CategoriasViewModel, int> categorias;

        [BindProperty]
        public CategoriasViewModel[] Categorias { get; set; }

        [BindProperty]
        public SubCategoriasViewModel[] Objeto { get; set; }

        [BindProperty(SupportsGet = true)]
        public ParametrosFiltros filtro { get; set; }
        public IndexModel(ICrudApi<SubCategoriasViewModel, int> service, ICrudApi<CategoriasViewModel, int> categorias)
        {
            this.service = service;
            this.categorias = categorias;
        }
        public async Task<IActionResult> OnGetAsync()
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "77").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
                Categorias = await categorias.ObtenerLista("");
                filtro.Externo = true;
                
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
        public async Task<IActionResult> OnGetSincronizarSAP(int id)
        {
            try
            {

                await service.SincronizarSAP(id);
                return new JsonResult(true);
            }
            catch (ApiException ex)
            {
                return new JsonResult(false);
            }
        }

    }
}
