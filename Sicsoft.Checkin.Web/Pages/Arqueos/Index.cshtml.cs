using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using NOVAAPP.Models;

using Refit;
using Sicsoft.Checkin.Web.Servicios;
using Sicsoft.CostaRica.Checkin.Web.Models;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace NOVAAPP.Pages.Arqueos
{
    public class IndexModel : PageModel
    {
        private readonly ICrudApi<ArqueosViewModel, int> service;
        private readonly ICrudApi<UsuariosViewModel, int> serviceU;
        private readonly ICrudApi<CategoriasViewModel, int> categorias;
        private readonly ICrudApi<RolesViewModel, int> roles;

        private readonly ICrudApi<BodegasViewModel, int> bodegas;
        private readonly ICrudApi<SucursalesViewModel, string> sucursales;




        [BindProperty]
        public ArqueosViewModel[] Listas { get; set; }

        [BindProperty]
        public UsuariosViewModel[] Users { get; set; }

        [BindProperty]
        public CategoriasViewModel[] Categorias { get; set; }



        [BindProperty]
        public BodegasViewModel[] Bodegas { get; set; }


        [BindProperty]
        public SucursalesViewModel[] Sucursal { get; set; }


        [BindProperty(SupportsGet = true)]
        public ParametrosFiltros filtro { get; set; }

        public IndexModel(ICrudApi<ArqueosViewModel, int> service, ICrudApi<UsuariosViewModel, int> serviceU, ICrudApi<RolesViewModel, int> roles, ICrudApi<CategoriasViewModel, int> categorias, ICrudApi<BodegasViewModel, int> bodegas, ICrudApi<SucursalesViewModel, string> sucursales)
        {
            this.service = service;
            this.serviceU = serviceU;
            this.roles = roles;
    
            this.categorias = categorias;
            this.bodegas = bodegas;
            this.sucursales = sucursales;

        }

        public async Task<IActionResult> OnGetAsync()
        {
            try
            {
                var Roles1 = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles1.Where(a => a == "71").FirstOrDefault()))
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
                    filtro.ItemCode = "0";
                    filtro.espera = true;

                   


                }


                Listas = await service.ObtenerLista(filtro);
                Categorias = await categorias.ObtenerLista("");

               
                Bodegas = await bodegas.ObtenerLista("");



         


                Users = await serviceU.ObtenerLista("");

                Users = Users.Where(a => a.novapos == true).ToArray();
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
        public async Task<IActionResult> OnGetSincronizarSAP(int id)
        {
            try
            {

                await service.SincronizarSAP(id);
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