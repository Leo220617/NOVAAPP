using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using NOVAAPP.Models;
using Sicsoft.Checkin.Web.Servicios;
using System.Security.Claims;
using System.Threading.Tasks;
using System;
using System.Linq;
using InversionGloblalWeb.Models;
using Refit;
using Newtonsoft.Json;

namespace NOVAAPP.Pages.Margenes
{
    public class ObservarModel : PageModel
    {

        private readonly ICrudApi<EncMargenesViewModel, int> service; //API
        private readonly ICrudApi<ProductosViewModel, string> productos;
        private readonly ICrudApi<ListaPreciosViewModel, int> precios;
        private readonly ICrudApi<CategoriasViewModel, int> categorias;
        private readonly ICrudApi<TipoCambiosViewModel, int> tipoCambio;

        [BindProperty]
        public EncMargenesViewModel[] Lista { get; set; }

        [BindProperty]
        public EncMargenesViewModel ListaX { get; set; }

        [BindProperty]
        public object Productos { get; set; }

        [BindProperty]
        public CategoriasViewModel[] Categoria { get; set; }

        [BindProperty]
        public ListaPreciosViewModel[] Precios { get; set; }

        [BindProperty]
        public TipoCambiosViewModel[] TP { get; set; }

        public ObservarModel(ICrudApi<EncMargenesViewModel, int> service, ICrudApi<ProductosViewModel, string> productos, ICrudApi<ListaPreciosViewModel, int> precios, ICrudApi<CategoriasViewModel, int> categorias, ICrudApi<TipoCambiosViewModel, int> tipoCambio) //CTOR 
        {
            this.service = service;
            this.productos = productos;
            this.precios = precios;
            this.categorias = categorias;
            this.tipoCambio = tipoCambio;

        }
        public async Task<IActionResult> OnGetAsync(int idListaPrecio, int idCategoria, string Moneda)
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "65").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }


                ListaX = await service.ObtenerMargen(idListaPrecio, idCategoria, Moneda);
                Precios = await precios.ObtenerLista("");

                Categoria = await categorias.ObtenerLista("");
                ParametrosFiltros filtro = new ParametrosFiltros();


                var Productos1 = await productos.ObtenerLista(filtro);

                Productos = Productos1.Select(a => new
                {
                    a.Codigo,
                    a.idCategoria,
                    a.idImpuesto,
                    a.idListaPrecios,
                    a.Nombre,
                    a.Moneda,
                    a.PrecioUnitario,
                    a.UnidadMedida,
                    a.Cabys,
                    a.TipoCod,
                    a.CodBarras,
                    a.Costo,
                    a.Activo

                }).Distinct().ToList();

                ParametrosFiltros filtro2 = new ParametrosFiltros();

                Lista = await service.ObtenerLista(filtro2);
                filtro.FechaInicial = DateTime.Now.Date;
                TP = await tipoCambio.ObtenerLista(filtro);

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
