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

namespace NOVAAPP.Pages.Usuarios
{
    public class EditarModel : PageModel
    {
        private readonly ICrudApi<UsuariosViewModel, int> service; //API
        private readonly ICrudApi<RolesViewModel, int> roles;
        private readonly ICrudApi<VendedoresViewModel, int> vendedor;

        [BindProperty]
        public UsuariosViewModel Usuario { get; set; }

        [BindProperty]
        public RolesViewModel[] RolesLista { get; set; }

        [BindProperty]
        public VendedoresViewModel[] Vendedor { get; set; }

        public EditarModel(ICrudApi<UsuariosViewModel, int> service, ICrudApi<RolesViewModel, int> roles, ICrudApi<VendedoresViewModel, int> vendedor) //CTOR 
        {
            this.service = service;
            this.roles = roles;
            this.vendedor = vendedor;
          
        }
        public async Task<IActionResult> OnGetAsync(int id)
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "15").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
                Usuario = await service.ObtenerPorId(id);
                RolesLista = await roles.ObtenerLista("");
                Vendedor = await vendedor.ObtenerLista("");
                Usuario.Clave = "";
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
                await service.Editar(Usuario);
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

