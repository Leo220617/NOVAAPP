namespace NOVAAPP.Models
{
    public class EncRelacionadosViewModel
    {
        public int id { get; set; }
        public int idCategoria { get; set; }
        public string Nombre { get; set; }
        public bool Activo { get; set; }

        public DetRelacionadosViewModel[] Detalle { get; set; }
    }
}
