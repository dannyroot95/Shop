
var key = localStorage.getItem("keyId");
var arrayAddress = []
var arrayCart = []
var defaultImg = "https://firebasestorage.googleapis.com/v0/b/gestor-de-pedidos-aukdefood.appspot.com/o/order.png?alt=media&token=e4f019a9-bd69-476d-8642-b5b49eaeaeda"

var methodPay = ""
var delivered = document.getElementById("contra-entrega")
var creditCard = document.getElementById("tarjeta")
var home   = document.getElementById("place1")
var office = document.getElementById("place2")
var other  = document.getElementById("place3")

var place = ""

var arrayProductsInCart = localStorage.getItem("cartElements");
    var js = JSON.parse(arrayProductsInCart)
    console.log(js)

if(key != null){
    totalCostRM()
    getItemsCart()
    getDirecctions()
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


delivered.addEventListener('click', function (event) {
    methodPay = "Contra entrega"
    document.getElementById("formAmountToPay").style = "display:block;"
});
creditCard.addEventListener('click', function (event) {
    /*
    methodPay = "Tarjeta de crédito/débito"
    var amount = document.getElementById("amountToPay")
    amount.value = ""
    document.getElementById("formAmountToPay").style = "display:none;"
    */
    methodPay = "Contra entrega"
    document.getElementById("formAmountToPay").style = "display:block;"
});
home.addEventListener('click', function (event) {
    place = "Casa"
});
office.addEventListener('click', function (event) {
    place = "Oficina"
});
other.addEventListener('click', function (event) {
    place = "Otro"
});


function getItemsCart(){

    firestore.collection("cart_items").get().then((querySnapshot) => {

        var ctx = 0;
            
        querySnapshot.forEach((doc) => {
    
            var userId = doc.data().user_id
            var category = doc.data().category
            var delivery = doc.data().delivery
            var qt =    doc.data().cart_quantity
            var img =   doc.data().image
            var price = doc.data().price 
            var store = doc.data().name_store
            var providerId = doc.data().provider_id
            var productId = doc.data().product_id
            var title = doc.data().title
            var keyDoc = "'"+doc.id+","+productId+"'"

            var data = {cart_quantity:qt,category:category,delivery:delivery,id:"",
            image:img,name_store:store,price:price,provider_id:providerId,product_id:productId,user_id:key,status:0,
            stock_quantity:"",title:title}

            if(userId == key){
                
                changeStatusProduct = "'"+doc.id+","+ctx+"'"

                arrayCart.push(data)

                var cart = '<tr>';
                cart +='<td class="product-col">';
                cart +='<img src='+img+' alt="">';
                cart +='<div class="pc-title">';
                cart +='<h4>'+title+'</h4>';
                cart +='<p>'+"S/"+price+'</p>';
                cart +='</div>';
                cart +='</td>';
                cart +='<td class="quy-col">';
                cart +='<div class="quantity">';
                cart +='<div class="pro-qty">';
                cart +='<span class="dec qtybtn" onClick="abstract('+changeStatusProduct+')">-</span>';
                cart +='<input type="text" value='+qt+' id="'+ctx+'" disabled="true">';
                cart +='<span class="inc qtybtn" onClick="plus('+changeStatusProduct+')">+</span>';
                cart +='</div>';
                cart +='</div>';
                cart +='</td>';
                
                cart +='<td class="total-col"><h4>'+"S/"+price+'</h4></td>';
                cart +='<td class="size-col"><a href="#" style="margin-left:10px;"><img src="img/trash.png" width="25" height="25" onClick="deleteItem('+keyDoc+')"></a></td>';
                cart +='</tr>';
                $(cart).appendTo('#tdCart');
    
                ctx++
                               
            }

        }); 
             
    }); 
}


 function deleteItem(keyCart){

    var splitKeys = keyCart.split(",")
    var keyCartItem = splitKeys[0]
    var idProduct = splitKeys[1]

    var arrayProductsInCart = localStorage.getItem("cartElements");
    var js = JSON.parse(arrayProductsInCart)


    var loader = document.getElementById("loadAddToCart")
    loader.style = "display:block;"

    firestore.collection("cart_items").doc(keyCartItem).delete().then(() => {
        for (let i = 0; i < js.length; i++){
            if(js[i].product_id == idProduct){
               js.splice(i, 1)
               localStorage.setItem('cartElements', JSON.stringify(js))
            }
        }
        console.log("Document successfully deleted!");
        location.reload();
    }).catch((error) => {
        loader.style = "display:none;"
        console.error("Error removing document: ", error);
        alertify.error('Error!');
    });

 }

 function plus(params){

    
    var data = params.split(",")
    let keyItem = data[0];
    console.log(keyItem)
    var position = data[1];

    var loader = document.getElementById("loadAddToCart")
    var itemQuantity = parseInt(document.getElementById(position).value)

       var sum = (itemQuantity+1).toString()

        loader.style = "display:block;"
    
        firestore.collection("cart_items").doc(keyItem).update({"cart_quantity": sum}).then(() => {
            console.log("Document successfully deleted!");
            loader.style = "display:none;"
            alertify.success('Actualizado!');
            document.getElementById(position).value = sum
        }).catch((error) => {
            loader.style = "display:none;"
            console.error("Error", error);
            alertify.error('Error!');
        });

   
 }

 function abstract(params){

    var data = params.split(",")
    let keyItem = data[0];
    console.log(keyItem)
    var position = data[1];

    var loader = document.getElementById("loadAddToCart")
    var itemQuantity = parseInt(document.getElementById(position).value)

    if (itemQuantity >1){

        var sum = (itemQuantity-1).toString()

        loader.style = "display:block;"
    
        firestore.collection("cart_items").doc(keyItem).update({"cart_quantity": sum}).then(() => {
            console.log("Document successfully deleted!");
            loader.style = "display:none;"
            alertify.success('Actualizado!');
            document.getElementById(position).value = sum
        }).catch((error) => {
            loader.style = "display:none;"
            console.error("Error", error);
            alertify.error('Error!');
        });

    }
 }

 function totalCostRM(){

    var array = []
    var shipping = 0.0
    var ctx = 0
    var count = 0

    firestore.collection("cart_items").onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
    
            var userId = doc.data().user_id
            var qt =    doc.data().cart_quantity
            var price = doc.data().price 
            var delivery = doc.data().delivery

            if(userId == key){
                count++
                array.push(parseFloat(price)*parseInt(qt))

                if(delivery == "no"){
                    if(ctx == 0){
                        shipping = shipping + 5.00
                        
                    }else{
                        shipping = shipping + 0.50
                    }
                    ctx++
                }

            }     
         
        });

        let totalcost = 0;
        array.forEach(function(a){totalcost += a;});
        document.getElementById("subtotal").innerHTML = "S/"+totalcost.toFixed(2)
        document.getElementById("shipping").innerHTML = "S/"+shipping.toFixed(2)
        document.getElementById("totalcost").innerHTML = "S/"+(totalcost+shipping).toFixed(2)
        document.getElementById("totalPay").innerHTML = "S/"+(totalcost+shipping).toFixed(2)
        array=[]
        ctx=0
        shipping=0

        if(count == 0 && key != null){
            var cartImg = '<img src="img/no_cart_items.jpg" class="imgAuto">';
            $(cartImg).appendTo('#evaluate');
            document.getElementById("secctionCart").remove()
        }

    });

 }

 function getDirecctions(){

    firestore.collection("addresses").get().then((querySnapshot) => {

        var ctx = 0;
       
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
    
            var object = { user_id : userId ,  additionalNote: note , address : addressUser , latitude : latitude , longitude:longitude, 
                name:name, mobileNumber:phone , otherDetails : otherDetails, type:type , zipCode : zip , id:idAddress }
    
            if(userId == key){
    
                arrayAddress.push(object)
       
                var address = '<li class="list-group-item"><input type="radio" class="form-check-input" name="flexRadioDefault" id="radioAddress'+ctx+'">&nbsp;&nbsp;&nbsp;'+" "+addressUser +" ,"+zip+'</li>';
                $(address).appendTo('#checkboxAddress');

                ctx++;
    
            }     
         
        });
    
        console.log(arrayAddress)

       /** */
    });
 }


 function pay(){
   
    var orderDateTime = Date.now();
    var ctx = 0
    var loader = document.getElementById("preloder")
    var xLoader = document.getElementById("xloader")
    var amount = document.getElementById("amountToPay")
    
    var datamap = {action_code : "", action_description : "", adquiriente : "", amount : "", authorization_code : "", 
    brand : "" , card : "" , card_token : "", currency : "" , eci : "", eci_description : "", id_unico : "", installments_info : "",
    merchant : "" , process_code : "", quota_amount : "" , quota_deferred : "", quota_number : "", signature : "", status : "",
    terminal : "", trace_number : "", transaction_date : "", transaction_id : "", vault_block : ""  }

    var subTotal = document.getElementById("subtotal").innerHTML
    var valueSubtotal = subTotal.split("S/")

    var shipping = document.getElementById("shipping").innerHTML
    var valueShipping = shipping.split("S/")

    var total = document.getElementById("totalcost").innerHTML
    var valueTotal = total.split("S/")
   
    var chkAddress = document.getElementsByClassName("form-check-input");

    if(methodPay != ""){

         if(delivered.checked && amount.value != ""){

            if(amount.value >= valueTotal[1] ){

                for(i=0;i<chkAddress.length;i++){
                    if(chkAddress[i].checked){
            
                        ctx++
        
                        if(ctx > 0){
        
                            loader.style = "display:block;"
                            xLoader.style = "display:block;"
        
                            var order = {user_id : key , items : arrayCart , address : arrayAddress[i] , title : "#"+orderDateTime , 
                            image : defaultImg , sub_total_amount : valueSubtotal[1] , shipping_charge : valueShipping[1] , total_amount : valueTotal[1] , 
                            order_datetime : Date.now() , id : "" , status : 0 , type_payment : methodPay , amount_to_pay : amount.value , driver_id : "" , order_card_info : datamap  }
                
                            firestore.collection("orders").add(order).then(function() {
    
                                firestore.collection("cart_items").get().then((querySnapshot) => {
                                        
                                    querySnapshot.forEach((doc) => {
                                        var userId = doc.data().user_id
                                        var idDoc = doc.id
                                        if(userId == key){
                                            firestore.collection("cart_items").doc(idDoc).delete()
                                        
                                        }
                                    });
                                    $('#modalPay').modal('hide');
                                    loader.style = "display:none;"
                                    xLoader.style = "display:none;"
                                    alertify.alert("Su pedido ha sido completado , revise su estado!", function(){
                                        location.href = "myorders.html";
                                    });
                                });
    
                            })
                            .catch(function(error) {
                                loader.style = "display:none;"
                                xLoader.style = "display:none;"
                                alertify.success('No se pudo añadir al carrito!');
                            });
                        }
                        
                    }
                }
                if(ctx == 0){
                    alertify.alert('Alerta!','Seleccione una dirección!');
                }
            }else{
                alertify.alert('Alerta!','El monto debe ser mayor ó igual al precio final!'); 
            }
            
         } else{
            alertify.alert('Hey!','¿Con cuanto va a pagar?');
     }

        
    }else{
        alertify.alert('Alerta!','Seleccione un método de pago!');
    }

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

