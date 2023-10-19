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

namespace NOVAAPP.Pages.ListaPrecios
{
    public class PrecioXListaModel : PageModel
    {

        private readonly ICrudApi<PrecioXListaViewModel, int> service; //API
        private readonly ICrudApi<ProductosViewModel, string> productos;
        private readonly ICrudApi<ListaPreciosViewModel, int> precios;
        private readonly ICrudApi<BodegasViewModel, int> bodegas;

        [BindProperty]
        public PrecioXListaViewModel[] Lista { get; set; }

        [BindProperty]
        public PrecioXListaViewModel ListaX { get; set; }

        [BindProperty]
        public ProductosViewModel[] Productos { get; set; }

        [BindProperty]
        public BodegasViewModel[] Bodega { get; set; }

        [BindProperty]
        public ListaPreciosViewModel Precios { get; set; }

        public PrecioXListaModel(ICrudApi<PrecioXListaViewModel, int> service, ICrudApi<ProductosViewModel, string> productos, ICrudApi<ListaPreciosViewModel, int> precios, ICrudApi<BodegasViewModel, int> bodegas) //CTOR 
        {
            this.service = service;
            this.productos = productos;
            this.precios = precios;
            this.bodegas = bodegas;
        }
        public async Task<IActionResult> OnGetAsync(int id)
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "14").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
                Precios =  await precios.ObtenerPorId(id);
                ParametrosFiltros filtro = new ParametrosFiltros();
                filtro.Codigo2 = Precios.id;
                Productos = await productos.ObtenerLista(filtro);
                Bodega = await bodegas.ObtenerLista("");
                ParametrosFiltros filtro2 = new ParametrosFiltros();
                filtro2.Codigo1 = Precios.id;
                Lista = await service.ObtenerLista(filtro2);
              
                return Page();
            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, ex.Message);
                return Page();
            }
        }
        public async Task<IActionResult> OnGetProductos(int idLista)
        {
            try
            {


                if (idLista > 0)
                {
                    ParametrosFiltros filtros = new ParametrosFiltros();
                    filtros.Codigo2 = idLista;

                    var objetos = await productos.ObtenerLista(filtros);

                    var objeto = objetos.ToList();



                    return new JsonResult(objeto);
                }
                else
                {
                    var objeto = new ProductosViewModel[0];



                    return new JsonResult(objeto);
                }

            }
            catch (ApiException ex)
            {



                return new JsonResult(ex.Content.ToString());
            }
            catch (Exception ex)
            {



                return new JsonResult(ex.Message.ToString());
            }
        }
    }
}
