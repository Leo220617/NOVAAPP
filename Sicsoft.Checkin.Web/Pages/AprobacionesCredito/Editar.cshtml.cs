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

namespace NOVAAPP.Pages.AprobacionesCredito
{
    public class EditarModel : PageModel
    {
        private readonly ICrudApi<AprobacionesCreditosViewModel, int> service; //API
        private readonly ICrudApi<ClientesViewModel, string> clientes;

        [BindProperty]
        public AprobacionesCreditosViewModel Aprobacion { get; set; }

        [BindProperty]
        public ClientesViewModel[] ClientesLista { get; set; }
        public EditarModel(ICrudApi<AprobacionesCreditosViewModel, int> service, ICrudApi<ClientesViewModel, string> clientes) //CTOR 
        {
            this.service = service;
            this.clientes = clientes;
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
                Aprobacion = await service.ObtenerPorId(id);
                ParametrosFiltros filtro2 = new ParametrosFiltros();
                filtro2.Externo = true;
                ClientesLista = await clientes.ObtenerLista(filtro2);

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
                await service.Editar(Aprobacion);
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
