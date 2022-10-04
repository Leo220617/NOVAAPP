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

namespace NOVAAPP.Pages.Exoneraciones
{
    public class EditarModel : PageModel
    {
        private readonly ICrudApi<ExoneracionesViewModel, int> service; //API
        private readonly ICrudApi<ClientesViewModel, string> serviceC;
        private readonly ICrudApi<CabysViewModel, int> cabys;

        [BindProperty]
        public ExoneracionesViewModel Exoneracion { get; set; }

        public ClientesViewModel[] Cliente { get; set; }
        [BindProperty]
        public CabysViewModel[] Cabys { get; set; }


        public EditarModel(ICrudApi<ExoneracionesViewModel, int> service, ICrudApi<ClientesViewModel, string> serviceC, ICrudApi<CabysViewModel, int> cabys) //CTOR 
        {
            this.service = service;
            this.serviceC = serviceC;
            this.cabys = cabys;

        }
        public async Task<IActionResult> OnGetAsync(int id)
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "24").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
                Exoneracion = await service.ObtenerPorId(id);
                Cliente = await serviceC.ObtenerLista("");
                Cabys = await cabys.ObtenerLista("");


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
                await service.Editar(Exoneracion);
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
        public async Task<IActionResult> OnPostAgregarExoneracion(ExoneracionesViewModel recibidos)
        {
            string error = "";


            try
            {


               await service.Editar(recibidos);

                var resp2 = new
                {
                    success = true,
                    Exon = ""
                };
                return new JsonResult(resp2);
            }
            catch (ApiException ex)
            {
                Errores errores = JsonConvert.DeserializeObject<Errores>(ex.Content.ToString());
                ModelState.AddModelError(string.Empty, errores.Message);
                return new JsonResult(error);
                //return new JsonResult(false);
            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, ex.Message);
                var resp2 = new
                {
                    success = false,
                    Exon = ""
                };
                return new JsonResult(resp2);
            }
        }
    }
}

