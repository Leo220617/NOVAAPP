using System;
using System.Collections.Generic;
using System.IO.Compression;
using System.IO;
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


namespace NOVAAPP.Pages.Relacionados
{
    public class NuevoModel : PageModel
    {
        private readonly IConfiguration configuration;
        private readonly ICrudApi<EncRelacionadosViewModel, int> service; //API
        private readonly ICrudApi<ProductosViewModel, string> productos;
        private readonly ICrudApi<CategoriasViewModel, int> categorias;



        [BindProperty]
        public EncRelacionadosViewModel Relacion { get; set; }



        [BindProperty]
        public ProductosViewModel[] Productos { get; set; }


        [BindProperty]
        public CategoriasViewModel[] Categoria { get; set; }

        public NuevoModel(IConfiguration configuration, ICrudApi<EncRelacionadosViewModel, int> service, ICrudApi<ProductosViewModel, string> productos, ICrudApi<CategoriasViewModel, int> categorias) //CTOR 
        {
            this.configuration = configuration;
            this.service = service;
            this.productos = productos;
            this.categorias = categorias;

        }

        public async Task<IActionResult> OnGetAsync(int id)
        {
            try
            {
        
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "125").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }


                var idUsuario = Convert.ToInt32(((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == ClaimTypes.Actor).Select(s1 => s1.Value).FirstOrDefault());


                ParametrosFiltros filtro = new ParametrosFiltros();

            
                filtro.CardCode = "005";


                Categoria = await categorias.ObtenerLista("");
                Productos = await productos.ObtenerLista(filtro);


                return Page();
            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, ex.Message);
                return Page();
            }
        }

        public async Task<IActionResult> OnPostAgregarRelacion()
        {
            string error = "";

            EncRelacionadosViewModel recibidos = new EncRelacionadosViewModel();
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
                    recibidos = Newtonsoft.Json.JsonConvert.DeserializeObject<EncRelacionadosViewModel>(jsonString);
                }


                await service.Agregar(recibidos);

                var resp2 = new
                {
                    success = true,
                    Relacion = ""

                };
                return new JsonResult(resp2);
            }
            catch (ApiException ex)
            {
                BitacoraErroresViewModel be = JsonConvert.DeserializeObject<BitacoraErroresViewModel>(ex.Content.ToString());
                var resp2 = new
                {
                    success = false,
                    Relacion = be.Descripcion
                };
                return new JsonResult(resp2);
            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, ex.Message);
                var resp2 = new
                {
                    success = false,
                    Relacion = ex.Message
                };
                return new JsonResult(resp2);
            }
        }

    }
}
