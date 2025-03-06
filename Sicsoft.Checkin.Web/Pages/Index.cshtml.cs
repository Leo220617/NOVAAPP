﻿using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Refit;
using Sicsoft.Checkin.Web.Servicios;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Sicsoft.Checkin.Web.Pages
{
    [Microsoft.AspNetCore.Authorization.Authorize]
    public class IndexModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;
        

        public IndexModel(ILogger<IndexModel> logger)
        {
            _logger = logger;
            
        }

        public async Task<IActionResult> OnGetAsync()
        {
            try
            {
                

                return Page();


            }
            catch (ApiException ex)
            {

                Errores error = JsonConvert.DeserializeObject<Errores>(ex.Content.ToString());
                ModelState.AddModelError(string.Empty, error.Message);

                return Page();
            }
        }
        public async Task<IActionResult> OnGetSesion()
        {
            try
            {


                var authTime = User.Claims.FirstOrDefault(c => c.Type == "auth_time")?.Value;
                var expTime = User.Claims.FirstOrDefault(c => c.Type == "exp")?.Value;

                if (string.IsNullOrEmpty(expTime) || !User.Identity.IsAuthenticated)
                {
                    var objeto2 =
                   new { status = "Inactive", expiresAt = DateTimeOffset.FromUnixTimeSeconds(long.Parse(expTime)) }; // Si la sesión expiró, devuelve 401
                    return new JsonResult(objeto2);

                }

                var expiration = DateTimeOffset.FromUnixTimeSeconds(long.Parse(expTime));


                var objeto =
                    new { status = "active", expiresAt = expiration };


                return new JsonResult(objeto);
            }
            catch (ApiException ex)
            {



                return new JsonResult(ex.Content.ToString());
            }
            catch (Exception ex)
            {



                return new JsonResult(ex.Message.ToString());
            }
        }
    }
}
