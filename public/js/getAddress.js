
var place = ""
var key = localStorage.getItem("keyId");

if(key != null){
    getAllAddress()
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


function getAllAddress(){
    
    const radios = document.querySelectorAll('input')
    for (const radio of radios) {
          radio.onclick = (e) => {
             place = e.target.value
             console.log(place)
            }
    }
    
    firestore.collection("addresses").get().then((querySnapshot) => {
    
        var ctx = 0;
        var array = []
    
        querySnapshot.forEach((doc) => {
    
            var userId = doc.data().user_id
            var addressUser = doc.data().address
            var note = doc.data().additionalNote
            var latitude = doc.data().latitude
            var longitude = doc.data().longitude
            var name = doc.data().name
            var phone = doc.data().mobileNumber
            var otherDetails = doc.data().otherDetails
            var type = doc.data().type
            var zip = doc.data().zipCode
            var idAddress = doc.id
    
            var object = { additionalNote: note , address : addressUser , latitude : latitude , longitude:longitude, 
                name:name, mobileNumber:phone , otherDetails : otherDetails, type:type , zipCode : zip }
    
            if(userId == key){
    
                array.push(object)
    
                ctx++;
    
                var allValue = "'"+userId+","+addressUser+","+note+","+latitude+","+longitude+","+name+","+phone+","+otherDetails+","+type+","+zip+","+idAddress+"'"
               
                var address = '<tr>';
                address +='<td>'+ctx+'</td>';
                address +='<td>'+name+'</td>';
                address +='<td>'+addressUser+", "+zip+'</td>';
                address +='<td>'+phone+'</td>';
                address +='<td>'+type+'</td>';
                address +='<td><button data-toggle="modal" data-target="#modalAddressEdit" class="btn btn-primary fa fa-edit" onclick="editAddress('+allValue+')"></button></td>';
                address +='</tr>';
                $(address).appendTo('#tbodyAddress');
    
            }     
         
        });
    
        if(ctx == 0 && key != null){
            var addressImg = '<img src="img/no_address.jpg" class="imgAuto">';
            $(addressImg).appendTo('#evaluate');
            document.getElementById("divAddress").remove()
        }
    
        console.log(array)
       /** */
    });
    
    
}



function saveNewAddress(){

    var loader = document.getElementById("preloder")
    var xLoader = document.getElementById("xloader")
   

    var name = document.getElementById("fullname").value
    var phone = document.getElementById("phone").value
    var address = document.getElementById("addressform").value
    var lat = document.getElementById("latitude")
    var lgn = document.getElementById("longitude")
    var reference = document.getElementById("reference").value
    var zipcode = document.getElementById("zip").value
    var details = ""

    if(name != null && phone != null && address != null && lat != null && 
        lgn != null && reference != null && zipcode != null && place != ""){
        
            loader.style = "display:block;"
            xLoader.style = "display:block;"
            var key = localStorage.getItem("keyId");

            var addressObject = {additionalNote : reference , address : address , id : "" , latitude : parseFloat(lat.innerHTML) , 
            longitude : parseFloat(lgn.innerHTML) , mobileNumber : phone , name : name , otherDetails : details , type : place ,
            user_id : key , zipCode : zipcode }

            firestore.collection("addresses").add(addressObject).then(function() {
                        location.reload();
                    }).catch(function(error) {
                        loader.style = "display:none;"
                        xLoader.style = "display:none;"
                        alert('error : ', error)
                    });


        }else{
            alertify.alert('Hey!','Complete los campos!');
        }

}


function editAddress(value){

    var data = value.split(",")
    let userId = data[0]
    let address = data[1]
    let note = data[2]
    let latitude = data[3]
    let longitude = data[4]
    let name = data[5]
    let phone = data[6]
    let otherDetails = data[7]
    let type = data[8]
    let zipCode = data[9]

    document.getElementById("idAddressDoc").innerHTML = data[10]

    init(latitude,longitude)

    var name2 = document.getElementById("fullnameE")
    var phone2 = document.getElementById("phoneE") 
    var address2 = document.getElementById("addressformE") 
    var reference2 = document.getElementById("referenceE") 
    var zipcode2 = document.getElementById("zipE") 
    name2.value = name
    phone2.value = phone
    address2.value = address
    reference2.value = note
    zipcode2.value = zipCode

    if(type == "Casa"){
        place = "Casa"
        document.getElementById("EinlineRadio1").checked = true
    }else if(type == "Oficina"){
        place = "Oficina"
        document.getElementById("EinlineRadio2").checked = true
    }else{
        place = "Otro"
        document.getElementById("EinlineRadio3").checked = true
    }
    
}


function init(lat , lgn) {
    // Configuración del mapa
    var mapProp = {
      center: new google.maps.LatLng(lat,lgn),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    // Agregando el mapa al tag de id googleMap
    var map = new google.maps.Map(document.getElementById("googleMapE"), mapProp);
    
    // Creando un marker en el mapa
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat,lgn),
      map: map,
      title: 'Mi ubicación',
      draggable: true //que el marcador se pueda arrastrar
    });
   
    // Registrando el evento drag, en este caso imprime 
    // en consola la latitud y longitud
    google.maps.event.addListener(marker,'drag',function(event) {
      
      document.getElementById("latitudeX").innerHTML = event.latLng.lat()
      document.getElementById("longitudeX").innerHTML = event.latLng.lng()
  
    });
   
  }


  function deleteAddress(){

    var loader = document.getElementById("preloder")
    var xLoader = document.getElementById("xloader")
    var idDocument = document.getElementById("idAddressDoc")

    loader.style = "display:block;"
    xLoader.style = "display:block;"

    firestore.collection("addresses").doc(idDocument.innerHTML).delete().then(function() {
        location.reload();
    }).catch(function(error) {
        loader.style = "display:none;"
        xLoader.style = "display:none;"
        alert('error : ', error)
    });

  }

  function saveEditAddress(){

    var loader = document.getElementById("preloder")
    var xLoader = document.getElementById("xloader")
    var addressKey = document.getElementById("idAddressDoc")
   
    var name2 = document.getElementById("fullnameE").value
    var phone2 = document.getElementById("phoneE").value
    var address2 = document.getElementById("addressformE").value
    var lat2 = document.getElementById("latitudeX")
    var lgn2 = document.getElementById("longitudeX")
    var reference2 = document.getElementById("referenceE").value
    var zipcode2 = document.getElementById("zipE").value 


    if(name2 != null && phone2 != null && address2 != null && lat2 != null && 
        lgn2 != null && reference2 != null && zipcode2 != null && place != ""){

            loader.style = "display:block;"
            xLoader.style = "display:block;"
            var key = localStorage.getItem("keyId");

            var addressObject = {additionalNote : reference2 , address : address2 , id : address2 , latitude : parseFloat(lat2.innerHTML) , 
            longitude : parseFloat(lgn2.innerHTML) , mobileNumber : phone2 , name : name2 , otherDetails : "" , type : place ,
            user_id : key , zipCode : zipcode2 }
          
            firestore.collection("addresses").doc(addressKey.innerHTML).update(addressObject).then(function() {
                        location.reload();
                    }).catch(function(error) {
                        loader.style = "display:none;"
                        xLoader.style = "display:none;"
                        alertify.alert('Alerta!','Oops hubo un error!'+error.message);
                    });


        }else{
            alertify.alert('Hey!','Complete los campos!');
        }

  }