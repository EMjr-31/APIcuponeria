
///Obtener los datos
var urlapi= 'http://localhost:8000/api/venta';
var codigo_venta;
function getDatos(urlbuscar){
    $('#contenido').empty();
    $.ajax(
        {
            type:'GET',
            url:urlbuscar,
            dataType:'json',
            success: function(respuesta){
                var dat= respuesta;
                if(dat){
                    $('#detallesventa').removeClass('d-none');
                    limpiar();
                    ///fechas
                    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                    const dias_semana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
                    $('#Titulo_Cupon').text(dat.cupon.Titulo_Cupon);
                    $('#id').text("Codigo cupon: "+codigo_venta);
                    $('#Descripcion_Cupon').text(dat.cupon.Descripcion_Cupon);
                    $('#Precio_Regular_Cupon').text("Precio Regular: $"+dat.cupon.Precio_Regular_Cupon);
                    $('#Precio_Oferta_Cupon').text("Precio Oferta: $"+dat.cupon.Precio_Oferta_Cupon);
                    $('#m_condigo_venta').val(dat.ID_Venta);
                    $('#Ahorro').text("Ahorro: $"+(dat.cupon.Precio_Regular_Cupon-dat.cupon.Precio_Oferta_Cupon).toFixed(2));
                    var Fecha_Limite_Cupon=new Date(dat.cupon.Fecha_Limite_Cupon);
                    var fechaActual = new Date();
                    if (Fecha_Limite_Cupon<fechaActual){
                        $('#alert').removeClass("d-none");
                        $('#tFecha_Limite_Cupon').text("EL CUPON YA NO PUEDE SER CANJEADO");
                        $('#btnCanjear').addClass("d-none");
                        $('#pFecha_Limite_Cupon').text("Fecha limite: "+dias_semana[Fecha_Limite_Cupon.getDay()] + ', ' + Fecha_Limite_Cupon.getDate() + ' de ' + meses[Fecha_Limite_Cupon.getMonth()] + ' de ' + Fecha_Limite_Cupon.getUTCFullYear());
                    }else{
                        $('#alert').addClass("d-none");
                        $('#Fecha_Limite_Cupon').text("Fecha limite para canjear: "+dias_semana[Fecha_Limite_Cupon.getDay()] + ', ' + Fecha_Limite_Cupon.getDate() + ' de ' + meses[Fecha_Limite_Cupon.getMonth()] + ' de ' + Fecha_Limite_Cupon.getUTCFullYear());
                    }
                    $('#nombre_usuario').val(dat.usuario.Nombre_Usuario);
                    $('#Correo_Usuario').val(dat.usuario.Correo_Usuario);
                    $('#Identificacion_Usuario').val(dat.usuario.Identificacion_Usuario);
                    var Fecha_Compra_Venta =new Date(dat.Fecha_Compra_Venta);
                    $('#Fecha_Compra_Venta').text("Fecha de compra: "+dias_semana[Fecha_Compra_Venta.getDay()] + ', ' + Fecha_Compra_Venta.getDate() + ' de ' + meses[Fecha_Compra_Venta.getMonth()] + ' de ' + Fecha_Compra_Venta.getUTCFullYear());
                    var estado =dat.Estado_Canje_Venta;
                    if (estado==0 && Fecha_Limite_Cupon>fechaActual){
                        $('#Fecha_Canje_Venta').text("El cupon no ha sido canjeado");
                        $('#btnCanjear').removeClass("d-none");
                    }else{
                        $('#btnCanjear').addClass("d-none");
                        if(estado==1){
                            var Fecha_Canje_Venta =new Date(dat.Fecha_Canje_Venta);
                            $('#Fecha_Canje_Venta').text("El cupon fue canjeado: "+dias_semana[Fecha_Canje_Venta.getDay()] + ', ' + Fecha_Canje_Venta.getDate() + ' de ' + meses[Fecha_Canje_Venta.getMonth()] + ' de ' + Fecha_Canje_Venta.getUTCFullYear());    
                        }
                    }
                }
            },
            error:function(){
                show_alerta('Error al mostrar cupon','error');
            }
        }
    );
}

//Buscar
$(document).on('click','#btnbuscar',function(){
    event.preventDefault();
    codigo_venta=$('#busca_codigo_editorial').val().trim();
    console.log(codigo_venta);
    let reg = /^(VE)[0-9]{4}$/;
    if(reg.test(codigo_venta)){
        url=urlapi+"/"+codigo_venta;
        getDatos(url);
    }else{
        $('#detallesventa').addClass('d-none');
        show_alerta('Formato incorrecto de codigo','error');
        
    }
    
});

///Guardar
$(document).on('click','#btnCanjear',function(){
    var Estado_Canje_Venta=1;
    var fechacanje=new Date();
        metodo='PUT';
        parametros={
            Estado_Canje_Venta:Estado_Canje_Venta,
            Fecha_Canje_Venta:fechacanje

        };
        url=urlapi+"/"+codigo_venta;
        enviarSolicitud(metodo,parametros,url);
});
///funcion guardar o eliminar
function enviarSolicitud(metodo,parametros,urlx){
    $.ajax({
        type:metodo,
        url:urlx,
        data:JSON.stringify(parametros),
        contentType:'application/json',
        success:function(respuesta){ 
            if(respuesta=='1'){
                var mensaje="Canjeado con exitos";
                show_alerta(mensaje,'success');
                $('#detallesventa').addClass('d-none');
                limpiar();
            }
            
        },
        error:function(){
            show_alerta('Error al canjear','error');
        }
    });
}
//Limpiar 
function limpiar(){
    //$('#codigo_editorial').removeAttr('disabled','');
    $('#busca_codigo_editorial').val('');
};
///Alertas utilizando Seealert
function show_alerta(mensaje,icono,foco){
    if(foco !==""){
        $('#'+foco).trigger('focus');
    }
    Swal.fire({
        title:mensaje,
        icon:icono,
        customClass:{confirmButton:"btn btn-primaey", popup:'animated xoomIn'},
        buttonsStyling:false
    });
}