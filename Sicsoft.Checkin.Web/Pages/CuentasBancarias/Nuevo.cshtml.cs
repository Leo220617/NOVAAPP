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
using NOVAAPP.Models;
using Refit;
using Sicsoft.Checkin.Web.Servicios;

namespace NOVAAPP.Pages.CuentasBancarias
{
    public class NuevoModel : PageModel
    {
        private readonly ICrudApi<CuentasBancariasViewModel, int> service; //API
        private readonly ICrudApi<SucursalesViewModel, string> sucursales;

        [BindProperty]
        public CuentasBancariasViewModel Cuenta { get; set; }

        [BindProperty]
        public SucursalesViewModel[] SucursalesLista { get; set; }

        public NuevoModel(ICrudApi<CuentasBancariasViewModel, int> service, ICrudApi<SucursalesViewModel, string> sucursales) //CTOR 
        {
            this.service = service;
            this.sucursales = sucursales;
        }

        public async Task<IActionResult> OnGetAsync()
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "43").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
                SucursalesLista = await sucursales.ObtenerLista("");
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
                await service.Agregar(Cuenta);
                return RedirectToPage("./Index");
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
