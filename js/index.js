$(function(){getDatos();});
///Obtener los datos
var urlapi= 'http://localhost:8000/api/editoriales';
function getDatos(){
    $('#contenido').empty();
    $.ajax(
        {
            type:'GET',
            url:urlapi,
            dataType:'json',
            success: function(respuesta){
                var datos= respuesta;
                if(datos.length>0){
                    jQuery.each(datos, function(i,dat){
                        var btnEditar='<button type="button" class="btn btn-warning openModal" data-op="2" data-bs-toggle="modal" data-bs-target="#modalEditorial" data-codigo="'+dat.codigo_editorial+'" data-nombre="'+dat.nombre_editorial+'" data-contacto="'+dat.contacto+'" data-telefono="'+dat.telefono+'"><i class="fa-solid fa-edit"></i></button>';
                        var btnEliminar='<button type="button" class="btn btn-danger"  data-codigo="'+dat.codigo_editorial+'"><i class="fa-solid fa-trash"></i></button>';
                        $('#contenido').append('<tr><td>'+(i+1)+'</td><td>'+dat.codigo_editorial+'</td><td>'+dat.nombre_editorial+'</td><td>'+dat.contacto+'</td><td>'+dat.telefono+'</td><td>'+btnEditar+'  '+btnEliminar+'</td></tr>')
                    })
                }
            },
            error:function(){
                show_alerta('Error al mostrar los editoriales','error');
            }
        }
    );
}

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
    if(opcion==1){
        metodo='POST';
        parametros={codigo_editorial:codigo,nombre_editorial:nombre,contacto:contacto,telefono:telefono};
        url=urlapi;
    }else{
        metodo='PUT';
        parametros={codigo_editorial:codigo,nombre_editorial:nombre,contacto:contacto,telefono:telefono};
        url=urlapi+'/'+codigo;
        alert(url);
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

function enviarSolicitud(metodo,parametros,urlx){
    $.ajax({
        type:metodo,
        url:urlx,
        data:JSON.stringify(parametros),
        dataType:'json',
        success:function(respuesta){ 
            alert(respuestap[1]);
            alert(respuestap[0]);
            show_alerta(respuestap[1],respuesta[0]);
            if(respuesta[0]==='success'){
                $('#btnCerrar').trigger('click');
                getDatos();
            }
        },
        error:function(){
            show_alerta('Error en la solicitud','error');
        }
    });
}

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