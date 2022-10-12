using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Authentication;
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

namespace NOVAAPP.Pages.CierreCajas
{
    public class ObservarModel : PageModel
    {
        private readonly ICrudApi<CierreCajasViewModel, int> service;

        private readonly ICrudApi<UsuariosViewModel, int> users;
        private readonly ICrudApi<TipoCambiosViewModel, int> tipoCambio;
        private readonly ICrudApi<CajasViewModel, int> cajo;



        [BindProperty]
        public CierreCajasViewModel Cierres { get; set; }



        [BindProperty]
        public UsuariosViewModel Users { get; set; }

        [BindProperty]
        public CajasViewModel[] Cajos { get; set; }

        [BindProperty]
        public string Caja { get; set; }
        [BindProperty]
        public TipoCambiosViewModel[] TC { get; set; }

        public ObservarModel(ICrudApi<CierreCajasViewModel, int> service, ICrudApi<UsuariosViewModel, int> users, ICrudApi<TipoCambiosViewModel, int> tipoCambio, ICrudApi<CajasViewModel, int> cajo)
        {
            this.service = service;
            this.users = users;
            this.tipoCambio = tipoCambio;
            this.cajo = cajo;
           
        }
        public async Task<IActionResult> OnGetAsync(int id, string Fecha, int idUsuario)
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "37").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
                Cajos = await cajo.ObtenerLista("");
                var FechaCierre = Convert.ToDateTime(Fecha);
                Cierres = await service.ObtenerCierre(id,FechaCierre, idUsuario);
                var idCajero = Cierres.idUsuario;
              
                Users = await users.ObtenerPorId(idCajero);
                Caja = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Caja").Select(s1 => s1.Value).FirstOrDefault();

                ParametrosFiltros filtro = new ParametrosFiltros();
                filtro.FechaInicial = DateTime.Now.Date;
                TC = await tipoCambio.ObtenerLista(filtro);

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
