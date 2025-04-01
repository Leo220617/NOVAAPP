using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using NOVAAPP.Models;
using Refit;
using Sicsoft.Checkin.Web.Servicios;
using System.Security.Claims;
using System.Threading.Tasks;
using System;
using System.Linq;

namespace NOVAAPP.Pages.ListaCorreos
{
    public class EditarModel : PageModel
    {
        private readonly ICrudApi<ListasCorreosViewModel, int> service;

        [BindProperty]
        public ListasCorreosViewModel Lista { get; set; }
        public EditarModel(ICrudApi<ListasCorreosViewModel, int> service)
        {
            this.service = service;
        }
        public async Task<IActionResult> OnGetAsync(int id)
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "104").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
                Lista = await service.ObtenerPorId(id);
                return Page();
            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, ex.Message);
                return Page();
            }
        }

        public async Task<IActionResult> OnPostGenerar(string recibidos)
        {
            try
            {

                ListasCorreosViewModel recibido = JsonConvert.DeserializeObject<ListasCorreosViewModel>(recibidos);


                await service.Editar(recibido);
                return new JsonResult(true);
            }
            catch (ApiException ex)
            {
                Errores error = JsonConvert.DeserializeObject<Errores>(ex.Content.ToString());
                ModelState.AddModelError(string.Empty, error.Message);

                return new JsonResult(false);
            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, ex.Message);

                return new JsonResult(false);
            }
        }
    }
}
