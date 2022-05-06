
var config = {
    apiKey: "AIzaSyB0Q44TruQYFZ2Kz1BYapW5UB2eiAj2ZRw",
    authDomain: "gestor-de-pedidos-aukdefood.firebaseapp.com",
    databaseURL: "https://gestor-de-pedidos-aukdefood.firebaseio.com",
    projectId: "gestor-de-pedidos-aukdefood",
    storageBucket: "gestor-de-pedidos-aukdefood.appspot.com",
    messagingSenderId: "550027089460",
    appId: "1:550027089460:web:c5cbabed185feab0215c61",
    measurementId: "G-VZGVWLNCNZ"
  };
  firebase.initializeApp(config);

  let firestore = firebase.firestore();
  var click = 0;

  var key = localStorage.getItem("keyId");
  var arrayDataUser = localStorage.getItem("myData");
  var xs = JSON.parse(arrayDataUser)

  if(key != null && xs != null && xs.profileCompleted != 0){
  getCartElements()
}

  firestore.collection("products").get().then((querySnapshot) => {

    querySnapshot.forEach((doc) => {
      
        var image = doc.data().image
        var nameProduct = doc.data().title 
        var price = doc.data().price;
        var id = doc.id
        var provider = doc.data().provider_id
        var store = doc.data().name_store
        var delivery = doc.data().delivery
        var category = doc.data().type_product
        var description = doc.data().description
        var sku = doc.data().sku
        var stock = doc.data().stock_quantity
        var availability = doc.data().availability
        var open = doc.data().opening_hours
        var close = doc.data().closing_time

        var join = "'"+nameProduct+","+price+","+provider+","+store+","+delivery+","+id+","+category+","+image+"'"

        var joinCompleted = "'"+nameProduct+"%&"+price+"%&"+provider+"%&"+store+"%&"+delivery+"%&"+id+"%&"+category+"%&"+image+"%&"+description+"%&"+sku+"%&"+stock+"%&"+availability+"%&"+open+"%&"+close+"'"

        var prevProducto = '<div class="col-lg-3 col-sm-6"><div class="product-item"><div class="pi-pic">';
        prevProducto+='<img class="static" data-toggle="modal" data-target="#modalProduct" onClick="showDetailProduct('+joinCompleted+')" loading="lazy" src="'+image+'"/>';
        prevProducto+='<div class="pi-links">';
        prevProducto+='<a style="cursor: pointer" class="add-card" onclick="addToCart('+join+')"><i class="flaticon-bag"></i><span>AL CARRITO</span></a>';
        prevProducto+='<a href="#" class="wishlist-btn"><i class="flaticon-heart"></i></a>';
        prevProducto+='</div>';
        prevProducto+='</div>';
        prevProducto+='<div class="pi-text">';
        prevProducto+='<h6>'+'S/'+price+'</h6>';
        prevProducto+='<a style="font-weight:600;">'+"Local : "+store+'</a>';
        prevProducto+='<p>'+nameProduct+'</p>';
    
        prevProducto+='</div>';
        prevProducto+='</div>';
        prevProducto+='</div>';
        $(prevProducto).appendTo('#myrow');
        
    }); 

    var divs = document.getElementsByClassName("product-item");
    var height = divs.length;
    var ctx = 0;
    for(var i = 0; i < height; i++){
      ctx++;
      if(ctx>20){
        divs[i].style="display:none";
      }
    }
    $(".loader").fadeOut();
  	$("#preloder").delay(400).fadeOut("slow");
}); 


firestore.collection("categories").get().then((querySnapshot) => {

  querySnapshot.forEach((doc) => {
    
      var type = doc.data().type_product
      var chip = '<li><a href="category.html?category='+type+'" target="_blank">'+type+'</a></li>';
      $(chip).appendTo('#chips');
      
  }); 
}); 


function showDetailProduct(product){

  var data = product.split("%&")

  var nameProduct = data[0]
  var price = data[1]
  var provider = data[2]
  var store = data[3]
  var delivery = data[4]
  var id = data[5]
  var category = data[6]
  var image = data[7]
  var description = data[8]
  var sku = data[9]
  var stock = data[10]
  var availability = data[11]
  var open = data[12]
  var close = data[13]

  document.getElementById("nameProduct").innerHTML = nameProduct
  document.getElementById("imageProductModal").src = image
  document.getElementById("description").innerHTML = description
  document.getElementById("store").innerHTML =  "Nombre de local : "+store
  document.getElementById("store").style ="font-weight:600;"
  document.getElementById("sku").innerHTML = "Sku : "+sku
  document.getElementById("stock").innerHTML = "Stock : "+stock
  document.getElementById("price").innerHTML =  "Precio : "+"S/"+price
  document.getElementById("price").style ="font-weight:600;"
  document.getElementById("delivery").innerHTML = "Incluye delivery : "+ delivery

}


