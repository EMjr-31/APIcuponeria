
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
                    console.log(dat);
                    //jQuery.each(datos, function(i,dat){
                        var btnEditar='<button type="button" class="btn btn-warning openModal" data-op="2" data-bs-toggle="modal" data-bs-target="#modalEditorial" data-codigo="'+dat.cupon.ID_Cupon+'" data-nombre="'+dat.cupon.Titulo_Cupon+'" data-contacto="'+dat.cupon.Precio_Oferta_Cupon+'" data-telefono="'+dat.cupon.Cantidad_Cupon+'"><i class="fa-solid fa-edit"></i></button>';
                        var btnEliminar='<button type="button" class="btn btn-danger delete"  data-codigo="'+dat.cupon.ID_Cupon+'" data-nombre="'+dat.cupon.Titulo_Cupon+'"><i class="fa-solid fa-trash"></i></button>';
                        $('#contenido').append('<tr><td>'+1+'</td><td>'+dat.cupon.ID_Cupon+'</td><td>'+dat.cupon.Titulo_Cupon+'</td><td> $ '+dat.cupon.Precio_Oferta_Cupon+'</td><td>'+dat.cupon.Cantidad_Cupon+'</td><td>'+btnEditar+'  '+btnEliminar+'</td></tr>')
                    ///})
                }
            },
            error:function(){
                show_alerta('Error al mostrar los editoriales','error');
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
        alert(url);
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
    $('#codigo_editorial').removeAttr('disabled','');
    $('#codigo_editorial').val('');
    $('#nombre_editorial').val('');
    $('#contacto').val('');
    $('#telefono').val('');
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