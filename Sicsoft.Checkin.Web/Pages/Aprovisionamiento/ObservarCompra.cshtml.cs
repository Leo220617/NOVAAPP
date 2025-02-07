using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using NOVAAPP.Models;
using Sicsoft.Checkin.Web.Servicios;
using System.Security.Claims;
using System.Threading.Tasks;
using System;
using System.Linq;

namespace NOVAAPP.Pages.Aprovisionamiento
{
    public class ObservarCompraModel : PageModel
    {
        private readonly ICrudApi<EncComprasViewModel, int> service;
        private readonly ICrudApi<UsuariosViewModel, int> serviceU;
        private readonly ICrudApi<SucursalesViewModel, string> sucursal;


        [BindProperty]
        public EncComprasViewModel Compra { get; set; }

        [BindProperty]
        public UsuariosViewModel[] Users { get; set; }

        [BindProperty]
        public SucursalesViewModel[] Sucursales { get; set; }


        public ObservarCompraModel(ICrudApi<EncComprasViewModel, int> service, ICrudApi<UsuariosViewModel, int> serviceU, ICrudApi<SucursalesViewModel, string> sucursal)
        {
            this.service = service;
            this.serviceU = serviceU;
            this.sucursal = sucursal;
        }

        public async Task<IActionResult> OnGetAsync(int id)
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "49").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }




                Users = await serviceU.ObtenerLista("");

                Compra = await service.ObtenerPorId(id);
                Sucursales = await sucursal.ObtenerLista("");


   

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
