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

namespace NOVAAPP.Pages.AprobacionesCredito
{
    public class IndexModel : PageModel
    {
        private readonly IConfiguration configuration;
        private readonly ICrudApi<AprobacionesCreditosViewModel, int> service;
        private readonly ICrudApi<ClientesViewModel, string> clientes;
        private readonly ICrudApi<CondicionesPagosViewModel, int> condiciones;

        [BindProperty(SupportsGet = true)]
        public ParametrosFiltros filtro { get; set; }

        [BindProperty]
        public AprobacionesCreditosViewModel[] Objeto { get; set; }


        [BindProperty]
        public ClientesViewModel[] ClientesLista { get; set; }

        [BindProperty]
        public CondicionesPagosViewModel[] CP { get; set; }
        public IndexModel(ICrudApi<AprobacionesCreditosViewModel, int> service, ICrudApi<ClientesViewModel, string> clientes, ICrudApi<CondicionesPagosViewModel, int> condiciones)
        {
            this.service = service;
            this.clientes = clientes;
            this.condiciones = condiciones;
        }
        public async Task<IActionResult> OnGetAsync()
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "67").FirstOrDefault()))
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

                ParametrosFiltros filtro2 = new ParametrosFiltros();
                filtro2.Externo = true;
                ClientesLista = await clientes.ObtenerLista(filtro2);
                CP = await condiciones.ObtenerLista("");

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
