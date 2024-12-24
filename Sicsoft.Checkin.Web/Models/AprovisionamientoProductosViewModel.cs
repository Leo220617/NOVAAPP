namespace NOVAAPP.Models
{
    public class AprovisionamientoProductosViewModel
    {
        public AprovisionamientoProductos[] AprovisionamientoProductos { get; set; }
    }
    public class AprovisionamientoProductos
    {
        public string Codigo_Articulo { get; set; }

        public string Nombre_Aritculo { get; set; }

        public string Grupo_Articulo { get; set; }

        public string Bodega { get; set; }

        public decimal Stock_en_Bodega { get; set; }

        public decimal Pedido { get; set; }

        public string Cod_Proveedor { get; set; }

        public string Proveedor { get; set; }

        public decimal Ultimo_Precio_Compra { get; set; }

        public decimal Costo_Promedio { get; set; }

        public decimal Promedio_Venta_Ult_3_Meses { get; set; }

        public decimal Desviacion_Estandar { get; set; }

        public decimal Inventario_Ideal { get; set; }

        public decimal Indicador_ST { get; set; }

        public decimal Pedido_Sugerido { get; set; }

        public string Cat_Art_en_Bodega { get; set; }

        public string Cod_Relac { get; set; }

        public string Nombre_de_Articulo_Relac { get; set; }

        public decimal Stock_Relac { get; set; }

        public decimal Pedido_Relac { get; set; }

        public decimal Sugerido_Relac { get; set; }



    }
}
