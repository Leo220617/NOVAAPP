namespace NOVAAPP.Models
{

    public class ProveedoresViewModel
    {
        public Proveedores[] Proveedores { get; set; }
    }

    public class Proveedores
    {
        public string CardCode { get; set; }
        public string Nombre { get; set; }
        public string Cedula { get; set; }
        public string Correo { get; set; }
        public string Telefono { get; set; }
    }
}

