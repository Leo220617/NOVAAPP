using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using NOVAAPP.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Refit;
using Sicsoft.Checkin.Web.Servicios;

using NOVAAPP.Models;
using InversionGloblalWeb.Models;

namespace NOVAAPP.Pages.Clientes
{
    public class IndexModel : PageModel
    {
        private readonly IConfiguration configuration;
        private readonly ICrudApi<ClientesViewModel, string> service;
        private readonly ICrudApi<GruposClientesViewModel, int> grupos;
        private readonly ICrudApi<ListaPreciosViewModel, int> listas;
        private readonly ICrudApi<ParametrosViewModel, int> param;

        [BindProperty(SupportsGet = true)]
        public ParametrosFiltros filtro { get; set; }

        [BindProperty]
        public ClientesViewModel[] Objeto { get; set; }

        [BindProperty]
        public GruposClientesViewModel[] Grupo { get; set; }

        [BindProperty]
        public ListaPreciosViewModel[] Lista { get; set; }

        [BindProperty]
        public ParametrosViewModel[] Parametros { get; set; }


        public IndexModel(ICrudApi<ClientesViewModel, string> service, ICrudApi<GruposClientesViewModel, int> grupos, ICrudApi<ListaPreciosViewModel, int> listas, ICrudApi<ParametrosViewModel, int> param)
        {
            this.service = service;
            this.grupos = grupos;
            this.listas = listas;
            this.param = param;
        }
        public async Task<IActionResult> OnGetAsync()
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "11").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }


                Grupo = await grupos.ObtenerLista("");
                Lista = await listas.ObtenerLista("");

                if ((filtro.Codigo1 == 0 || filtro.Codigo1 == null) && (filtro.Codigo2 == 0 || filtro.Codigo2 == null))
                {
                    filtro.Codigo2 = 0;
                    filtro.Codigo1 = 0;
                }

                if(filtro.Procesado && filtro.Codigo1 == 0 && filtro.Codigo2 == 0)
                {
                    filtro.Codigo2 = Grupo.FirstOrDefault().id;
                    filtro.Codigo1 = Lista.FirstOrDefault().id;

                    return new RedirectToPageResult("Index",filtro);
                }
                    

                Objeto = await service.ObtenerLista(filtro);
                Parametros = await param.ObtenerLista("");

                return Page();
            }
            catch (ApiException ex)
            {
                Errores error = JsonConvert.DeserializeObject<Errores>(ex.Content.ToString());
                ModelState.AddModelError(string.Empty, error.Message);

                return Page();
            }
        }
        public async Task<IActionResult> OnGetInsertarSAP()
        {
            try
            {

                await service.InsertarSAP();
                return new JsonResult(true);
            }
            catch (ApiException ex)
            {
                return new JsonResult(false);
            }
        }
        public async Task<IActionResult> OnGetSincronizarSAP(int id)
        {
            try
            {

                await service.SincronizarSAP(id);
                return new JsonResult(true);
            }
            catch (ApiException ex)
            {
                return new JsonResult(false);
            }
        }

        public async Task<IActionResult> OnGetInsertarSAPByClient(int id)
        {
            try
            {

                await service.InsertarSAPByClient(id);
                return new JsonResult(true);
            }
            catch (ApiException ex)
            {
                return new JsonResult(false);
            }
        }

        public async Task<IActionResult> OnGetInsertarSAPByCardCode(string id)
        {
            try
            {

                await service.InsertarSAPByCardCode(id);
                return new JsonResult(true);
            }
            catch (ApiException ex)
            {
                return new JsonResult(false);
            }
        }
        public async Task<IActionResult> OnGetReenviar(string code, string correos)
        {
            try
            {

                await service.Reenvio(code, correos);
                return new JsonResult(true);
            }
            catch (Exception ex)
            {
                return new JsonResult(false);
            }
        }
    }
}
