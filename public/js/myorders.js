 var key = localStorage.getItem("keyId");
 var jsonOrders = []

 if(key != null){
    getOrders()
}
else{
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


function getOrders(){
    firestore.collection("orders").get().then((querySnapshot) => {

        var count = 0;
        var position = 0;
    
        querySnapshot.forEach((doc) => {
          
            var id = doc.data().user_id
            var title = doc.data().title
            var valueDate = doc.data().order_datetime
            var status = doc.data().status
    
            var date = new Date(valueDate);
            var theyear = date.getFullYear();
            var themonth = date.getMonth()+1;
            var thetoday = date.getDate();
    
            if(themonth <= 9){
              themonth = "0"+themonth
            }
    
            if(thetoday <= 9){
              thetoday = "0"+thetoday
            }
    
            var finalDate = thetoday+"/"+themonth+"/"+theyear
    
    
            if(id == key){
    
                var join = ""
                
                count++
                jsonOrders.push(doc.data())
        
                var order = '<tr>';
                order +='<td>'+count+'</td>';
                order +='<td>'+title+'</td>';
                order +='<td>'+finalDate+'</td>';
    
                if(status == 0){
                    order +='<td><label class="badge badge-danger">Pendiente</label></td>';
                }else if(status == 1){
                    order +='<td><label class="badge badge-warning">Procesando</label></td>';
                }
                else if(status == 2){
                    order +='<td><label class="badge badge-info">En ruta</label></td>';
                }
                else if(status == 3){
                    order +='<td><label class="badge badge-success">Completado</label></td>';
                }
                else if(status == 4){
                    order +='<td><label class="badge badge-info">Enviando</label></td>';
                }
                else if(status == -1){
                    order +='<td><label class="badge badge-danger">Cancelado</label></td>';
                }
                order +='<td><button class="btn btn-primary" onClick="detailOrder('+position+')" data-toggle="modal" data-target="#modalDetail"><i class="fa fa-eye" aria-hidden="true"></i></button></td>';
                order +='</tr>';
                $(order).appendTo('#mytbody');

                position++;
    
            }
            
        }); 
    
        if(count == 0 && key != null){
            var order = '<img src="img/no_orders.jpg" class="imgAuto">';
            $(order).appendTo('#evaluate');
            document.getElementById("divMyOrders").remove()
        }
      
      }); 
}

function detailOrder(position){

    var pos = parseInt(position)
    var items = ''
    var divItems = document.getElementById("rowItems")
    divItems.textContent = '';

    var idOrder = document.getElementById("idOrder")
    var typePayment = document.getElementById("typePayment")
    var amountToPay = document.getElementById("amountToPay")
    var subTotal = document.getElementById("subTotal")
    var totalPay = document.getElementById("totalPay")
    var shipping = document.getElementById("shipping")
    var orderDate = document.getElementById("orderDate")
    var date = document.getElementById("date")
    var address = document.getElementById("address")
    var typePlace = document.getElementById("typePlace")
    var status = document.getElementById("status")
    var circle = document.getElementById("statusCircle")

    if(jsonOrders[pos].status == 0){
    status.innerHTML = "Estado : Pendiente"
    circle.style = "font-size: 15px;color:red;"
    }else if(jsonOrders[pos].status == 1){
        status.innerHTML = "Estado : Procesando" 
        circle.style = "font-size: 15px;color:#ffc82f;"
    }else if(jsonOrders[pos].status == 2){
        status.innerHTML = "Estado : En ruta"
        circle.style = "font-size: 15px;color:#0040a0;"
    }else if(jsonOrders[pos].status == 3){
        status.innerHTML = "Estado : Completado"
        circle.style = "font-size: 15px;color:#5bbd00;"
    }else if(jsonOrders[pos].status == 4){
        status.innerHTML = "Estado : Enviando"
        circle.style = "font-size: 15px;color:#0040a0;"
    }else{
        status.innerHTML = "Estado : Cancelado"
        circle.style = "font-size: 15px;color:red;"
    }

    idOrder.innerHTML = "ID de pedido : " +jsonOrders[pos].title

    for (i in jsonOrders[pos].items) {

        items += '<div class="row">'
        items += '<div class="col">'
        items += '<div class="card card-2">'
        items += '<div class="card-body">'
        items += '<div class="media">'
        items += '<div class="sq align-self-center "> <img class="img-fluid  my-auto align-self-center mr-2 mr-md-4 pl-0 p-0 m-0" src="'+jsonOrders[pos].items[i].image+'" width="130" height="120" /> </div>'
        items += '<div class="media-body my-auto text-right">'
        items += '<div class="row  my-auto flex-column flex-md-row">'
        items += '<div class="col-auto my-auto"> <h6 class="mb-0 text-right">'+jsonOrders[pos].items[i].title+'</h6></div>'
        items += '</div>'
        items += '</div>'
        items += '</div>'
        items += '<hr class="my-3 ">'
        items += '<div class="row">'
        items += '<div class="col-md-3 mb-3" style="font-weight: 700;text-align: right;">Estado</div>'
        items += '<div class="col mt-auto">'
      
        if(jsonOrders[pos].items[i].status == 0){
            items += '<div class="progress my-auto"> <div class="progress-bar progress-bar rounded" style="width: 25%" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div></div>'
            items += '<div class="media row justify-content-between ">'
            items += '<div class="text-left"><span> <small  class="text-right mr-sm-2"></small><i class="fa fa-circle" style="color:red;""></i></span></div>'
            items += '<div class="flex-col"> <span> <small class="text-right mr-sm-2">Pendiente</small></span></div>'
        }else if(jsonOrders[pos].items[i].status == 1){
            items += '<div class="progress my-auto"> <div class="progress-bar progress-bar rounded" style="width: 50%" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div></div>'
            items += '<div class="media row justify-content-between ">'
            items += '<div class="text-left" style="margin-left:-10px;"><span> <small  class="text-right mr-sm-2"></small><i class="fa fa-circle" style="color:#ffc82f;"></i></span></div>'
            items += '<div class="flex-col"> <span> <small class="text-right mr-sm-2">Procesando</small></span></div>'
        }
        else if(jsonOrders[pos].items[i].status == 2){
            items += '<div class="progress my-auto"> <div class="progress-bar progress-bar rounded" style="width: 75%" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div></div>'
            items += '<div class="media row justify-content-between ">'
            items += '<div class="text-left"><span> <small  class="text-right mr-sm-2"></small><i class="fa fa-circle" style="color:#0040a0;"></i></span></div>'
            items += '<div class="flex-col"> <span> <small class="text-right mr-sm-2">En ruta</small></span></div>'
        }else if(jsonOrders[pos].items[i].status == 3){
            items += '<div class="progress my-auto"> <div class="progress-bar progress-bar rounded" style="width: 100%" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div></div>'
            items += '<div class="media row justify-content-between ">'
            items += '<div class=" text-left" style="margin-left:-10px;"><span> <small  class="text-right mr-sm-2"></small><i class="fa fa-circle" style="color:#5bbd00;"></i></span></div>'
            items += '<div class="flex-col"> <span> <small class="text-right mr-sm-2">Completado</small></span></div>'
        }else if(jsonOrders[pos].items[i].status == 4){
            items += '<div class="progress my-auto"> <div class="progress-bar progress-bar rounded" style="width: 75%" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div></div>'
            items += '<div class="media row justify-content-between ">'
            items += '<div class="text-left"><span> <small  class="text-right mr-sm-2"></small><i class="fa fa-circle" style="color:#0040a0;"></i></span></div>'
            items += '<div class="flex-col"> <span> <small class="text-right mr-sm-2">Enviando</small></span></div>'
        }
        else{
                items += '<div class="progress my-auto"> <div class="progress-bar progress-bar rounded" style="width: 5%" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div></div>'
                items += '<div class="media row justify-content-between ">'
                items += '<div class="text-left"><span> <small  class="text-right mr-sm-2"></small><i class="fa fa-circle" style="color:red;""></i></span></div>'
                items += '<div class="flex-col"> <span> <small class="text-right mr-sm-2">Cancelado</small></span></div>'
        }

        
        items += '<div class="col-auto flex-col-auto"><small  class="text-right mr-sm-2">'+'Cantidad: '+jsonOrders[pos].items[i].cart_quantity+'</small></div>'
        items += '<div class="col-auto flex-col-auto"><small  class="text-right mr-sm-2">Precio: '+'S/'+jsonOrders[pos].items[i].price+'</small></div>'
        items += '</div>'
        items += '</div>'
        items += '</div>'
        items += '</div>'
        items += '</div>'
        items += '</div>'
        items += '</div>'
        items += '<p></p>'

    }

    $(items).appendTo('#rowItems');

    typePayment.innerHTML = jsonOrders[pos].type_payment

    if(jsonOrders[pos].amount_to_pay != ""){
        document.getElementById("divAmountToPay").style = "visibility:visible;"
        amountToPay.innerHTML = "S/"+jsonOrders[pos].amount_to_pay
    }else{
        document.getElementById("divAmountToPay").style = "display:none;"
    }
   

    subTotal.innerHTML = "S/"+jsonOrders[pos].sub_total_amount
    totalPay.innerHTML = "S/"+jsonOrders[pos].total_amount

    if(jsonOrders[pos].shipping_charge == 0.0){

        shipping.innerHTML = "Gratis"

    }else{
        shipping.innerHTML = "S/"+jsonOrders[pos].shipping_charge
    }

   

    orderDate.innerHTML = "Número de pedido : #"+jsonOrders[pos].order_datetime
    date.innerHTML = "Fecha : "+timeConverter(jsonOrders[pos].order_datetime)
    address.innerHTML = "Dirección : "+jsonOrders[pos].address.address
    typePlace.innerHTML = "Tipo : "+jsonOrders[pos].address.type

    console.log(jsonOrders[pos])

}


function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp);
    var months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();

    var stringhour = hour
    var stringmin = min
    var stringseg = sec

    if(hour <=9){
      stringhour = "0"+hour
   }
    if(min <=9){
       stringmin = "0"+min
    }
    if(sec <=9){
      stringseg = "0"+sec
    }

    var time = date + ' ' + month + ' ' + year + ' ' +" - "+ stringhour + ':' + stringmin + ':' + stringseg ;
    return time;

  }