function showAllProducts(){
 
  var ctx = 0;
  var divs = document.getElementsByClassName("product-item");
  var height = divs.length;
  click++;

  if(click == 1){
    for(var i = 0; i < height; i++){
      ctx++
      if(ctx <41){
        divs[i].style="display:block";
      }
      
    }
  }
  if(click == 2){
    for(var i = 0; i < height; i++){
      ctx++
      if(ctx < 61){
        divs[i].style="display:block";
      }
      
    }
  }

  if(click == 3){
    for(var i = 0; i < height; i++){
      divs[i].style="display:block";
    }
    document.getElementById("btnShowMore").remove()
  }
  
}

function login(){
 
  var userEmail = document.getElementById("email").value;
  var userPass = document.getElementById("password").value;
  var btnLogin = document.getElementById("btn-login")

  var loaderLogin = document.getElementById("onLoginLoader")
  var btnGoogle = document.getElementById("btnGoogle")
  var divLoader = document.getElementById("divsloader")
 

  if(userEmail != "" && userPass !=""){

    divLoader.style = "display:block;"
    loaderLogin.style = "display:block;margin-bottom: 2px;"
    btnGoogle.style = "display:none;"
    btnLogin.disabled = true
    
    firebase.auth().signInWithEmailAndPassword(userEmail, userPass).then((userCredential) => {
        var user = firebase.auth().currentUser.uid

        firestore.collection("users").doc(user).get().then((querySnapshot) => {
            if(querySnapshot.exists){
              localStorage.setItem('keyId',user)
              localStorage.setItem('myData', JSON.stringify(querySnapshot.data()))
              location.reload();
            } 
       }).catch(function(error) {
        btnGoogle.style = "display:block;"
        loaderLogin.style = "display:none;"
        divLoader.style = "display:none;"
        btnLogin.disabled = false
        alertify.alert('Alerta!',verifyError(error));
    }); 
    }).catch(function(error) {
      btnGoogle.style = "display:block;"
      loaderLogin.style = "display:none;"
      divLoader.style = "display:none;"
      btnLogin.disabled = false
      alertify.alert('Alerta!',verifyError(error));
  }); ; 
  }
  else{
    alertify.alert('Hey!','Complete los campos!');
  }
}

function getCartElements(){

  var arrayIDS = []

  firestore.collection("cart_items").onSnapshot((querySnapshot) => {
    var ctx = 0;
    querySnapshot.forEach((doc) => {
        var userId = doc.data().user_id
        var product = doc.data().product_id
        if(userId == key){
          ctx++;
          arrayIDS.push(doc.data())
        }
    }); 

    localStorage.setItem('cartElements', JSON.stringify(arrayIDS))
    //console.log(arrayProductsInCart)
   
    document.getElementById("ctxCart1").innerHTML = ctx
    document.getElementById("ctxCart2").innerHTML = ctx
    document.getElementById("credentials").style = "display:none;"
    document.getElementById("logged").style = "display:inline;"
    
}); 


}

function logout(){
  localStorage.clear();
  location.href="index.html"
}


function addToCart(obj){

  var arrayProductsInCart = localStorage.getItem("cartElements");
  var js = JSON.parse(arrayProductsInCart)

  var keyData = localStorage.getItem("keyId");
  var dataXS = localStorage.getItem("myData");
  var xf = JSON.parse(dataXS)

  var ctx = 0
  var checkStore = "same"

  if(keyData != null){

    if(xf.profileCompleted != 0){

      var loader = document.getElementById("loadAddToCart")
      loader.style = "display:block;"
    
      var data = obj.split(",")
      let title = data[0];
      let price = data[1];
      let provider = data[2];
      let store = data[3];
      let delivery = data[4];
      let id = data[5];
      let category = data[6];
      let image = data[7]
  
  
      if(js != null){
        for (let i = 0; i < js.length; i++){
          if(js[i].product_id == id){
             ctx ++
          }
          if(js[i].name_store != store){
             checkStore = "notSame"
          }
      }
  
      if(checkStore == "same"){
  
        if(ctx > 0){
  
          alertify.error('El producto ya esta en el carrito!');
          loader.style = "display:none;"
    
        }else{
    
          var data = {cart_quantity:"1",category:category,delivery:delivery,id:"",
          image:image,name_store:store,price:price,provider_id:provider,product_id:id,user_id:keyData,status:0,
          stock_quantity:"",title:title}
        
        
          firestore.collection("cart_items").add(data).then(function() {
                    loader.style = "display:none;"
                    alertify.success('Producto añadido al carrito!');
                    js.push(data)
                    localStorage.setItem('cartElements', JSON.stringify(js))
                    
                })
                .catch(function(error) {
                    loader.style = "display:none;"
                    alertify.success('No se pudo añadir al carrito!');
                });
        }
      }else{
          alertify.error('Debe elegir un producto del mismo local!');
          loader.style = "display:none;"
      }
      
     }
    }else{
      alertify.alert('<h4>Hey!</h4>','<h4>Debe actualizar sus datos!</h4>', function(){
        showModalUpdate()
      });
    }
  
  }else{
    alertify.error('Debe iniciar sesión para añadir al carrito!');
  }

}

function verifyError(errorCode){
    if(errorCode == "Error: The password is invalid or the user does not have a password."){
      return "Error: La contraseña no es válida o el usuario no tiene contraseña." 
    }
}