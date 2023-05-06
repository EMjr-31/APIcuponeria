
///Obtener los datos
var urlapi= 'http://localhost:8000/api/venta';
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
                    limpiar();
                    ///fechas
                    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                    const dias_semana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
                    $('#Titulo_Cupon').text(dat.cupon.Titulo_Cupon);
                    $('#Descripcion_Cupon').text(dat.cupon.Descripcion_Cupon);
                    $('#Precio_Regular_Cupon').text("Precio Regular: $"+dat.cupon.Precio_Regular_Cupon);
                    $('#Precio_Oferta_Cupon').text("Precio Oferta: $"+dat.cupon.Precio_Oferta_Cupon);
                    $('#Ahorro').text("Ahorro: $"+(dat.cupon.Precio_Regular_Cupon-dat.cupon.Precio_Oferta_Cupon).toFixed(2));
                    var Fecha_Limite_Cupon=new Date(dat.cupon.Fecha_Limite_Cupon);
                    var fechaActual = new Date();
                    if (Fecha_Limite_Cupon<fechaActual){
                        $('#alert').removeClass("d-none");
                        //$('#cliente').addClass("d-none");
                        $('#tFecha_Limite_Cupon').text("EL CUPON YA NO PUEDE SER CANJEADO");
                        $('#pFecha_Limite_Cupon').text("Fecha limite: "+dias_semana[Fecha_Limite_Cupon.getDay()] + ', ' + Fecha_Limite_Cupon.getDate() + ' de ' + meses[Fecha_Limite_Cupon.getMonth()] + ' de ' + Fecha_Limite_Cupon.getUTCFullYear());
                    }else{
                        $('#alert').addClass("d-none");
                       // $('#cliente').removeClass("d-none");
                        $('#Fecha_Limite_Cupon').text("Fecha limite para canjear: "+dias_semana[Fecha_Limite_Cupon.getDay()] + ', ' + Fecha_Limite_Cupon.getDate() + ' de ' + meses[Fecha_Limite_Cupon.getMonth()] + ' de ' + Fecha_Limite_Cupon.getUTCFullYear());
                    }
                    $('#nombre_usuario').val(dat.usuario.Nombre_Usuario);
                    $('#Correo_Usuario').val(dat.usuario.Correo_Usuario);
                    $('#Identificacion_Usuario').val(dat.usuario.Identificacion_Usuario);
                    var Fecha_Compra_Venta =new Date(dat.Fecha_Compra_Venta);
                    $('#Fecha_Compra_Venta').text("Fecha de compra: "+dias_semana[Fecha_Compra_Venta.getDay()] + ', ' + Fecha_Compra_Venta.getDate() + ' de ' + meses[Fecha_Compra_Venta.getMonth()] + ' de ' + Fecha_Compra_Venta.getUTCFullYear());
                    var estado =dat.Estado_Canje_Venta;
                    if (estado==0){
                        $('#Fecha_Canje_Venta').text("El cupon no ha sido canjeado:");
                    }else{
                        var Fecha_Canje_Venta =new Date(dat.Fecha_Canje_Venta);
                        $('#Fecha_Canje_Venta').text("El cupon fue canjeado: "+dias_semana[Fecha_Canje_Venta.getDay()] + ', ' + Fecha_Canje_Venta.getDate() + ' de ' + meses[Fecha_Canje_Venta.getMonth()] + ' de ' + Fecha_Canje_Venta.getUTCFullYear());    
                    }
                   



                    //jQuery.each(datos, function(i,dat){
                        var btnEditar='<button type="button" class="btn btn-warning openModal" data-op="2" data-bs-toggle="modal" data-bs-target="#modalEditorial" data-codigo="'+dat.cupon.ID_Cupon+'" data-nombre="'+dat.cupon.Titulo_Cupon+'" data-contacto="'+dat.cupon.Precio_Oferta_Cupon+'" data-telefono="'+dat.cupon.Cantidad_Cupon+'"><i class="fa-solid fa-edit"></i></button>';
                        var btnEliminar='<button type="button" class="btn btn-danger delete"  data-codigo="'+dat.cupon.ID_Cupon+'" data-nombre="'+dat.cupon.Titulo_Cupon+'"><i class="fa-solid fa-trash"></i></button>';
                        $('#contenido').append('<tr><td>'+1+'</td><td>'+dat.cupon.ID_Cupon+'</td><td>'+dat.cupon.Titulo_Cupon+'</td><td> $ '+dat.cupon.Precio_Oferta_Cupon+'</td><td>'+dat.cupon.Cantidad_Cupon+'</td><td>'+btnEditar+'  '+btnEliminar+'</td></tr>')
                    ///})
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
    var codigo_editorial=$('#busca_codigo_editorial').val().trim();
    let reg = /^(VE)[0-9]{4}$/;
    if(reg.test(codigo_editorial)){
        url=urlapi+"/"+codigo_editorial;
        getDatos(url);

    }else{
        show_alerta('Formato incorrecto de codigo','error');
    }
    
});

