using Refit;
using Sicsoft.Checkin.Web.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Sicsoft.Checkin.Web.Servicios
{
     

    public interface ICrudApi<TEntity, TKey> where TEntity : class
    {
       
        [Post("")]
        Task<TEntity[]> AgregarBulk([Body] TEntity[] payload);

        [Post("/Insertar")]
        Task<TEntity> Agregar([Body] TEntity payload);

        [Post("/InsertarSubs")]
        Task<TEntity> AgregarSubs([Body] TEntity payload);

        [Post("")]
        Task<TEntity> CambiarClave([Body] TEntity payload);

        [Get("")]
        Task<TEntity> Login(string nombreUsuario, string clave);

        [Get("/InsertarSAP")]
        Task InsertarSAP();


        [Get("/ActualizarConsecutivos")]
        Task ActualizarConsecutivos();

        [Get("/EnviarConsecutivos")]
        Task EnviarConsecutivos();


        [Get("/InsertarSAPByClient")]
        Task InsertarSAPByClient(int id);

        [Get("/InsertarSAPByCardCode")]
        Task InsertarSAPByCardCode(string code);

        [Get("/InsertarSAPByProduct")]
        Task InsertarSAPByProduct(int idBod);

        [Get("/MargenesProductos")]
        Task InsertarMargenes(int idListaPrecio, int idCategoria, string Moneda);

        [Get("/Duplicar")]
        Task DuplicarMargenes(int idListaPrecio, int idCategoria, string Moneda);

        [Get("/Reenvio")]
        Task Reenvio(string code, string correos);


        [Get("/Reenvio")]
        Task Reenvio2(int id, int idLista);



        [Get("")]
        Task<TEntity[]> ObtenerLista<TQuery>(TQuery q);
        [Get("/Emision")]
        Task<TEntity[]> GenerarEmision<TQuery>(TQuery q);

        [Get("/InsertarOrdenes")]
        Task<TEntity[]> InsertarOrdenes<TQuery>(TQuery q);

        [Get("/Recibo")]
        Task<TEntity[]> GenerarRecibo<TQuery>(TQuery q);

        [Get("/")]
        Task<TEntity> ObtenerListaEspecial<TQuery>(TQuery q);

        [Get("/SincronizarSAP")]
        Task<TEntity> SincronizarSAP(int id);
        [Get("/Reclasificacion")]
        Task<TEntity> Reclasificacion(int id);
        [Get("/Consultar")]
        Task<TEntity> ObtenerPorId(int id);

        [Get("/Consultar")]
        Task<TEntity> ObtenerCierre(int id, DateTime Fecha, int idUsuario);

        [Get("/Consultar")]
        Task<TEntity> ObtenerMargen(int idListaPrecio, int idCategoria, string Moneda);


        [Get("/Consultar")]
        Task<TEntity> ObtenerPorIdString(string id);

        [Put("/Actualizar")]
        Task Editar( [Body]TEntity payload);
 
        [Delete("/Eliminar")]
        Task Eliminar(int id);

        [Delete("/Asignar")]
        Task Asignar(int id, int idUsuario);

        [Delete("/CambiarAprobacion")]
        Task Cambiar(int id);

        [Delete("/DesactivarProductos")]
        Task DesactivarProductos(string code);

        [Post("/Eliminar")]
        Task EliminarUsuario(int id, string CedulaJuridica);

        [Delete("/Eliminar")]
        Task EliminarCierre(int idCaja, DateTime Fecha, int idUsuario);




    }
}
