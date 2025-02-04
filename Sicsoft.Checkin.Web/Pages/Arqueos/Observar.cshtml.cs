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
using Microsoft.Extensions.Configuration;

namespace NOVAAPP.Pages.Arqueos
{
    public class ObservarModel : PageModel
    {
        private readonly IConfiguration configuration;
        private readonly ICrudApi<ArqueosViewModel, int> service;
        private readonly ICrudApi<CategoriasViewModel, int> categorias;
        private readonly ICrudApi<BodegasViewModel, int> bodegas;
        private readonly ICrudApi<ProductosViewModel, string> productos;
        private readonly ICrudApi<UsuariosViewModel, int> usuarios;
        private readonly ICrudApi<SucursalesViewModel, string> sucursales;




        [BindProperty]
        public ArqueosViewModel Arqueo { get; set; }

        [BindProperty]
        public CategoriasViewModel[] Categorias { get; set; }



        [BindProperty]
        public BodegasViewModel[] Bodegas { get; set; }

        [BindProperty]
        public ProductosViewModel[] Productos { get; set; }


        [BindProperty]
        public UsuariosViewModel[] Usuarios { get; set; }


        [BindProperty]
        public SucursalesViewModel[] Sucursal { get; set; }

        [BindProperty]
        public string NombreCliente { get; set; }


        [BindProperty(SupportsGet = true)]
        public ParametrosFiltros filtro { get; set; }

        public ObservarModel(ICrudApi<ArqueosViewModel, int> service, ICrudApi<CategoriasViewModel, int> categorias, ICrudApi<BodegasViewModel, int> bodegas, ICrudApi<ProductosViewModel, string> productos, ICrudApi<UsuariosViewModel, int> usuarios, ICrudApi<SucursalesViewModel, string> sucursales)
        {
            this.service = service;
            this.categorias = categorias;
            this.bodegas = bodegas;
            this.productos = productos;
            this.usuarios = usuarios;
            this.sucursales = sucursales;
        }

        public async Task<IActionResult> OnGetAsync(int id)
        {
            try
            {
                var Roles1 = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles1.Where(a => a == "71").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }

                Categorias = await categorias.ObtenerLista("");

     
 
                Bodegas = await bodegas.ObtenerLista("");

                ParametrosFiltros filtro = new ParametrosFiltros();
                Arqueo = await service.ObtenerPorId(id);
                filtro.Externo = true;
                filtro.Activo = true;
                //filtro.Codigo3 = Arqueo.idCategoria;
              
                Productos = await productos.ObtenerLista(filtro);
               
                Usuarios = await usuarios.ObtenerLista("");

          
                Sucursal = await sucursales.ObtenerLista("");

                NombreCliente = "NUEVA AGRICULTURA NOVAGRO SA.";
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

        public async Task<IActionResult> OnPostAgregarArqueo()
        {
            string error = "";

            ArqueosViewModel recibidos = new ArqueosViewModel();
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
                    recibidos = Newtonsoft.Json.JsonConvert.DeserializeObject<ArqueosViewModel>(jsonString);
                }







                await service.Editar(recibidos);

                var resp2 = new
                {
                    success = true,
                    Arqueo = ""

                };
                return new JsonResult(resp2);
            }
            catch (ApiException ex)
            {
                BitacoraErroresViewModel be = JsonConvert.DeserializeObject<BitacoraErroresViewModel>(ex.Content.ToString());
                var resp2 = new
                {
                    success = false,
                    Arqueo = be.Descripcion
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