using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using NOVAAPP.Models;
using Sicsoft.Checkin.Web.Servicios;
using System.Security.Claims;
using System.Threading.Tasks;
using System;
using System.Linq;
using Refit;

namespace NOVAAPP.Pages.Traslados
{
    public class ObservarModel : PageModel
    {
        private readonly ICrudApi<EncTrasladosViewModel, int> service;
        private readonly ICrudApi<UsuariosViewModel, int> serviceU;
        private readonly ICrudApi<BodegasViewModel, int> bodegas;
        private readonly ICrudApi<ProductosTrasladosViewModel, int> productos;
        private readonly ICrudApi<EstadosLotesViewModel, int> serviceE;
        private readonly ICrudApi<RutasViewModel, int> rutas;
        private readonly ICrudApi<FlotillaViewModel, int> flotillas;
        private readonly ICrudApi<ChoferesViewModel, int> choferes;


        [BindProperty]
        public EncTrasladosViewModel Listas { get; set; }
        [BindProperty]
        public UsuariosViewModel[] Users { get; set; }

        [BindProperty]
        public string Userid { get; set; }

        [BindProperty]
        public BodegasViewModel[] Bodega { get; set; }

        [BindProperty]
        public ProductosTrasladosViewModel Productos { get; set; }

        [BindProperty]
        public EstadosLotesViewModel[] EstadosLotes { get; set; }

        [BindProperty]
        public RutasViewModel[] RutasLista { get; set; }

        [BindProperty]
        public FlotillaViewModel[] FlotillaLista { get; set; }

        [BindProperty]
        public ChoferesViewModel[] ChoferesLista { get; set; }

        [BindProperty]
        public string Empresa { get; set; }
        public ObservarModel(ICrudApi<EncTrasladosViewModel, int> service, ICrudApi<UsuariosViewModel, int> serviceU, ICrudApi<BodegasViewModel, int> bodegas, ICrudApi<ProductosTrasladosViewModel, int> productos, ICrudApi<EstadosLotesViewModel, int> serviceE, ICrudApi<FlotillaViewModel, int> flotillas, ICrudApi<ChoferesViewModel, int> choferes, ICrudApi<RutasViewModel, int> rutas)
        {
            this.service = service;
            this.serviceU = serviceU;
            this.bodegas = bodegas;
            this.productos = productos;
            this.serviceE = serviceE;
            this.rutas = rutas;
            this.flotillas = flotillas;
            this.choferes = choferes;
        }
        public async Task<IActionResult> OnGetAsync(int id)
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "87").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
                Empresa = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Empresa").Select(s1 => s1.Value).FirstOrDefault();
                Listas = await service.ObtenerPorId(id);
                Users = await serviceU.ObtenerLista("");
                EstadosLotes = await serviceE.ObtenerLista("");

                Bodega = await bodegas.ObtenerLista("");
                Productos = await productos.ObtenerListaEspecial("");
                RutasLista = await rutas.ObtenerLista("");
                FlotillaLista = await flotillas.ObtenerLista("");
                ChoferesLista = await choferes.ObtenerLista("");


                return Page();
            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, ex.Message);
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
            catch (Exception ex)
            {
                return new JsonResult(false);
            }
        }
    }
}
