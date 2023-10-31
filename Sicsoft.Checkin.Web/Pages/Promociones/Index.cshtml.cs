using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using NOVAAPP.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Refit;
using Sicsoft.Checkin.Web.Servicios;

using NOVAAPP.Models;
using InversionGloblalWeb.Models;
using System.Text.RegularExpressions;

namespace NOVAAPP.Pages.Promociones
{
    public class IndexModel : PageModel
    {
        private readonly IConfiguration configuration;
        private readonly ICrudApi<PromocionesViewModel, int> service;
        private readonly ICrudApi<ListaPreciosViewModel, int> listas;
        private readonly ICrudApi<ProductosViewModel, string> productos;
        private readonly ICrudApi<CategoriasViewModel, int> categorias;
        [BindProperty(SupportsGet = true)]
        public ParametrosFiltros filtro { get; set; }

        [BindProperty]
        public PromocionesViewModel[] Objeto { get; set; }


        [BindProperty]
        public ListaPreciosViewModel[] ListaPrecio { get; set; }

        [BindProperty]
        public ProductosViewModel[] Productos { get; set; }

        [BindProperty]
        public CategoriasViewModel[] Categorias { get; set; }
        public IndexModel(ICrudApi<PromocionesViewModel, int> service, ICrudApi<ListaPreciosViewModel, int> listas, ICrudApi<ProductosViewModel, string> productos, ICrudApi<CategoriasViewModel, int> categorias)
        {
            this.service = service;
            this.listas = listas;
            this.productos = productos;
            this.categorias = categorias;
        }
        public async Task<IActionResult> OnGetAsync()
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "50").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
                DateTime time = new DateTime();

                if (time == filtro.FechaInicial)
                {


                    filtro.FechaInicial = DateTime.Now;

                    //filtro.FechaInicial = new DateTime(filtro.FechaInicial.Year, filtro.FechaInicial.Month, 1);


                    DateTime primerDia = new DateTime(filtro.FechaInicial.Year, filtro.FechaInicial.Month, 1);


                    DateTime ultimoDia = primerDia.AddMonths(1).AddDays(-1);

                    filtro.FechaFinal = DateTime.Now; //ultimoDia;

                    
                   
                }
                Objeto = await service.ObtenerLista(filtro);
                ListaPrecio = await listas.ObtenerLista("");
                Categorias = await categorias.ObtenerLista("");

           


                if ((filtro.Codigo2 == 0 || filtro.Codigo2 == null) && (filtro.Codigo3 == 0 || filtro.Codigo3 == null))
                {
                    filtro.Codigo2 = 0;
                    filtro.Codigo3 = 0;
                }

                if (filtro.Procesado && filtro.Codigo1 == 0 && filtro.Codigo2 == 0)
                {
                    filtro.Codigo2 = ListaPrecio.FirstOrDefault().id;
                    filtro.Codigo3 = Categorias.FirstOrDefault().id;

                    return new RedirectToPageResult("Index", filtro);
                }
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
