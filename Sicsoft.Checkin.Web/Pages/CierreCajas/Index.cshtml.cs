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

namespace NOVAAPP.Pages.CierreCajas
{
    public class IndexModel : PageModel
    {

        private readonly ICrudApi<CierreCajasViewModel, int> service;
        private readonly ICrudApi<UsuariosViewModel, int> users;
        private readonly ICrudApi<CajasViewModel, int> cajas;
        private readonly ICrudApi<RolesViewModel, int> roles;

        [BindProperty(SupportsGet = true)]
        public ParametrosFiltros filtro { get; set; }

        [BindProperty]
        public CierreCajasViewModel[] Cierre { get; set; }

        [BindProperty]
        public UsuariosViewModel[] Users { get; set; }

        [BindProperty]
        public CajasViewModel[] Cajas { get; set; }


        public IndexModel(ICrudApi<CierreCajasViewModel, int> service, ICrudApi<UsuariosViewModel, int> users, ICrudApi<CajasViewModel, int> cajas, ICrudApi<RolesViewModel, int> roles)
        {
            this.service = service;
            this.users = users;
            this.cajas = cajas;
            this.roles = roles;
        }

        public async Task<IActionResult> OnGetAsync()
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "36").FirstOrDefault()))
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


                }
                Cierre = await service.ObtenerLista(filtro);
                Users = await users.ObtenerLista("");
                Cajas = await cajas.ObtenerLista("");
                var RolesC = await roles.ObtenerLista("");
                var RolCajero = RolesC.Where(a => a.NombreRol.ToLower().Contains("cajero".ToLower())).FirstOrDefault();

                Users = Users.Where(a => a.idRol == RolCajero.idRol).ToArray();

                
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