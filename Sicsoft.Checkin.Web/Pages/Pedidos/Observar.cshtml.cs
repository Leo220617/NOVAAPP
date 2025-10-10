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


namespace NOVAAPP.Pages.Pedidos
{
    public class ObservarModel : PageModel
    {
        private readonly IConfiguration configuration;
        private readonly ICrudApi<PedidosViewModel, int> service; //API
        private readonly ICrudApi<ProductosViewModel, string> productos;
        private readonly ICrudApi<UsuariosViewModel, int> usuario;
        private readonly ICrudApi<BodegasViewModel, int> bodegas;
        private readonly ICrudApi<SucursalesViewModel, string> sucursales;


        [BindProperty]
        public PedidosViewModel Pedido { get; set; }



        [BindProperty]
        public ProductosViewModel[] Productos { get; set; }


        [BindProperty]
        public BodegasViewModel[] Bodega { get; set; }


        [BindProperty]
        public SucursalesViewModel[] Sucursal { get; set; }

        [BindProperty]
        public UsuariosViewModel[] Usuarios { get; set; }

        [BindProperty]
        public SucursalesViewModel MiSucursal { get; set; }



        [BindProperty]
        public string Empresa { get; set; }

        [BindProperty]
        public string NombreCliente { get; set; }

        public ObservarModel(IConfiguration configuration, ICrudApi<PedidosViewModel, int> service, ICrudApi<ProductosViewModel, string> productos, ICrudApi<UsuariosViewModel, int> usuario, ICrudApi<BodegasViewModel, int> bodegas, ICrudApi<SucursalesViewModel, string> sucursales) //CTOR 
        {
            this.configuration = configuration;
            this.service = service;
            this.productos = productos;
            this.usuario = usuario;
            this.bodegas = bodegas;
            this.sucursales = sucursales;

        }

        public async Task<IActionResult> OnGetAsync(int id)
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "120").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }

                Pedido = await service.ObtenerPorId(id);
                var idUsuario = Convert.ToInt32(((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == ClaimTypes.Actor).Select(s1 => s1.Value).FirstOrDefault());


                ParametrosFiltros filtro = new ParametrosFiltros();
                filtro.Externo = true;
                filtro.Activo = true;

                Sucursal = await sucursales.ObtenerLista("");

                Productos = await productos.ObtenerLista(filtro);

                NombreCliente = configuration["Cliente"].ToString();
                Bodega = await bodegas.ObtenerLista("");
                Usuarios = await usuario.ObtenerLista("");

                return Page();
            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, ex.Message);
                return Page();
            }
        }



    }
}
