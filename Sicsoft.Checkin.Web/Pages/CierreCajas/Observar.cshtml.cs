using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using NOVAAPP.Models;
using Refit;
using Sicsoft.Checkin.Web.Servicios;
using Sicsoft.CostaRica.Checkin.Web.Models;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace NOVAAPP.Pages.CierreCajas
{
    public class ObservarModel : PageModel
    {
        private readonly ICrudApi<CierreCajasViewModel, int> service;

        private readonly ICrudApi<UsuariosViewModel, int> users;
        private readonly ICrudApi<TipoCambiosViewModel, int> tipoCambio;
        private readonly ICrudApi<CajasViewModel, int> cajo;
        private readonly ICrudApi<DocumentosViewModel, int> documento;
        private readonly ICrudApi<MetodosPagosViewModel, int> pagos;
        private readonly ICrudApi<CuentasBancariasViewModel, int> cuenta;


        [BindProperty]
        public CierreCajasViewModel Cierres { get; set; }



        [BindProperty]
        public UsuariosViewModel Users { get; set; }

        [BindProperty]
        public CajasViewModel[] Cajos { get; set; }

        [BindProperty]
        public string Caja { get; set; }
        [BindProperty]
        public TipoCambiosViewModel[] TC { get; set; }


        [BindProperty]
        public DocumentosViewModel[] Documento { get; set; }

        [BindProperty]
        public MetodosPagosViewModel[] Pagos { get; set; }

        [BindProperty]
        public CuentasBancariasViewModel[] CuentasBancarias { get; set; }

        public ObservarModel(ICrudApi<CierreCajasViewModel, int> service, ICrudApi<UsuariosViewModel, int> users, ICrudApi<TipoCambiosViewModel, int> tipoCambio, ICrudApi<CajasViewModel, int> cajo, ICrudApi<DocumentosViewModel, int> documento,  ICrudApi<MetodosPagosViewModel, int> pagos,ICrudApi<CuentasBancariasViewModel, int> cuenta)
        {
            this.service = service;
            this.users = users;
            this.tipoCambio = tipoCambio;
            this.cajo = cajo;
            this.documento = documento;
           
            this.pagos = pagos;
            this.cuenta = cuenta;
        }
        public async Task<IActionResult> OnGetAsync(int id, string Fecha, int idUsuario)
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "37").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
                Cajos = await cajo.ObtenerLista("");
                var FechaCierre = Convert.ToDateTime(Fecha);
                Cierres = await service.ObtenerCierre(id,FechaCierre, idUsuario);
                var idCajero = Cierres.idUsuario;
              
                Users = await users.ObtenerPorId(idCajero);
                Caja = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Caja").Select(s1 => s1.Value).FirstOrDefault();

                ParametrosFiltros filtro = new ParametrosFiltros();
                filtro.FechaInicial = DateTime.Now;
                TC = await tipoCambio.ObtenerLista(filtro);

                filtro.FechaInicial = Cierres.FechaCaja;
                filtro.FechaFinal = Cierres.FechaCaja;
                filtro.Codigo3 = Cierres.idCaja;

                Documento = await documento.ObtenerLista(filtro); //Documentos de la fecha de la caja y de la caja


                filtro.Codigo1 = Cierres.idCaja;
                Pagos = await pagos.ObtenerLista(filtro); //aqui nos traemos los pagos de la caja

                
                

                CuentasBancarias = await cuenta.ObtenerLista("");


              
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
