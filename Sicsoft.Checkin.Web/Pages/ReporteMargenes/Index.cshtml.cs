using Castle.Core.Configuration;
using ClosedXML.Excel;
using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using NOVAAPP.Models;
using Refit;
using Sicsoft.Checkin.Web.Servicios;
using System;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;


namespace NOVAAPP.Pages.ReporteMargenes
{
    public class IndexModel : PageModel
    {
        private readonly IConfiguration configuration;
        private readonly ICrudApi<ReporteMargenesViewModel, int> service;
        private readonly ICrudApi<ListaPreciosViewModel, int> listas;
        private readonly ICrudApi<CategoriasViewModel, int> categorias;

        [BindProperty(SupportsGet = true)]
        public ParametrosFiltros filtro { get; set; }

        [BindProperty]
        public ReporteMargenesViewModel[] Objeto { get; set; }


        [BindProperty]
        public ListaPreciosViewModel[] ListaPrecios { get; set; }

        [BindProperty]
        public CategoriasViewModel[] Categorias { get; set; }



        public IndexModel(ICrudApi<ReporteMargenesViewModel, int> service, ICrudApi<ListaPreciosViewModel, int> listas, ICrudApi<CategoriasViewModel, int> categorias)
        {
            this.service = service;
            this.listas = listas;
            this.categorias = categorias;
        }
        public async Task<IActionResult> OnGetAsync()
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "127").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
                if (filtro.Codigo1 == 0)
                {
                    filtro.Codigo1 = 1;
                }
                if (filtro.Codigo2 == 0 )
                {
                    filtro.Codigo2 = 1;
                }
                
                if (filtro.Codigo2 == 15151515)
                {
                    filtro.Codigo2 = 0;
                }
                ListaPrecios = await listas.ObtenerLista("");
                Categorias = await categorias.ObtenerLista("");
                Objeto = await service.ObtenerLista(filtro);


                return Page();
            }
            catch (ApiException ex)
            {
                Errores error = JsonConvert.DeserializeObject<Errores>(ex.Content.ToString());
                ModelState.AddModelError(string.Empty, error.Message);

                return Page();
            }
        }
        public async Task<IActionResult> OnGetEliminar(int id)
        {
            try
            {

                await service.Eliminar(id);
                return new JsonResult(true);
            }
            catch (ApiException ex)
            {
                return new JsonResult(false);
            }
        }
        public async Task<IActionResult> OnGetExcelMasivoAsync()
        {
            try
            {
                filtro.Codigo1 = 0;
                filtro.Codigo2 = 0;

                var datos = await service.ObtenerLista(filtro);

                using var workbook = new XLWorkbook();
                var ws = workbook.Worksheets.Add("Reporte Margenes");

                ws.Cell(1, 1).Value = "Producto";
                ws.Cell(1, 2).Value = "Categoria";
                ws.Cell(1, 3).Value = "Lista Precio";
                ws.Cell(1, 4).Value = "Precio Cob";
                ws.Cell(1, 5).Value = "MargenMin";
                ws.Cell(1, 6).Value = "Margen";
                ws.Cell(1, 7).Value = "Precio";
                ws.Cell(1, 8).Value = "Precio Imp";
                ws.Cell(1, 9).Value = "Escalonado";
                ws.Cell(1, 10).Value = "CantMin1";
                ws.Cell(1, 11).Value = "Margen1";
                ws.Cell(1, 12).Value = "CantMin2";
                ws.Cell(1, 13).Value = "Margen2";
                ws.Cell(1, 14).Value = "CantMin3";
                ws.Cell(1, 15).Value = "Margen3";
                ws.Cell(1, 16).Value = "PrecioFijo";
                ws.Cell(1, 17).Value = "Seteable";

                int fila = 2;

                foreach (var item in datos)
                {
                    ws.Cell(fila, 1).Value = item.ItemCode + " - " + item.Nombre;
                    ws.Cell(fila, 2).Value = item.Categoria + " - " + item.NombreCategoria;
                    ws.Cell(fila, 3).Value = item.ListaPrecio;
                    ws.Cell(fila, 4).Value = item.PrecioCob;
                    ws.Cell(fila, 5).Value = item.MargenMin;
                    ws.Cell(fila, 6).Value = item.Margen;
                    ws.Cell(fila, 7).Value = item.Precio;
                    ws.Cell(fila, 8).Value = item.Precio * 1.13m;
                    ws.Cell(fila, 9).Value = item.Escalonado ? "SI" : "NO";
                    ws.Cell(fila, 10).Value = item.CantMin1;
                    ws.Cell(fila, 11).Value = item.Margen1;
                    ws.Cell(fila, 12).Value = item.CantMin2;
                    ws.Cell(fila, 13).Value = item.Margen2;
                    ws.Cell(fila, 14).Value = item.CantMin3;
                    ws.Cell(fila, 15).Value = item.Margen3;
                    ws.Cell(fila, 16).Value = item.PrecioFijo ? "SI" : "NO";
                    ws.Cell(fila, 17).Value = item.Seteble ? "SI" : "NO";

                    fila++;
                }

                ws.Row(1).Style.Font.Bold = true;
                ws.Columns().Width = 18;

                using var stream = new MemoryStream();
                workbook.SaveAs(stream);

                return File(
                    stream.ToArray(),
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    $"ReporteMargenesMasivo_{DateTime.Now:yyyyMMddHHmmss}.xlsx"
                );
            }
            catch (Exception ex)
            {
                ModelState.AddModelError(string.Empty, ex.Message);
                return Page();
            }
        }
    }
}
