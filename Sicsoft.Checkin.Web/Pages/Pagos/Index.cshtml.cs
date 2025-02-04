using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using NOVAAPP.Models;
using Refit;
using Sicsoft.Checkin.Web.Servicios;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace NOVAAPP.Pages.Pagos
{
    public class IndexModel : PageModel
    {
        private readonly ICrudApi<PagosViewModel, int> service;
        private readonly ICrudApi<UsuariosViewModel, int> serviceU;
        private readonly ICrudApi<ClientesViewModel, string> clientes;
        private readonly ICrudApi<RolesViewModel, int> roles;
        private readonly ICrudApi<SucursalesViewModel, string> sucursales;
        private readonly ICrudApi<ParametrosViewModel, int> param;


        [BindProperty]
        public PagosViewModel[] Listas { get; set; }

        [BindProperty]
        public UsuariosViewModel[] Users { get; set; }
        [BindProperty]
        public ClientesViewModel[] Clientes { get; set; }

        [BindProperty]
        public SucursalesViewModel[] Sucursales { get; set; }

        [BindProperty]
        public ParametrosViewModel[] Parametros { get; set; }

        [BindProperty(SupportsGet = true)]
        public ParametrosFiltros filtro { get; set; }

        public IndexModel(ICrudApi<PagosViewModel, int> service, ICrudApi<ClientesViewModel, string> clientes, ICrudApi<UsuariosViewModel, int> serviceU, ICrudApi<RolesViewModel, int> roles,  ICrudApi<SucursalesViewModel, string> sucursales, ICrudApi<ParametrosViewModel, int> param)
        {
            this.service = service;
            this.clientes = clientes;
            this.serviceU = serviceU;
            this.roles = roles;
        this.param = param;
            this.sucursales = sucursales;

        }

        public async Task<IActionResult> OnGetAsync()
        {
            try
            {
                var Roles1 = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles1.Where(a => a == "52").FirstOrDefault()))
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


                    filtro.Codigo2 = 0;
                    filtro.Codigo3 = 0;
                    filtro.Codigo4 = 0;
                    filtro.ItemCode = "0";
            


                }

                filtro.Activo = true;
                Listas = await service.ObtenerLista(filtro);
                Sucursales = await sucursales.ObtenerLista(filtro);



                var Roles = await roles.ObtenerLista("");
                var RolCajero = Roles.Where(a => a.NombreRol.ToLower().Contains("cajero".ToLower())).FirstOrDefault();
            

                Users = await serviceU.ObtenerLista("");

                //Users = Users.Where(a => a.idRol == RolCajero.idRol).ToArray();





                Parametros = await param.ObtenerLista("");
                ParametrosFiltros filtro2 = new ParametrosFiltros();
                filtro2.Externo = true;

                Clientes = await clientes.ObtenerLista(filtro2);

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
