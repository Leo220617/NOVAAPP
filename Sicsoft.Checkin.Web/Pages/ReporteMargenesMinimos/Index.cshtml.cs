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

namespace NOVAAPP.Pages.ReporteMargenesMinimos
{
    public class IndexModel : PageModel
    {
        private readonly IConfiguration configuration;
        private readonly ICrudApi<ReporteMargenesViewModel, int> service;
        private readonly ICrudApi<ListaPreciosViewModel, int> listas;
        private readonly ICrudApi<CategoriasViewModel, int> categorias;

        [BindProperty(SupportsGet = true)]
        public ParametrosFiltros filtro { get; set; }

        [BindProperty]
        public ReporteMargenesViewModel[] Objeto { get; set; }


        [BindProperty]
        public ListaPreciosViewModel[] ListaPrecios { get; set; }

        [BindProperty]
        public CategoriasViewModel[] Categorias { get; set; }



        public IndexModel(ICrudApi<ReporteMargenesViewModel, int> service, ICrudApi<ListaPreciosViewModel, int> listas, ICrudApi<CategoriasViewModel, int> categorias)
        {
            this.service = service;
            this.listas = listas;
            this.categorias = categorias;
        }
        public async Task<IActionResult> OnGetAsync()
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "127").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
          
                ListaPrecios = await listas.ObtenerLista("");
                Categorias = await categorias.ObtenerLista("");
                Objeto = await service.ObtenerListaMin(filtro);


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
