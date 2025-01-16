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
using System;

namespace NOVAAPP.Pages.Aprovisionamiento
{
    public class IndexModel : PageModel
    {
        private readonly ICrudApi<AprovisionamientoViewModel, int> service;
        private readonly ICrudApi<UsuariosViewModel, int> serviceU;
        private readonly ICrudApi<CategoriasViewModel, int> categorias;
        private readonly ICrudApi<SubCategoriasViewModel, int> subCategorias;



        [BindProperty]
        public AprovisionamientoViewModel[] Listas { get; set; }

        [BindProperty]
        public UsuariosViewModel[] Users { get; set; }

        [BindProperty]
        public CategoriasViewModel[] Categorias { get; set; }

        [BindProperty]
        public SubCategoriasViewModel[] SubCategorias { get; set; }


        [BindProperty(SupportsGet = true)]
        public ParametrosFiltros filtro { get; set; }
        public IndexModel(ICrudApi<AprovisionamientoViewModel, int> service, ICrudApi<UsuariosViewModel, int> serviceU, ICrudApi<CategoriasViewModel, int> categorias, ICrudApi<SubCategoriasViewModel, int> subCategorias)
        {
            this.service = service;
            this.serviceU = serviceU;
            this.subCategorias = subCategorias;
            this.categorias = categorias;
  

        }
        public async Task<IActionResult> OnGetAsync()
        {
            try
            {
                var Roles1 = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles1.Where(a => a == "80").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
                DateTime time = new DateTime();

                if (time == filtro.FechaInicial)
                {


                    filtro.FechaInicial = DateTime.Now;

                    filtro.FechaInicial = new DateTime(filtro.FechaInicial.Year, filtro.FechaInicial.Month, 1);


                    DateTime primerDia = new DateTime(filtro.FechaInicial.Year, filtro.FechaInicial.Month, 1);


                    DateTime ultimoDia = primerDia.AddMonths(1).AddDays(-1);

                    filtro.FechaFinal = ultimoDia;


                    filtro.Codigo1 = 0;
                    filtro.Codigo2 = 0;
                    filtro.Codigo3 = 0;

                    filtro.espera = true;




                }


                Listas = await service.ObtenerLista(filtro);
                Categorias = await categorias.ObtenerLista("");
                SubCategorias = await subCategorias.ObtenerLista("");

                Users = await serviceU.ObtenerLista("");
                Users = Users.Where(a => a.novapos == false).ToArray();






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
