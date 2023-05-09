
///Obtener los datos
var urlapi= 'http://localhost:8000/api/usuario';
$('#login_form').on("submit",function(){
    $.ajax({
        type:"POST",
        url:urlapi,
        data:$(this).serialize(),
        success:function(response,responseText){
            if(response.error==true){
                show_alerta("usuario y/o contraseña incorrecta",'error');
            }else{
                show_alerta("Bienvenido",'success');
                let token =response.access_Token;
                localStorage.setItem('token', token);
                window.location.href="index.html";
            }
        }, 
        error:function(response,responseText){
            show_alerta('Error de conexion','error');
        }
    });
    return false;   
})



//Limpiar 
function limpiar(){
   
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