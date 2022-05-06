
var gender = ""
var genderUP = ""

var male = document.getElementById("male")
var female = document.getElementById("female")

var maleup = document.getElementById("maleUP")
var femaleup = document.getElementById("femaleUP")

var alsoData = {}

male.addEventListener('click', function (event) {
  gender = "Masculino"
  console.log(gender)
});

female.addEventListener('click', function (event) {
 gender = "Femenino"
 console.log(gender)
});

maleup.addEventListener('click', function (event) {
  genderUP = "Masculino"
  console.log(genderUP)
});

femaleup.addEventListener('click', function (event) {
 genderUP = "Femenino"
 console.log(genderUP)
});

var key = localStorage.getItem("keyId");
var arrayDataUser = localStorage.getItem("myData");
var xs = JSON.parse(arrayDataUser)

verifyDataUser()

function verifyDataUser(){
  if(xs != null){
    if(xs.profileCompleted == 0){
      showModalUpdate()
    }else{
      console.log(xs)
    }
  }
}

function registerUser(){

    var name = document.getElementById("name").value
    var lastname = document.getElementById("lastname").value
    var dni = document.getElementById("dni").value
    var phone = document.getElementById("phone").value
    var email = document.getElementById("emailreg").value
    var password = document.getElementById("pass").value
    var repassword = document.getElementById("repass").value
    var check = document.getElementById("checkterms")
    var btnRegister = document.getElementById("btnRegister")

    var loaderRegister = document.getElementById("onRegisterLoader")
    var divLoader = document.getElementById("divLoaderRegister")
  
    if(gender != ""){
  
      if(name != "" && lastname != "" && dni != "" && phone != "" && email != "" && password != ""){

        if(password == repassword){

            if(check.checked == true){

                btnRegister.style = "display:none;"
                divLoader.style = "display:block;margin-bottom: 15px;margin-top: 10px;" 
                loaderRegister.style = "display:block;"
               
  
                firebase.auth().createUserWithEmailAndPassword(email, password).then((userCredential) => {
                  // Signed in
                  var user = userCredential.user.uid;
             
                  var data = {id:user,firstName:name,lastName:lastname,email:email,image:"",
                   mobile:parseInt(phone),gender:gender,profileCompleted:1,type_user:"client",dni:dni,code_client:dni+aleatorio(1000,9999)}
                  
                   firestore.collection("users").add(data).then(function() {     
                      alertify.success('Cuenta creada!');
                      localStorage.setItem('keyId',user)
                      localStorage.setItem('myData', JSON.stringify(data))
                      location.reload();
                    })
                .catch(function(error) {
                    alertify.alert('Alerta','Error al almacenar datos!');
                    btnRegister.style = "display:block;"
                    divLoader.style = "display:none;"
                    loaderRegister.style = "display:none;"
                });
                   // ...
                })
                .catch((error) => {
                  var errorCode = error.code;
                  var errorMessage = error.message;
                  alertify.alert('Alerta','Error al crear cuenta!');
                  btnRegister.style = "display:block;"
                  divLoader.style = "display:none;"
                  loaderRegister.style = "display:none;"
                  // ..
                });
              }else{
                alertify.alert('Hey!','Debe aceptar los terminos de condiciones!')
              }
        }else{
            alertify.alert('Hey!','Las contraseñas deben ser iguales!')
        }        
      }else{
        alertify.alert('Hey!','Complete los campos!')
      }
  
      
    }else{
      alertify.alert('Hey!','Seleccione su género!')
    }
  
  }


