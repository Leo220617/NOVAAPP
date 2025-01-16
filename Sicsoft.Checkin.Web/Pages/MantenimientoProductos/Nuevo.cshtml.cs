using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using NOVAAPP.Models;
using Refit;
using Sicsoft.Checkin.Web.Servicios;
using Sicsoft.CostaRica.Checkin.Web.Models;
using System;
using System.IO.Compression;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace NOVAAPP.Pages.MantenimientoProductos
{
    public class NuevoModel : PageModel
    {
        private readonly ICrudApi<LogsProductosAprovisionamientoViewModel, int> service;
        private readonly ICrudApi<CategoriasViewModel, int> categorias;
        private readonly ICrudApi<BodegasViewModel, int> bodegas;
        private readonly ICrudApi<ProductosViewModel, string> productos;
        private readonly ICrudApi<SubCategoriasViewModel, int> subCategorias;





        [BindProperty]
        public LogsProductosAprovisionamientoViewModel LogsProductosAprov { get; set; }


        [BindProperty]
        public CategoriasViewModel[] Categorias { get; set; }

        [BindProperty]
        public SubCategoriasViewModel[] SubCategorias { get; set; }


        [BindProperty]
        public BodegasViewModel[] Bodegas { get; set; }

        [BindProperty]
        public ProductosViewModel[] Productos { get; set; }


        [BindProperty(SupportsGet = true)]
        public ParametrosFiltros filtro { get; set; }

        public NuevoModel(ICrudApi<LogsProductosAprovisionamientoViewModel, int> service, ICrudApi<CategoriasViewModel, int> categorias, ICrudApi<BodegasViewModel, int> bodegas, ICrudApi<ProductosViewModel, string> productos, ICrudApi<SubCategoriasViewModel, int> subCategorias)
        {
            this.service = service;
            this.categorias = categorias;
            this.bodegas = bodegas;
            this.productos = productos;
            this.subCategorias = subCategorias;


        }

        public async Task<IActionResult> OnGetAsync()
        {
            try
            {
                var Roles1 = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles1.Where(a => a == "79").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }

                Categorias = await categorias.ObtenerLista("");
                ParametrosFiltros filtro2 = new ParametrosFiltros();
                filtro2.Externo = true;
          
                SubCategorias = await subCategorias.ObtenerLista(filtro2);

                Bodegas = await bodegas.ObtenerLista("");

                ParametrosFiltros filtro = new ParametrosFiltros();
                filtro.Externo = true;
                filtro.Activo = true;

                Productos = await productos.ObtenerLista(filtro);
              




                return Page();
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

        public async Task<IActionResult> OnPostAgregarLogsProductosAprov()
        {
            string error = "";

            LogsProductosAprovisionamientoViewModel recibidos = new LogsProductosAprovisionamientoViewModel();
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
                    recibidos = Newtonsoft.Json.JsonConvert.DeserializeObject<LogsProductosAprovisionamientoViewModel>(jsonString);
                }




             
                recibidos.idUsuarioModificador = Convert.ToInt32(((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == ClaimTypes.Actor).Select(s1 => s1.Value).FirstOrDefault().ToString());


                await service.Agregar(recibidos);

                var resp2 = new
                {
                    success = true,
                    LogsProductosAprov = ""

                };
                return new JsonResult(resp2);
            }
            catch (ApiException ex)
            {
                BitacoraErroresViewModel be = JsonConvert.DeserializeObject<BitacoraErroresViewModel>(ex.Content.ToString());
                var resp2 = new
                {
                    success = false,
                    LogsProductosAprov = be.Descripcion
                };
                return new JsonResult(resp2);
            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, ex.Message);
                var resp2 = new
                {
                    success = false,
                    Arqueo = ex.Message
                };
                return new JsonResult(resp2);
            }
        }

    }
}