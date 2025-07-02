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

namespace NOVAAPP.Pages.Margenes
{
    public class IndexModel : PageModel
    {
        private readonly IConfiguration configuration;
        private readonly ICrudApi<EncMargenesViewModel, int> service;
        private readonly ICrudApi<ListaPreciosViewModel, int> listas;
        private readonly ICrudApi<CategoriasViewModel, int> categorias;

        [BindProperty(SupportsGet = true)]
        public ParametrosFiltros filtro { get; set; }

        [BindProperty]
        public EncMargenesViewModel[] Objeto { get; set; }


        [BindProperty]
        public ListaPreciosViewModel[] ListaPrecio { get; set; }

        [BindProperty]
        public CategoriasViewModel[] Categoria { get; set; }

        public IndexModel(ICrudApi<EncMargenesViewModel, int> service, ICrudApi<ListaPreciosViewModel, int> listas, ICrudApi<CategoriasViewModel, int> categorias)
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
                if (string.IsNullOrEmpty(Roles.Where(a => a == "65").FirstOrDefault()))
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

                    filtro.FechaFinal = ultimoDia; //ultimoDia;



                }
                Objeto = await service.ObtenerLista(filtro);
                ListaPrecio = await listas.ObtenerLista("");
                Categoria = await categorias.ObtenerLista("");


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

        public async Task<IActionResult> OnGetInsertarMargenes(int idListaPrecio, int idCategoria, string Moneda)
        {
            try
            {

                await service.InsertarMargenes(idListaPrecio, idCategoria, Moneda);
                return new JsonResult(true);
            }
            catch (ApiException ex)
            {
                return new JsonResult(false);
            }
        }

        public async Task<IActionResult> OnGetDuplicarMargenes(int idListaPrecio, int idCategoria, string Moneda)
        {
            try
            {

                await service.DuplicarMargenes(idListaPrecio, idCategoria, Moneda);
                return new JsonResult(true);
            }
            catch (ApiException ex)
            {
                return new JsonResult(false);
            }
        }
    }
}
