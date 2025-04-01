using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using NOVAAPP.Models;
using Refit;
using Sicsoft.Checkin.Web.Servicios;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System;
using Castle.Core.Configuration;

namespace NOVAAPP.Pages.Bodegas
{
    public class UsuariosBodegasModel : PageModel
    {
        private readonly IConfiguration configuration;
        private readonly ICrudApi<BodegasViewModel, int> bodegas;
        private readonly ICrudApi<UsuariosViewModel, int> usuarios;
        private readonly ICrudApi<UsuariosBodegasViewModel, int> usuBod;
        private readonly ICrudApi<RolesViewModel, int> roles;



        [BindProperty]
        public BodegasViewModel Bodegas { get; set; }

        [BindProperty]
        public UsuariosBodegasViewModel[] UsuBodMios { get; set; }

        [BindProperty]
        public UsuariosBodegasViewModel[] UsuBod { get; set; }

        [BindProperty]
        public UsuariosViewModel[] UsuariosMiosS { get; set; }

        [BindProperty]
        public UsuariosViewModel[] UsuariosS { get; set; }
        public UsuariosBodegasModel(ICrudApi<UsuariosViewModel, int> usuarios, ICrudApi<BodegasViewModel, int> bodegas, ICrudApi<UsuariosBodegasViewModel, int> usuBod, ICrudApi<RolesViewModel, int> roles)
        {
            this.usuarios = usuarios;
            this.bodegas = bodegas;
            this.usuBod = usuBod;
            this.roles = roles;
        }

        public async Task<IActionResult> OnGetAsync(int id)
        {
            try
            {
                var Roles1 = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles1.Where(a => a == "105").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }

                Bodegas = await bodegas.ObtenerPorId(id);







                return Page();
            }
            catch (ApiException ex)
            {
                Errores error = JsonConvert.DeserializeObject<Errores>(ex.Content.ToString());
                ModelState.AddModelError(string.Empty, error.Message);

                return Page();
            }
        }

        public async Task<IActionResult> OnGetBodegas(int id)
        {
            try
            {
                var Roles = await roles.ObtenerLista("");
                ParametrosFiltros filtro = new ParametrosFiltros();
                var Rol = Roles.Where(a => !a.NombreRol.ToLower().Contains("Admin".ToLower())).FirstOrDefault();
                filtro.Codigo1 = 1;
                filtro.admin = true;


                var UsuariosGenerales = await usuarios.ObtenerLista(filtro); //Carga todos los usuarios que existan
                //UsuariosGenerales = UsuariosGenerales.Where(a => a.Activo == true).ToArray();

                filtro.Codigo1 = id;
                UsuBodMios = await usuBod.ObtenerLista(filtro); //Llamada a la tabla de seguridadRolesModulos que contenga el idRol

                UsuariosMiosS = new UsuariosViewModel[UsuBodMios.Length]; //hace un vector del tamaño de la cantidad de seguridadrolesmodulos que existen 

                for (int j = 0; j < UsuariosMiosS.Length; j++)
                {
                    UsuariosMiosS[j] = new UsuariosViewModel();
                }



                var i = 0;
                foreach (var item in UsuBodMios.Where(a => a.idLogin != 0))
                {
                    var Usuario = UsuariosGenerales.Where(a => a.id == item.idLogin).FirstOrDefault(); //Busco el modulo en los mios
                    if (Usuario != null)
                    {
                        UsuariosMiosS[i].id = Usuario.id;
                        UsuariosMiosS[i].Nombre = Usuario.Nombre;

                        i++;
                    }


                }


                foreach (var item in UsuariosMiosS.Where(a => a.id != 0))
                {
                    UsuariosGenerales = UsuariosGenerales.Where(a => a.id != item.id).ToArray();
                }



                var resp = new
                {
                    UsuariosMiosS,
                    UsuariosGenerales
                };



                return new JsonResult(resp);
            }
            catch (ApiException ex)
            {
                Errores error = JsonConvert.DeserializeObject<Errores>(ex.Content.ToString());
                ModelState.AddModelError(string.Empty, error.Message);

                return new JsonResult(error);
            }
        }

        public async Task<IActionResult> OnPostGenerar(string recibidos)
        {
            try
            {
                recibidos = recibidos.Replace("_", " ");
                RecibidoUsuarios recibido = JsonConvert.DeserializeObject<RecibidoUsuarios>(recibidos);
                recibido.usuarios = recibido.usuarios.Replace("ProdCadenaM", "usuBod");
                VectorUsuarios usuariosBodegas1 = JsonConvert.DeserializeObject<VectorUsuarios>(recibido.usuarios);
                UsuariosBodegasViewModel[] usuariosBodegas = new UsuariosBodegasViewModel[usuariosBodegas1.usuBod.Length];


                short cantidad = 0;
                if (usuariosBodegas.Length > 0)
                {

                    foreach (var item in usuariosBodegas1.usuBod)
                    {

                        usuariosBodegas[cantidad] = new UsuariosBodegasViewModel();
                        usuariosBodegas[cantidad].idBodega = recibido.idBodega;
                        usuariosBodegas[cantidad].idLogin = item.id;

                        cantidad++;
                    }
                }
                else
                {
                    usuariosBodegas = new UsuariosBodegasViewModel[1];
                    usuariosBodegas[0] = new UsuariosBodegasViewModel();
                    usuariosBodegas[0].idBodega = recibido.idBodega;
                    usuariosBodegas[0].idLogin = 0;
                }

                await usuBod.AgregarBulk(usuariosBodegas);
                return new JsonResult(true);
            }
            catch (ApiException ex)
            {
                Errores error = JsonConvert.DeserializeObject<Errores>(ex.Content.ToString());
                ModelState.AddModelError(string.Empty, error.Message);

                return new JsonResult(false);
            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, ex.Message);

                return new JsonResult(false);
            }
        }
    }
}
