using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using NOVAAPP.Models;
using Refit;
using Sicsoft.Checkin.Web.Models;

using Sicsoft.Checkin.Web.Servicios;

namespace NOVAAPP.Pages.Sucursales
{
    [AllowAnonymous]
    [DisableRequestSizeLimit]
    [RequestSizeLimit(long.MaxValue)]

    public class UsuariosSucursalesModel : PageModel
    {
        private readonly IConfiguration configuration;
        private readonly ICrudApi<SucursalesViewModel, string> sucursales;
        private readonly ICrudApi<UsuariosViewModel, int> usuarios;
        private readonly ICrudApi<UsuariosSucursalesViewModel, string> usuSuc;
        private readonly ICrudApi<RolesViewModel, int> roles;


        [BindProperty]
        public SucursalesViewModel Sucursales { get; set; }

        [BindProperty]
        public UsuariosSucursalesViewModel[] UsuSucMios { get; set; }

        [BindProperty]
        public UsuariosSucursalesViewModel[] UsuSuc { get; set; }

        [BindProperty]
        public UsuariosViewModel[] UsuariosMiosS { get; set; }

        [BindProperty]
        public UsuariosViewModel[] UsuariosS { get; set; }




        [BindProperty(SupportsGet = true)]
        public ParametrosFiltros filtro { get; set; }


        public UsuariosSucursalesModel(ICrudApi<UsuariosViewModel, int> usuarios, ICrudApi<SucursalesViewModel, string> sucursales, ICrudApi<UsuariosSucursalesViewModel, string> usuSuc, ICrudApi<RolesViewModel, int> roles)
        {
            this.usuarios = usuarios;
            this.sucursales = sucursales;
            this.usuSuc = usuSuc;
            this.roles = roles;
        }
        public async Task<IActionResult> OnGetAsync(string id)
        {
            try
            {
                var Roles1 = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles1.Where(a => a == "18").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }

                Sucursales = await sucursales.ObtenerPorIdString(id);
               





                return Page();
            }
            catch (ApiException ex)
            {
                Errores error = JsonConvert.DeserializeObject<Errores>(ex.Content.ToString());
                ModelState.AddModelError(string.Empty, error.Message);

                return Page();
            }
        }
        public async Task<IActionResult> OnGetSucursales(string id)
        {
            try
            {
                var Roles = await roles.ObtenerLista("");

                var Rol = Roles.Where(a => a.NombreRol.ToLower().Contains("Cajero".ToLower())).FirstOrDefault();
                filtro.Codigo1 = Convert.ToInt32(Rol.idRol);

                var UsuariosGenerales = await usuarios.ObtenerLista(filtro); //Carga todos los usuarios cajeros que existan
                //UsuariosGenerales = UsuariosGenerales.Where(a => a.Activo == true).ToArray();

                filtro.Texto = id;
                UsuSucMios = await usuSuc.ObtenerLista(filtro); //Llamada a la tabla de seguridadRolesModulos que contenga el idRol
                
                UsuariosMiosS = new UsuariosViewModel[UsuSucMios.Length]; //hace un vector del tamaño de la cantidad de seguridadrolesmodulos que existen 
              
                for (int j = 0; j < UsuariosMiosS.Length; j++)
                {
                    UsuariosMiosS[j] = new UsuariosViewModel();
                }



                var i = 0;
                foreach (var item in UsuSucMios.Where(a => a.idUsuario != 0))
                {
                    var Usuario = UsuariosGenerales.Where(a => a.id == item.idUsuario).FirstOrDefault(); //Busco el modulo en los mios
                    UsuariosMiosS[i].id = Usuario.id;
                    UsuariosMiosS[i].NombreUsuario = Usuario.NombreUsuario;

                    i++;

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
                recibido.usuarios = recibido.usuarios.Replace("ProdCadenaM", "usuSuc");
                VectorUsuarios usuariosSucursales1 = JsonConvert.DeserializeObject<VectorUsuarios>(recibido.usuarios);
                UsuariosSucursalesViewModel[] usuariosSucursales = new UsuariosSucursalesViewModel[usuariosSucursales1.usuSuc.Length];


                short cantidad = 0;
                if (usuariosSucursales.Length > 0)
                {

                    foreach (var item in usuariosSucursales1.usuSuc)
                    {

                        usuariosSucursales[cantidad] = new UsuariosSucursalesViewModel();
                        usuariosSucursales[cantidad].CodSuc = recibido.CodSuc;
                        usuariosSucursales[cantidad].idUsuario = item.id;

                        cantidad++;
                    }
                }
                else
                {
                    usuariosSucursales = new UsuariosSucursalesViewModel[1];
                    usuariosSucursales[0] = new UsuariosSucursalesViewModel();
                    usuariosSucursales[0].CodSuc = recibido.CodSuc;
                    usuariosSucursales[0].idUsuario = 0;
                }

                await usuSuc.AgregarBulk(usuariosSucursales);
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
