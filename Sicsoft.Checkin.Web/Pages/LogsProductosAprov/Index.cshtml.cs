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

namespace NOVAAPP.Pages.LogsProductosAprov
{
    public class IndexModel : PageModel
    {
        private readonly ICrudApi<LogsProductosAprovViewModel, int> service;
        private readonly ICrudApi<SubCategoriasViewModel, int> subCategorias;
        private readonly ICrudApi<CategoriasViewModel, int> categorias;
        private readonly ICrudApi<UsuariosViewModel, int> usuarios;
   

        [BindProperty]
        public CategoriasViewModel[] Categorias { get; set; }

        [BindProperty]
        public LogsProductosAprovViewModel[] Objeto { get; set; }


        [BindProperty]
        public SubCategoriasViewModel[] SubCategorias { get; set; }


        [BindProperty]
        public UsuariosViewModel[] Usuarios { get; set; }




        [BindProperty(SupportsGet = true)]
        public ParametrosFiltros filtro { get; set; }

     

        public IndexModel(ICrudApi<LogsProductosAprovViewModel, int> service, ICrudApi<CategoriasViewModel, int> categorias, ICrudApi<SubCategoriasViewModel, int> subCategorias, ICrudApi<UsuariosViewModel, int> usuarios)
        {
            this.service = service;
            this.categorias = categorias;
            this.subCategorias = subCategorias; 
            this.usuarios = usuarios;   
    
        }
        public async Task<IActionResult> OnGetAsync()
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "78").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
                Categorias = await categorias.ObtenerLista("");
                SubCategorias = await subCategorias.ObtenerLista("");
                Usuarios = await usuarios.ObtenerLista("");

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
    }
}
