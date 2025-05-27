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
    public class NuevoModel : PageModel
    {
        private readonly ICrudApi<ExoneracionesViewModel, int> service; //API
        private readonly ICrudApi<ClientesViewModel, string> serviceC;
        private readonly ICrudApi<CabysViewModel, int> cabys;
        private readonly ICrudApi<ImpuestosViewModel, int> imp;


        [BindProperty]
        public ExoneracionesViewModel Exoneracion { get; set; }
        [BindProperty]
        public ClientesViewModel[] Cliente { get; set; }
        [BindProperty]
        public CabysViewModel[] Cabys { get; set; }
        [BindProperty]
        public ImpuestosViewModel[] Impuestos { get; set; }

        public NuevoModel(ICrudApi<ExoneracionesViewModel, int> service, ICrudApi<ClientesViewModel, string> serviceC, ICrudApi<CabysViewModel, int> cabys, ICrudApi<ImpuestosViewModel, int> imp) //CTOR 
        {
            this.service = service;
            this.serviceC = serviceC;
            this.cabys = cabys;
            this.imp = imp;
        }

        public async Task<IActionResult> OnGetAsync()
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "24").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
                ParametrosFiltros filtro = new ParametrosFiltros();
                filtro.Externo = true;
                filtro.Activo = true;
                Cliente = await serviceC.ObtenerLista(filtro);
                Cabys = await cabys.ObtenerLista("");
                Impuestos = await imp.ObtenerLista("");
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
                await service.Agregar(Exoneracion);
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


                var resp = await service.Agregar(recibidos);

                var resp2 = new
                {
                    success = true,
                    Exon = resp
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
