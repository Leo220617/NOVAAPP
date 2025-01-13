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

    public class ObservarModel : PageModel
    {
        private readonly ICrudApi<AprovisionamientoViewModel, int> service;
        private readonly ICrudApi<CategoriasViewModel, int> categorias;
        private readonly ICrudApi<SubCategoriasViewModel, int> subCategorias;
        private readonly ICrudApi<UsuariosViewModel, int> usuarios;
        private readonly ICrudApi<SucursalesViewModel, string> sucursales;


        [BindProperty]
        public AprovisionamientoViewModel Aprovisionamiento { get; set; }


        [BindProperty]
        public CategoriasViewModel[] Categorias { get; set; }

        [BindProperty]
        public SubCategoriasViewModel[] SubCategorias { get; set; }

        [BindProperty]
        public UsuariosViewModel[] Usuarios { get; set; }

        [BindProperty(SupportsGet = true)]
        public ParametrosFiltros filtro { get; set; }

        [BindProperty]
        public string NombreCliente { get; set; }


        [BindProperty]
        public SucursalesViewModel[] Sucursal { get; set; }

        public ObservarModel(ICrudApi<AprovisionamientoViewModel, int> service, ICrudApi<SucursalesViewModel, string> sucursales,ICrudApi<CategoriasViewModel, int> categorias, ICrudApi<SubCategoriasViewModel, int> subCategorias, ICrudApi<UsuariosViewModel, int> usuarios) //CTOR 
        {
            this.service = service;
            this.categorias = categorias;
            this.subCategorias = subCategorias;
            this.usuarios = usuarios;
            this.sucursales = sucursales;

        }
        public async Task<IActionResult> OnGetAsync(int id)
        {
            try
            {
                var Roles1 = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles1.Where(a => a == "80").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
                Aprovisionamiento = await service.ObtenerPorId(id);
                Categorias = await categorias.ObtenerLista("");
                filtro.Codigo1 = Aprovisionamiento.idCategoria;
                SubCategorias = await subCategorias.ObtenerLista(filtro);
                Usuarios = await usuarios.ObtenerLista("");
                NombreCliente = "NUEVA AGRICULTURA NOVAGRO SA.";
                Sucursal = await sucursales.ObtenerLista("");

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
    }
}
