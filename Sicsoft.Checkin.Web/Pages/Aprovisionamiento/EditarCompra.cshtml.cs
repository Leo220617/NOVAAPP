using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using NOVAAPP.Models;
using Sicsoft.Checkin.Web.Servicios;
using System.Security.Claims;
using System.Threading.Tasks;
using System;
using System.Linq;
using Newtonsoft.Json;
using Refit;

namespace NOVAAPP.Pages.Aprovisionamiento
{
    public class EditarCompraModel : PageModel
    {
        private readonly ICrudApi<EncComprasViewModel, int> service;
        private readonly ICrudApi<UsuariosViewModel, int> serviceU;
        private readonly ICrudApi<SucursalesViewModel, string> sucursal;
        private readonly ICrudApi<CondicionesPagosViewModel, int> condicion;
        private readonly ICrudApi<BodegasViewModel, int> bodegas;


        [BindProperty]
        public EncComprasViewModel Compra { get; set; }

        [BindProperty]
        public UsuariosViewModel[] Users { get; set; }

        [BindProperty]
        public SucursalesViewModel[] Sucursales { get; set; }

        [BindProperty]
        public CondicionesPagosViewModel[] CP { get; set; }

        [BindProperty]
        public BodegasViewModel[] Bodegas { get; set; }

        public EditarCompraModel(ICrudApi<EncComprasViewModel, int> service, ICrudApi<BodegasViewModel, int> bodegas, ICrudApi<CondicionesPagosViewModel, int> condicion, ICrudApi<UsuariosViewModel, int> serviceU, ICrudApi<SucursalesViewModel, string> sucursal)
        {
            this.service = service;
            this.serviceU = serviceU;
            this.sucursal = sucursal;
            this.condicion = condicion;
            this.bodegas = bodegas;
        }

        public async Task<IActionResult> OnGetAsync(int id)
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "82").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }



                
                Users = await serviceU.ObtenerLista("");
                CP = await condicion.ObtenerLista("");
                Compra = await service.ObtenerPorId(id);
                Sucursales = await sucursal.ObtenerLista("");
                Bodegas = await bodegas.ObtenerLista("");




                return Page();
            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, ex.Message);
                return Page();
            }
        }
        public async Task<IActionResult> OnPostAsync()
        {
            try
            {
                await service.Editar(Compra);
            

                return RedirectToPage("./IndexCompras", new
                {
                    id = Compra.idAprovisionamiento
                });

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
    }
}
