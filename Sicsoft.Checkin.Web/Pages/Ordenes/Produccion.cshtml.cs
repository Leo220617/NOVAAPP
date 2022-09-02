using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;
using MPOrdenes.Models;
using Newtonsoft.Json;
using Refit;
using Sicsoft.Checkin.Web.Servicios;

namespace MPOrdenes.Pages.Ordenes
{
    public class ProduccionModel : PageModel
    {
        private readonly ICrudApi<EncOrdenesCompraViewModel, int> service;
        private readonly ICrudApi<OrdenesViewModel, int> serviceO;
        private readonly ICrudApi<FabricacionViewModel, int> serviceF;
        private readonly ICrudApi<PLineasViewModel, int> servicePL;
        private readonly ICrudApi<AgrupadoViewModel, int> serviceAg;
        private readonly ICrudApi<AgrupadoProduccionViewModel, int> serviceAgP;




        [BindProperty]
        public EncOrdenesCompraViewModel Orden { get; set; }
        [BindProperty]
        public AgrupadoViewModel Agrupado { get; set; }

        [BindProperty]
        public PLineasViewModel PLineas { get; set; }
        public ProduccionModel(ICrudApi<EncOrdenesCompraViewModel, int> service, ICrudApi<OrdenesViewModel, int> serviceO, ICrudApi<FabricacionViewModel, int> serviceF, ICrudApi<PLineasViewModel, int> servicePL, ICrudApi<AgrupadoViewModel, int> serviceAg, ICrudApi<AgrupadoProduccionViewModel, int> serviceAgP)
        {
            this.service = service;
            this.serviceO = serviceO;
            this.serviceF = serviceF;
            this.servicePL = servicePL;
            this.serviceAg = serviceAg;
            this.serviceAgP = serviceAgP;
        }
        public async Task<IActionResult> OnGetAsync(int id)
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "8").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
                var Filt = new ParametrosFiltros();
                Filt.Codigo1 = id;
                Orden = await service.ObtenerPorId(id);
                Agrupado = await serviceAg.ObtenerListaEspecial(Filt);
                PLineas = await servicePL.ObtenerListaEspecial(Filt);


                return Page();
            }
            catch (ApiException ex)
            {
                ModelState.AddModelError(string.Empty, ex.Message);
                return Page();
            }
        }

        public async Task<IActionResult> OnGetGenerar(string id, string enviar)
        {
            try
            {
                ParametrosFiltros filt = new ParametrosFiltros();
                filt.Codigo1 = Convert.ToInt32(id);
                var OrdenesEnviar = await serviceO.ObtenerListaEspecial(filt);

                foreach (var item in OrdenesEnviar.Ordenes)
                {
                    filt.Codigo1 = Convert.ToInt32(item.NoProducción);
                    filt.Categoria = enviar;

                    await serviceF.ObtenerLista(filt);
                }


                var obj = new
                {
                    success = true,
                    mensaje = ""
                };

                return new JsonResult(obj);

            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, ex.Message);

                var obj = new
                {
                    success = false,
                    mensaje = "Error en el exception: -> " + ex.Message
                };
                return new JsonResult(obj);
            }
        }


        //Generar Emision de Produiccion

        public async Task<IActionResult> OnGetEmision(string id)
        {
            try
            {
                ParametrosFiltros filt = new ParametrosFiltros();
                filt.Codigo1 = Convert.ToInt32(id);
                await serviceF.GenerarEmision(filt);

                


                var obj = new
                {
                    success = true,
                    mensaje = ""
                };

                return new JsonResult(obj);

            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, ex.Message);

                var obj = new
                {
                    success = false,
                    mensaje = "Error en el exception: -> " + ex.Message
                };
                return new JsonResult(obj);
            }
        }

        //Generar Recibo de Produccion
        public async Task<IActionResult> OnGetRecibo(string id)
        {
            try
            {
                ParametrosFiltros filt = new ParametrosFiltros();
                filt.Codigo1 = Convert.ToInt32(id);
                await serviceF.GenerarRecibo(filt);




                var obj = new
                {
                    success = true,
                    mensaje = ""
                };

                return new JsonResult(obj);

            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, ex.Message);

                var obj = new
                {
                    success = false,
                    mensaje = "Error en el exception: -> " + ex.Message
                };
                return new JsonResult(obj);
            }
        }

        public async Task<IActionResult> OnPostProduccion(AgrupadoProduccionViewModel[] recibido)
        {
            try
            {
                
                await serviceAgP.AgregarBulk(recibido);

                var obj = new
                {
                    success = true,
                    mensaje = ""
                };

                return new JsonResult(obj);

            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, ex.Message);

                var obj = new
                {
                    success = false,
                    mensaje = "Error en el exception: -> " + ex.Message
                };
                return new JsonResult(obj);
            }
        }
    }
}
