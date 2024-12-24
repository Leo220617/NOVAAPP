using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using NOVAAPP.Models;
using Sicsoft.Checkin.Web.Servicios;
using System.Drawing.Printing;
using System;
using System.Linq;
using System.Security.Claims;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Threading;

namespace NOVAAPP.Pages.Aprovisionamiento
{
    public class NuevoModel : PageModel
    {

        private readonly ICrudApi<AprovisionamientoProductosViewModel, int> aprovisionamientoProductos;
        private readonly ICrudApi<CategoriasViewModel, int> categorias;
        private readonly ICrudApi<SubCategoriasViewModel, int> subCategorias;
        private readonly ICrudApi<BodegasViewModel, int> bodegas;

        [BindProperty]
        public AprovisionamientoProductosViewModel AprovisionamientoProductos { get; set; }

        [BindProperty]
        public CategoriasViewModel[] Categorias { get; set; }

        [BindProperty]
        public SubCategoriasViewModel[] SubCategorias { get; set; }

        [BindProperty]
        public BodegasViewModel[] Bodegas { get; set; }

        public NuevoModel(ICrudApi<AprovisionamientoProductosViewModel, int> aprovisionamientoProductos, ICrudApi<CategoriasViewModel, int> categorias, ICrudApi<SubCategoriasViewModel, int> subCategorias, ICrudApi<BodegasViewModel, int> bodegas) //CTOR 
        {
            this.aprovisionamientoProductos = aprovisionamientoProductos; 
            this.categorias = categorias;
            this.subCategorias = subCategorias;
            this.bodegas = bodegas;
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


                Bodegas = await bodegas.ObtenerLista("");
                Categorias = await categorias.ObtenerLista("");
                SubCategorias = await subCategorias.ObtenerLista("");
                //AprovisionamientoProductos = await aprovisionamientoProductos.ObtenerListaEspecial("");




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
