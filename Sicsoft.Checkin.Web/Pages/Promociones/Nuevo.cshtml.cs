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

namespace NOVAAPP.Pages.Promociones
{
    public class NuevoModel : PageModel
    {

        private readonly ICrudApi<EncPromocionesViewModel, int> service; //API
        private readonly ICrudApi<ProductosViewModel, string> productos;
        private readonly ICrudApi<ListaPreciosViewModel, int> precios;
        private readonly ICrudApi<CategoriasViewModel, int> categorias;
        private readonly ICrudApi<TipoCambiosViewModel, int> tipoCambio;
        private readonly ICrudApi<ClientesViewModel, string> clientes;
        private readonly ICrudApi<ParametrosViewModel, int> param;


        [BindProperty]
        public EncPromocionesViewModel[] Lista { get; set; }

        [BindProperty]
        public EncPromocionesViewModel ListaX { get; set; }

        [BindProperty]
        public object Productos { get; set; }

        [BindProperty]
        public CategoriasViewModel[] Categoria { get; set; }

        [BindProperty]
        public ListaPreciosViewModel[] Precios { get; set; }


        [BindProperty]
        public ClientesViewModel[] Clientes { get; set; }




        [BindProperty]
        public TipoCambiosViewModel[] TP { get; set; }


        [BindProperty]
        public ParametrosViewModel[] Parametros { get; set; }

        public NuevoModel(ICrudApi<EncPromocionesViewModel, int> service, ICrudApi<ParametrosViewModel, int> param, ICrudApi<ProductosViewModel, string> productos, ICrudApi<ListaPreciosViewModel, int> precios, ICrudApi<CategoriasViewModel, int> categorias, ICrudApi<TipoCambiosViewModel, int> tipoCambio, ICrudApi<ClientesViewModel, string> clientes) //CTOR 
        {
            this.service = service;
            this.productos = productos;
            this.precios = precios;
            this.categorias = categorias;
            this.tipoCambio = tipoCambio;
            this.clientes = clientes;
            this.param = param;


        }
        public async Task<IActionResult> OnGetAsync()
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "64").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }



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
                Parametros = await param.ObtenerLista("");
                if (Parametros.FirstOrDefault().Pais == "P")
                {
                    TP = await tipoCambio.ObtenerLista(filtro);
                    if (TP == null)
                    {
                        TP = new TipoCambiosViewModel[1];
                        var TipodeCambio = new TipoCambiosViewModel();
                        TipodeCambio.Moneda = "USD";
                        TipodeCambio.TipoCambio = 0;
                        TP[0] = TipodeCambio;
                    }
                }
                else
                {
                    TP = await tipoCambio.ObtenerLista(filtro);

                }
                filtro.Externo = true;
                filtro.Activo = true;
                Clientes = await clientes.ObtenerLista(filtro);
                //ClientesPromociones = await promoC.ObtenerLista("");
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

                    var objeto = objetos.Select(a => new
                    {
                        a.id,
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
                        a.Stock,
                        a.Activo,
                        a.ProcesadoSAP,
                        a.FechaActualizacion,
                        a.MAG,
                        a.Serie

                    }).Distinct().ToList();



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

        public async Task<IActionResult> OnPostAgregarPromocion(EncPromocionesViewModel recibidos)
        {
            string error = "";


            try
            {
                recibidos.idUsuarioCreador = Convert.ToInt32(((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == ClaimTypes.Actor).Select(s1 => s1.Value).FirstOrDefault().ToString());
                var resp = await service.Agregar(recibidos);

                var resp2 = new
                {
                    success = true,
                    ListaX = resp
                };
                return new JsonResult(resp2);
            }
            catch (ApiException ex)
            {
                BitacoraErroresViewModel be = JsonConvert.DeserializeObject<BitacoraErroresViewModel>(ex.Content.ToString());
                var resp2 = new
                {
                    success = false,
                    ListaX = be.Descripcion
                };
                return new JsonResult(resp2);

            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, ex.Message);
                var resp2 = new
                {
                    success = false,
                    Promocion = ex.Message
                };
                return new JsonResult(resp2);
            }
        }
    }
}
