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

namespace NOVAAPP.Pages.Cajas
{
    public class EditarModel : PageModel
    {
        private readonly ICrudApi<CajasViewModel, int> service; //API
        private readonly ICrudApi<SucursalesViewModel, string> sucursales;
        private readonly ICrudApi<UsuariosViewModel, int> usuarios;
        private readonly ICrudApi<ParametrosViewModel, int> param;

        [BindProperty]
        public CajasViewModel Caja { get; set; }

        [BindProperty]
        public SucursalesViewModel[] SucursalesLista { get; set; }

        [BindProperty]
        public UsuariosViewModel[] UsuariosLista { get; set; }

        [BindProperty]
        public ParametrosViewModel[] Parametros { get; set; }

        public EditarModel(ICrudApi<CajasViewModel, int> service, ICrudApi<SucursalesViewModel, string> sucursales, ICrudApi<UsuariosViewModel, int> usuarios, ICrudApi<ParametrosViewModel, int> param) //CTOR 
        {
            this.service = service;
            this.sucursales = sucursales;
            this.usuarios = usuarios;
            this.param = param;
        }
        public async Task<IActionResult> OnGetAsync(int id)
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "13").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
                Caja = await service.ObtenerPorId(id);
                SucursalesLista = await sucursales.ObtenerLista("");
                UsuariosLista = await usuarios.ObtenerLista("");
                Parametros = await param.ObtenerLista("");

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
                await service.Editar(Caja);
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