function registerWithGoogle(){

    var provider = new firebase.auth.GoogleAuthProvider();
    var btnGoogle = document.getElementById("btnGoogle")
    var loaderLogin = document.getElementById("onLoginLoader")
    var divLoader = document.getElementById("divsloader")
    var isLogged = ""
    var firstname = ""
    divLoader.style = "display:block;"
    loaderLogin.style = "display:block;margin-bottom: 2px;"
    btnGoogle.style = "display:none;"
    
    firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user.uid;
    var getname = result.user.displayName
    var stName = getname.split(" ")
    firstname = stName[0]
   
    firestore.collection("users").doc(user).get().then((querySnapshot) => {
      if(querySnapshot.exists){
        isLogged = "logged"
        alertify.success('Session activada!')
        localStorage.setItem('keyId',user)
        localStorage.setItem('myData', JSON.stringify(querySnapshot.data()))
        location.reload();
      } else{
        
       
        alsoData = {id:user,firstName:firstname,lastName:"",email:result.user.email,image:result.user.photoURL,
                   mobile:0,gender:"",profileCompleted:0,type_user:"client",dni:"",code_client:""}

        firestore.collection("users").doc(user).set(alsoData).then(function() {     
                    localStorage.setItem('keyId',user)
                    localStorage.setItem('myData', JSON.stringify(alsoData))
                    addNavBar()
                    showModalUpdate()
                  })
              .catch(function(error) {
                  console.log(error.message + " , "+error.code)
                  alertify.alert('Alerta','Error al almacenar datos!');
                  btnGoogle.style = "display:block;"
                  loaderLogin.style = "display:none;"
                  divLoader.style = "display:none;"
              });           
        isLogged = "noLogged"
        console.log(alsoData)
      }
      console.log(isLogged)
 }).catch(function(error) {
         console.log(error.message + " , "+error.code)
         btnGoogle.style = "display:block;"
         loaderLogin.style = "display:none;"
         divLoader.style = "display:none;"
}); 
   
    // ...
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
    alertify.error(verifyErrorCode(errorCode))
    console.log(verifyErrorCode(errorCode));
    console.log(errorCode +  " : " + errorMessage);
    btnGoogle.style = "display:block;"
    loaderLogin.style = "display:none;"
    divLoader.style = "display:none;"
  });

}

function verifyErrorCode(message){

  var value = ""

  if(message == "auth/popup-closed-by-user"){
      value = "Cancelado"
  }else{
    value = "Error"
  }

  return value

}

function showModalUpdate(){
  var arrayDataUser = localStorage.getItem("myData");
  var xv = JSON.parse(arrayDataUser)
  $('#myModal').modal('hide')   
  $('.modal-backdrop').hide();
  $('#modalUpdate').modal('toggle') 
  $("#modalUpdate").on('hidden.bs.modal', function (e) {
    $('.modal-backdrop').hide();
});               // initializes and invokes show immediately
  var name = document.getElementById("nameUP")
  var email = document.getElementById("emailregUP")
  name.value = xv.firstName
  email.value = xv.email
}


function updateDataUser(){

    var updatekey = localStorage.getItem("keyId");
    var arrayDataUpdate = localStorage.getItem("myData");
    var xy = JSON.parse(arrayDataUpdate)

    var btnUpdate = document.getElementById("btnUpdateData")
    var loaderUpdate = document.getElementById("onUpdateLoader")
    var divLoader = document.getElementById("divLoaderUpdate")

    var name = document.getElementById("nameUP").value
    var lastname = document.getElementById("lastnameUP").value
    var dni = document.getElementById("dniUP").value
    var phone = document.getElementById("phoneUP").value
    var email = document.getElementById("emailregUP").value
    var check = document.getElementById("checktermsUP")
  
    if(genderUP != ""){
  
      if(name != "" && lastname != "" && dni != "" && phone != "" && email != ""){

            if(check.checked == true){

              btnUpdate.style = "display:none;"
              divLoader.style = "display:block;margin-bottom: 15px;margin-top: 10px;" 
              loaderUpdate.style = "display:block;"
  
              var data = {id:updatekey,firstName:name,lastName:lastname,email:xy.email,image:xy.image,
              mobile:parseInt(phone),gender:genderUP,profileCompleted:1,type_user:"client",dni:dni,code_client:dni+aleatorio(1000,9999)}
             
              firestore.collection("users").doc(updatekey).update(data).then(function() {     
                 localStorage.setItem('keyId',updatekey)
                 localStorage.setItem('myData', JSON.stringify(data))
                 location.reload();
               })
           .catch(function(error) {
               btnUpdate.style = "display:block;"
               divLoader.style = "display:none;"
               loaderUpdate.style = "display:none;"
               console.log(error.message + " , "+error.code)
               alertify.alert('Alerta','Error al almacenar datos!');
           });

              }else{
                alertify.alert('Hey!','Debe aceptar los terminos de condiciones!')
              }
               
      }else{
        alertify.alert('Hey!','Complete los campos!')
      }
    }else{
      alertify.alert('Hey!','Seleccione su género!')
    }
}

function addNavBar(){

  var arrayDataUser = localStorage.getItem("myData");
  var xs = JSON.parse(arrayDataUser)


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
}

function aleatorio(inferior, superior) {
  var numPosibilidades = superior - inferior;
  var aleatorio = Math.random() * (numPosibilidades + 1);
  aleatorio = Math.floor(aleatorio);
  return inferior + aleatorio;
}