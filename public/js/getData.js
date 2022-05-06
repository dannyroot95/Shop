
var key = localStorage.getItem("keyId");
var gender = ""


if(key != null){
    getData()
}else{
    var cartImg = '<div style="text-align: center;">';
    cartImg+= '<center><img src="img/error.jpg" class="oops">';
    cartImg+= '<br>';
    cartImg+= '<h2>Debe Iniciar sesión ó Registrarse para acceder</h2>';
    cartImg+= '<br>';
    cartImg+= '<a href="index.html"><button class="btn btn-primary">Volver al inicio</button></a>';
    cartImg+= '</div>';
    $(cartImg).appendTo('#generalBody');
    document.getElementById("generalDiv").remove()
}

function getData(){
    var retrievedObject = localStorage.getItem('myData');
    var js = JSON.parse(retrievedObject)
    console.log(js)
    document.getElementById("imageProfile").src = js["image"]
    document.getElementById("mail").innerHTML = js["email"]
    document.getElementById("name").value = js["firstName"]
    document.getElementById("lastname").value = js["lastName"]
    document.getElementById("codeClient").value = "#"+js["code_client"]
    document.getElementById("codeClient").disabled = true
    document.getElementById("phone").value = js["mobile"]
    document.getElementById("dni").value = js["dni"]
    gender = js["gender"]

if(gender == "Masculino"){
    document.getElementById("male").style = "background-color: #0665a9;color:#fff;"
}else{
    document.getElementById("female").style = "background-color: #0665a9;color:#fff;"
}

}



function changeGenderMale(){
    gender = "Masculino"
    document.getElementById("female").style = "background-color: #fff;color:#000;"
    document.getElementById("male").style = "background-color: #0665a9;color:#fff;"
}

function changeGenderFemale(){
    gender = "Femenino"
    document.getElementById("male").style = "background-color: #fff ;color:#000;"
    document.getElementById("female").style = "background-color: #0665a9;color:#fff;"
}

function updateData(){

    var name = document.getElementById("name").value
    var lastName = document.getElementById("lastname").value
    var phone = document.getElementById("phone").value
    var dni = document.getElementById("dni").value

    var retrievedObject = localStorage.getItem('myData');
    var js = JSON.parse(retrievedObject)
    var codeClient = js["code_client"]
    var email = js["email"]
    var myImageProfile = js["image"]
    var myID = js["id"]
    var profileCompleted = js["profileCompleted"]
    var typeUser = js["type_user"]

    var dataObject = {dni : dni , mobile : phone , firstName : name , lastName : lastName , gender : gender}

    var toCache = {code_client : codeClient , dni : dni , mobile : phone , firstName : name , 
        lastName : lastName , gender : gender, email:email, image : myImageProfile , id : myID , 
        profileCompleted : profileCompleted , type_user : typeUser}

    if(name != "" && lastName != "" && phone != "" && dni != "" && gender != ""){

        document.getElementById("btnUpdate").disabled = true
        document.getElementById("loadAddToCart").style = "display:block;"

        firestore.collection("users").doc(myID).update(dataObject).then(function() {  
            alertify.success('Datos actualizados!')   
            localStorage.setItem('myData', JSON.stringify(toCache))
            document.getElementById("btnUpdate").disabled = false
            document.getElementById("loadAddToCart").style = "display:none;"
          })

      .catch(function(error) {
        document.getElementById("loadAddToCart").style = "display:none;"
        document.getElementById("btnUpdate").disabled = false
          console.log(error.message + " , "+error.code)
          alertify.error('Error al actualizar datos!');
        
      }); 
    }

}