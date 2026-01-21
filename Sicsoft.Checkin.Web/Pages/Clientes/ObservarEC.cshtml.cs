using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Refit;
using Sicsoft.Checkin.Web.Servicios;
using NOVAAPP.Models;
namespace NOVAAPP.Pages.Clientes
{
    public class ObservarECModel : PageModel
    {
        private readonly IConfiguration configuration;
        private readonly ICrudApi<ClientesViewModel, string> service;
        private readonly ICrudApi<CondicionesPagosViewModel, int> condicion;

        private readonly ICrudApi<ParametrosViewModel, int> param;
        private readonly ICrudApi<EstadoCuentaViewModel, int> estadoCuenta;
        private readonly ICrudApi<SucursalesViewModel, string> sucursales;

        [BindProperty(SupportsGet = true)]
        public ParametrosFiltros filtro { get; set; }

        [BindProperty]
        public ClientesViewModel Cliente { get; set; }



        [BindProperty]
        public CondicionesPagosViewModel[] Condiciones { get; set; }

        [BindProperty]
        public GruposClientesViewModel[] Grupos { get; set; }


        [BindProperty]
        public SucursalesViewModel[] MiSucursal { get; set; }
        [BindProperty]
        public ParametrosViewModel[] Parametros { get; set; }

        [BindProperty]
        public EstadoCuentaViewModel EstadoCuenta { get; set; }

        [BindProperty]
        public string NombreCliente { get; set; }

        public ObservarECModel(ICrudApi<ClientesViewModel, string> service, ICrudApi<SucursalesViewModel, string> sucursales, ICrudApi<EstadoCuentaViewModel, int> estadoCuenta,  ICrudApi<CondicionesPagosViewModel, int> condicion, ICrudApi<ParametrosViewModel, int> param)
        {
            this.service = service;
            this.condicion = condicion;
            this.param = param;
            this.estadoCuenta = estadoCuenta;
            this.sucursales = sucursales;
        }
        public async Task<IActionResult> OnGetAsync(string id)
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "126").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
                Cliente = await service.ObtenerPorIdString(id);
              
                Condiciones = await condicion.ObtenerLista("");
                MiSucursal = await sucursales.ObtenerLista("");
       
                Parametros = await param.ObtenerLista("");
                filtro.CardCode = Cliente.Codigo;
                EstadoCuenta = await estadoCuenta.ObtenerListaEspecial(filtro);
                NombreCliente = Parametros.FirstOrDefault().NombreEmpresa;
                return Page();
            }
            catch (ApiException ex)
            {
                Errores error = JsonConvert.DeserializeObject<Errores>(ex.Content.ToString());
                ModelState.AddModelError(string.Empty, error.Message);

                return Page();
            }
        }
    }
}
