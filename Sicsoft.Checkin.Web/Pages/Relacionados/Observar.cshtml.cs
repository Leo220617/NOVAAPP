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
    public class ObservarModel : PageModel
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

        public ObservarModel(IConfiguration configuration, ICrudApi<EncRelacionadosViewModel, int> service, ICrudApi<ProductosViewModel, string> productos, ICrudApi<CategoriasViewModel, int> categorias) //CTOR 
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
                if (string.IsNullOrEmpty(Roles.Where(a => a == "124").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }


                var idUsuario = Convert.ToInt32(((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == ClaimTypes.Actor).Select(s1 => s1.Value).FirstOrDefault());


                ParametrosFiltros filtro = new ParametrosFiltros();


                filtro.Codigo1 = 20;


                Categoria = await categorias.ObtenerLista("");
                Productos = await productos.ObtenerLista(filtro);
                Relacion = await service.ObtenerPorId(id);

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