//Ventana modal
$(document).on('click','.openModal', function(){
    var opcion=$(this).attr('data-op');
    limpiar();
    if(opcion==1){
        $('#titulo_modal').html('Ingresar Editorial');
        $('#btnGuardar').attr('data-operacion',1);
        window.setTimeout(function(){
            $('#codigo_editorial').trigger('focus');
        },500);
    }else{
        $('#codigo_editorial').attr('disabled','');
        $('#titulo_modal').html('Editar Editorial');
        $('#btnGuardar').attr('data-operacion',2);
        var codigo=$(this).attr('data-codigo');
        var nombre=$(this).attr('data-nombre');
        var contacto=$(this).attr('data-contacto');
        var telefono=$(this).attr('data-telefono');
        $('#codigo_editorial').val(codigo);
        $('#nombre_editorial').val(nombre);
        $('#contacto').val(contacto);
        $('#telefono').val(telefono);
        window.setTimeout(function(){
            $('#nombre_editorial').trigger('focus');
        },500);
    }
});

///Guardar
$(document).on('click','#btnGuardar',function(){
    var codigo=$('#codigo_editorial').val().trim();
    var nombre=$('#nombre_editorial').val().trim();
    var contacto=$('#contacto').val().trim();
    var telefono=$('#telefono').val().trim();
    var opcion=$('#btnGuardar').attr('data-operacion');
    if(opcion=='1'){
        metodo='POST';
        parametros={
            codigo_editorial:codigo,
            nombre_editorial:nombre,
            contacto:contacto,
            telefono:telefono
        };
        url=urlapi;
    }else{
        metodo='PUT';
        parametros={
            codigo_editorial:codigo,
            nombre_editorial:nombre,
            contacto:contacto,
            telefono:telefono
        };
        url=urlapi+'/'+codigo;
    }
    if(codigo==''){
        show_alerta('Ingeres el codigo del editorial','warning','codigo');
    }else if(nombre==''){
        show_alerta('Ingeres el nombre del editorial','warning','nombre');
    }else if(contacto==''){
        show_alerta('Ingeres el contacto','warning','contacto');
    }else if(telefono==''){
        show_alerta('Ingeres el telefono','warning','telefono');
    }else{
        enviarSolicitud(metodo,parametros,url);
    }
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
                var mensaje;
                switch(metodo){
                    case 'POST':
                        mensaje="Editorial guardo con exitos"
                        break;
                    case 'PUT':
                        mensaje="Se guardaron los cambios"
                        break;
                        case 'delete':
                        mensaje="Editorial Eliminado"
                        break;
                };
                show_alerta(mensaje,'success');
                $('#btnCerrar').trigger('click');
                getDatos();
            }
        },
        error:function(){
            show_alerta('Error en la solicitud','error');
        }
    });
}
///Eliminar 
$(document).on('click','.delete',function(){
    var codigo=$(this).attr('data-codigo');
    var nombre=$(this).attr('data-nombre');
    const swalWithBootstrapButtons=Swal.mixin({
        customClass:{confirmButton:'btn btn-success ms-3',cancelButton:'btn btn-danger'},buttonsStyling:false
    });
    swalWithBootstrapButtons.fire({
        title:'Seguro de eliminar el editorial: ' +nombre,
        text:'Se perdera la informacion del inventario',
        icon:'question',
        showCancelButton: true,
        confirmButtonText:'Eliminar',
        cancelButtonText:'Cancelar',
        reverseButtons:true
    }).then((result=>{
        if(result.isConfirmed){
            url=urlapi+'/'+codigo;
            enviarSolicitud('delete',{codigo_editorial:codigo},url);
        }else{
            show_alerta('El producto no fue eliminado','error');
        }
    }));
});

//Limpiar 
function limpiar(){
    //$('#codigo_editorial').removeAttr('disabled','');
    $('#btnbuscar').val('');
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