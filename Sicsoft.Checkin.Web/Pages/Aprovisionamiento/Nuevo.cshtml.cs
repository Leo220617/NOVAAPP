using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using NOVAAPP.Models;
using Sicsoft.Checkin.Web.Servicios;
using System.Drawing.Printing;
using System;
using System.Linq;
using System.Security.Claims;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Threading;
using Newtonsoft.Json;
using Refit;
using System.IO.Compression;
using System.IO;

namespace NOVAAPP.Pages.Aprovisionamiento
{
    public class NuevoModel : PageModel
    {
        private readonly ICrudApi<AprovisionamientoViewModel, int> service;
        private readonly ICrudApi<AprovisionamientoProductosViewModel, int> aprovisionamientoProductos;
        private readonly ICrudApi<CategoriasViewModel, int> categorias;
        private readonly ICrudApi<SubCategoriasViewModel, int> subCategorias;
        private readonly ICrudApi<BodegasViewModel, int> bodegas;
        private readonly ICrudApi<ProveedoresViewModel, int> proveedores;
        private readonly ICrudApi<ImpuestosViewModel, int> impuestos;

        [BindProperty]
        public AprovisionamientoViewModel Aprovisionamiento { get; set; }
        [BindProperty]
        public AprovisionamientoProductosViewModel AprovisionamientoProductos { get; set; }

        [BindProperty]
        public CategoriasViewModel[] Categorias { get; set; }

        [BindProperty]
        public SubCategoriasViewModel[] SubCategorias { get; set; }

        [BindProperty]
        public BodegasViewModel[] Bodegas { get; set; }


        [BindProperty]
        public ImpuestosViewModel[] Impuestos { get; set; }



        [BindProperty]
        public ProveedoresViewModel Proveedores { get; set; }

        [BindProperty(SupportsGet = true)]
        public ParametrosFiltros filtro { get; set; }



        public NuevoModel(ICrudApi<AprovisionamientoProductosViewModel, int> aprovisionamientoProductos, ICrudApi<ImpuestosViewModel, int> impuestos, ICrudApi<AprovisionamientoViewModel, int> service, ICrudApi<ProveedoresViewModel, int> proveedores, ICrudApi<CategoriasViewModel, int> categorias, ICrudApi<SubCategoriasViewModel, int> subCategorias, ICrudApi<BodegasViewModel, int> bodegas) //CTOR 
        {
            this.aprovisionamientoProductos = aprovisionamientoProductos; 
            this.categorias = categorias;
            this.subCategorias = subCategorias;
            this.bodegas = bodegas;
            this.service = service;
            this.proveedores = proveedores;
            this.impuestos = impuestos;
        }
        public async Task<IActionResult> OnGetAsync()
        {
            try
            {
            
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "81").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }


                Bodegas = await bodegas.ObtenerLista("");
                Categorias = await categorias.ObtenerLista("");
                filtro.Procesado = true;
                SubCategorias = await subCategorias.ObtenerLista(filtro);
           
                AprovisionamientoProductos = await aprovisionamientoProductos.ObtenerListaEspecial("");
                Proveedores = await proveedores.ObtenerListaEspecial("");
                Impuestos = await impuestos.ObtenerLista("");




                return Page();
            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, ex.Message);
                return Page();
            }
        }
        public async Task<IActionResult> OnPostAgregarAprovisionamiento()
        {
            string error = "";

            AprovisionamientoViewModel recibidos = new AprovisionamientoViewModel();
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
                    recibidos = Newtonsoft.Json.JsonConvert.DeserializeObject<AprovisionamientoViewModel>(jsonString);
                }




                recibidos.idUsuarioCreador = Convert.ToInt32(((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == ClaimTypes.Actor).Select(s1 => s1.Value).FirstOrDefault().ToString());


                await service.Agregar(recibidos);

                var resp2 = new
                {
                    success = true,
                    Aprovisionamiento = ""

                };
                return new JsonResult(resp2);
            }
            catch (ApiException ex)
            {
                BitacoraErroresViewModel be = JsonConvert.DeserializeObject<BitacoraErroresViewModel>(ex.Content.ToString());
                var resp2 = new
                {
                    success = false,
                    Aprovisionamiento = be.Descripcion
                };
                return new JsonResult(resp2);
            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, ex.Message);
                var resp2 = new
                {
                    success = false,
                    Aprovisionamiento = ex.Message
                };
                return new JsonResult(resp2);
            }
        }
    }
}
