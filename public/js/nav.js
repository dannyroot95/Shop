var key = localStorage.getItem("keyId");
var arrayDataUser = localStorage.getItem("myData");
var xs = JSON.parse(arrayDataUser)


if(key != null && xs.profileCompleted != 0){
    
  document.getElementById("main_navbar").remove()

  var navigation = '<nav class="main-navbar" id="main_navbar">';
  navigation+='<div class="container">';
  navigation+='<ul class="main-menu">';
  navigation+='<li><a href="index.html">Inicio</a></li>';
  navigation+='<li><a href="myorders.html">Mis compras</a></li>';
  navigation+='<li><a href="#">Lista de deseos</a></li>';
  navigation+='<li><a href="address.html">Mis direcciones</a></li>';
  navigation+='</ul>';
  navigation+='</div>';
  navigation+='	</nav>';
  $(navigation).appendTo('#navClient');

}

if(xs.profileCompleted == 0){

  document.getElementById("main_navbar").remove()

  var navigation = '<nav class="main-navbar" id="main_navbar">';
  navigation+='<div class="container">';
  navigation+='<ul class="main-menu">';
  navigation+='<li><a href="index.html">Inicio</a></li>';
  navigation+='<li><a href="https://play.google.com/store/apps/details?id=com.aukdeclient&hl=es">Descarga nuestra app</a>';
  navigation+='<li><a href="#"  data-toggle="modal" data-target="#modalUpdate">Actualizar datos</a></li>';
  navigation+='</ul>';
  navigation+='</div>';
  navigation+='	</nav>';
  $(navigation).appendTo('#navClient');

}

