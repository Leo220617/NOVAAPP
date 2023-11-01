using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using NOVAAPP.Models;
using Refit;
using Sicsoft.Checkin.Web.Servicios;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace NOVAAPP.Pages.Promociones
{
    public class IndexModel : PageModel
    {
        private readonly IConfiguration configuration;
        private readonly ICrudApi<EncPromocionesViewModel, int> service;
        private readonly ICrudApi<ListaPreciosViewModel, int> listas;
      
        [BindProperty(SupportsGet = true)]
        public ParametrosFiltros filtro { get; set; }

        [BindProperty]
        public EncPromocionesViewModel[] Objeto { get; set; }


        [BindProperty]
        public ListaPreciosViewModel[] ListaPrecio { get; set; }


        public IndexModel(ICrudApi<EncPromocionesViewModel, int> service, ICrudApi<ListaPreciosViewModel, int> listas )
        {
            this.service = service;
            this.listas = listas;
    
        }
        public async Task<IActionResult> OnGetAsync()
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "50").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
                DateTime time = new DateTime();

                if (time == filtro.FechaInicial)
                {


                    filtro.FechaInicial = DateTime.Now;

                    //filtro.FechaInicial = new DateTime(filtro.FechaInicial.Year, filtro.FechaInicial.Month, 1);


                    DateTime primerDia = new DateTime(filtro.FechaInicial.Year, filtro.FechaInicial.Month, 1);


                    DateTime ultimoDia = primerDia.AddMonths(1).AddDays(-1);

                    filtro.FechaFinal = DateTime.Now; //ultimoDia;

                    
                   
                }
                Objeto = await service.ObtenerLista(filtro);
                ListaPrecio = await listas.ObtenerLista("");
              

               // Productos = await productos.ObtenerLista(filtro);
                return Page();
            }
            catch (ApiException ex)
            {
                Errores error = JsonConvert.DeserializeObject<Errores>(ex.Content.ToString());
                ModelState.AddModelError(string.Empty, error.Message);

                return Page();
            }
        }
    
    }
}
