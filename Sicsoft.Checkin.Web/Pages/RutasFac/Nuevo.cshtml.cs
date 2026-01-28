using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using NOVAAPP.Models;
using Sicsoft.Checkin.Web.Servicios;
using System.Security.Claims;
using System.Threading.Tasks;
using System;
using System.Linq;
using InversionGloblalWeb.Models;
using Refit;
using Newtonsoft.Json;
using System.IO.Compression;
using System.IO;

namespace NOVAAPP.Pages.RutasFac
{
    public class NuevoModel : PageModel
    {

        private readonly ICrudApi<RutasFacViewModel, int> service; //API
        private readonly ICrudApi<ClientesViewModel, string> clientes;
        private readonly ICrudApi<ParametrosViewModel, int> param;


        [BindProperty]
        public RutasFacViewModel[] Lista { get; set; }



        [BindProperty]
        public ClientesViewModel[] Clientes { get; set; }




        [BindProperty]
        public ParametrosViewModel[] Parametros { get; set; }

        public NuevoModel(ICrudApi<RutasFacViewModel, int> service, ICrudApi<ParametrosViewModel, int> param, ICrudApi<ProductosViewModel, string> productos, ICrudApi<ListaPreciosViewModel, int> precios, ICrudApi<CategoriasViewModel, int> categorias, ICrudApi<TipoCambiosViewModel, int> tipoCambio, ICrudApi<ClientesViewModel, string> clientes) //CTOR 
        {
            this.service = service;
            this.clientes = clientes;
            this.param = param;


        }
        public async Task<IActionResult> OnGetAsync()
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "64").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }



                ParametrosFiltros filtro = new ParametrosFiltros();


               

                ParametrosFiltros filtro2 = new ParametrosFiltros();

                Lista = await service.ObtenerLista(filtro2);
                filtro.FechaInicial = DateTime.Now.Date;
          
                filtro.Externo = true;
                filtro.Activo = true;
                Clientes = await clientes.ObtenerLista(filtro);
             
           
                return Page();
            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, ex.Message);
                return Page();
            }
        }


        public async Task<IActionResult> OnPostAgregarRutasFac()
        {
            string error = "";

            RutasFacViewModel recibidos = new RutasFacViewModel();
            try
            {


                var ms = new MemoryStream();
                await Request.Body.CopyToAsync(ms);

                byte[] compressedData = ms.ToArray();

                // Descomprimir los datos utilizando GZip
                using (var compressedStream = new MemoryStream(compressedData))
                using (var decompressedStream = new MemoryStream())
                {
                    using (var decompressionStream = new GZipStream(compressedStream, CompressionMode.Decompress))
                    {
                        decompressionStream.CopyTo(decompressedStream);
                    }

                    // Convertir los datos descomprimidos a una cadena JSON
                    var jsonString = System.Text.Encoding.UTF8.GetString(decompressedStream.ToArray());

                    // Procesar la cadena JSON como desees
                    // Por ejemplo, puedes deserializarla a un objeto C# utilizando Newtonsoft.Json
                    recibidos = Newtonsoft.Json.JsonConvert.DeserializeObject<RutasFacViewModel>(jsonString);
                }
            
                await service.Agregar(recibidos);

                var resp2 = new
                {
                    success = true,
                    ListaX = ""

                };
                return new JsonResult(resp2);
            }
            catch (ApiException ex)
            {
                BitacoraErroresViewModel be = JsonConvert.DeserializeObject<BitacoraErroresViewModel>(ex.Content.ToString());
                var resp2 = new
                {
                    success = false,
                    ListaX = be.Descripcion
                };
                return new JsonResult(resp2);

            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, ex.Message);
                var resp2 = new
                {
                    success = false,
                    RutasFac = ex.Message
                };
                return new JsonResult(resp2);
            }
        }
    }
}
