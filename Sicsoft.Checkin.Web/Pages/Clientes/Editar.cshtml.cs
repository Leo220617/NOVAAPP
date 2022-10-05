using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using NOVAAPP.Models;
using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Refit;
using Sicsoft.Checkin.Web.Servicios;

namespace NOVAAPP.Pages.Clientes
{
    public class EditarModel : PageModel
    {
        private readonly ICrudApi<ClientesViewModel, string> service;
        private readonly ICrudApi<CantonesViewModel, int> serviceC;
        private readonly ICrudApi<DistritosViewModel, int> serviceD;
        private readonly ICrudApi<BarriosViewModel, int> serviceB;
        private readonly ICrudApi<ListaPreciosViewModel, int> precio;
        private readonly ICrudApi<GruposClientesViewModel, int> grupos;



        [BindProperty]
        public ClientesViewModel Cliente { get; set; }

        [BindProperty]
        public CantonesViewModel[] Cantones { get; set; }

        [BindProperty]
        public DistritosViewModel[] Distritos { get; set; }

        [BindProperty]
        public BarriosViewModel[] Barrios { get; set; }
        [BindProperty]
        public ListaPreciosViewModel[] PrecioLista { get; set; }

        [BindProperty]
        public GruposClientesViewModel[] Grupos { get; set; }

        public EditarModel(ICrudApi<ClientesViewModel, string> service, ICrudApi<CantonesViewModel, int> serviceC, ICrudApi<DistritosViewModel, int> serviceD, ICrudApi<BarriosViewModel, int> serviceB, ICrudApi<ListaPreciosViewModel, int> precio, ICrudApi<GruposClientesViewModel, int> grupos)
        {
            this.service = service;
            this.serviceC = serviceC;
            this.serviceD = serviceD;
            this.serviceB = serviceB;
            this.precio = precio;
            this.grupos = grupos;
        }
        public async Task<IActionResult> OnGetAsync(int id)
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "27").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
                Cliente = await service.ObtenerPorId(id);
                Cantones = await serviceC.ObtenerLista("");
                Distritos = await serviceD.ObtenerLista("");
                Barrios = await serviceB.ObtenerLista("");
                PrecioLista = await precio.ObtenerLista("");
                Grupos = await grupos.ObtenerLista("");

                return Page();
            }
            catch (Exception ex)
            {
                Cliente = await service.ObtenerPorId(id);
                Cantones = await serviceC.ObtenerLista("");
                Distritos = await serviceD.ObtenerLista("");
                Barrios = await serviceB.ObtenerLista("");
                PrecioLista = await precio.ObtenerLista("");
                Grupos = await grupos.ObtenerLista("");
                ModelState.AddModelError(string.Empty, ex.Message);
                return Page();
            }
        }
        public async Task<IActionResult> OnPostAsync()
        {
            try
            {
                await service.Editar(Cliente);
                return RedirectToPage("./Index");
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

