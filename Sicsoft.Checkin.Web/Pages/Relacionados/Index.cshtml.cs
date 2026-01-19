using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using NOVAAPP.Models;
using Refit;
using Sicsoft.Checkin.Web.Servicios;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace NOVAAPP.Pages.Relacionados
{
    public class IndexModel : PageModel
    {
        private readonly IConfiguration configuration;
        private readonly ICrudApi<EncRelacionadosViewModel, int> service;
        private readonly ICrudApi<CategoriasViewModel, int> categorias;

        [BindProperty(SupportsGet = true)]
        public ParametrosFiltros filtro { get; set; }

        [BindProperty]
        public EncRelacionadosViewModel[] Objeto { get; set; }


        [BindProperty]
        public CategoriasViewModel[] Categoria { get; set; }

        public IndexModel(ICrudApi<EncRelacionadosViewModel, int> service, ICrudApi<CategoriasViewModel, int> categorias)
        {
            this.service = service;
            this.categorias = categorias;

        }
        public async Task<IActionResult> OnGetAsync()
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "124").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
                Categoria = await categorias.ObtenerLista("");

                Objeto = await service.ObtenerLista("");
             


                // Productos = await productos.ObtenerLista(filtro);
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
