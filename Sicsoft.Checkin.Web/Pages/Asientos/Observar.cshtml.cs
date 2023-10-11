using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using NOVAAPP.Models;
using Sicsoft.Checkin.Web.Servicios;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace NOVAAPP.Pages.Asientos
{
    public class ObservarModel : PageModel
    {
        private readonly ICrudApi<AsientosViewModel, int> service;
        private readonly ICrudApi<UsuariosViewModel, int> serviceU;
        private readonly ICrudApi<SucursalesViewModel, string> sucursales;
      
        private readonly ICrudApi<CuentasBancariasViewModel, int> cuentas;



        [BindProperty]
        public AsientosViewModel Listas { get; set; }

        [BindProperty]
        public UsuariosViewModel[] Users { get; set; }
        [BindProperty]
        public SucursalesViewModel[] Sucursales { get; set; }

        [BindProperty]
        public CuentasBancariasViewModel[] Cuentas { get; set; }

      

        [BindProperty(SupportsGet = true)]
        public ParametrosFiltros filtro { get; set; }
        public ObservarModel(ICrudApi<AsientosViewModel, int> service, ICrudApi<UsuariosViewModel, int> serviceU, ICrudApi<SucursalesViewModel, string> sucursales, ICrudApi<CuentasBancariasViewModel, int> cuentas)
        {
            this.service = service;
            this.sucursales = sucursales;
            this.serviceU = serviceU;
            this.cuentas = cuentas;
           

        }
        public async Task<IActionResult> OnGetAsync(int id)
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "32").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }




                Listas = await service.ObtenerPorId(id);
                Cuentas = await cuentas.ObtenerLista("");
            


                ParametrosFiltros filtro2 = new ParametrosFiltros();


                Sucursales = await sucursales.ObtenerLista("");
                Users = await serviceU.ObtenerLista("");

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
