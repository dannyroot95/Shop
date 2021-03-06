var remplaza = /\+/gi;
        var url = window.location.href;
        
        url = unescape(url);
        url = url.replace(remplaza, " ");
        const myArray = url.split("=");
        var word = myArray[1];
        var decodeStringCategory = decode_utf8(word)
       function decode_utf8(s) {
        return decodeURIComponent(escape(s));
       }

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

  var key = localStorage.getItem("keyId");
  var arrayDataUser = localStorage.getItem("myData");
  var xs = JSON.parse(arrayDataUser)

  if(key != null && xs != null && xs.profileCompleted != 0){
  getCartElements()
}


  firestore.collection("products").get().then((querySnapshot) => {

    var strNewWebsiteName = decodeStringCategory.replace("#", "");

   querySnapshot.forEach((doc) => {
  
    document.getElementById("cat").innerHTML = "Categoría : "+strNewWebsiteName

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

    if(category == strNewWebsiteName){

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

    }
   
}); 
$(".loader").fadeOut();
$("#preloder").delay(400).fadeOut("slow");
}); 


firestore.collection("categories").get().then((querySnapshot) => {

  querySnapshot.forEach((doc) => {
    var type = doc.data().type_product
    if(decodeStringCategory != type){
      var chip = '<li><a href="category.html?category='+type+'" target="a_blank">'+type+'</a></li>';
      $(chip).appendTo('#chips');
    } 
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
    
  function login(){
 
    var userEmail = document.getElementById("email").value;
    var userPass = document.getElementById("password").value;
  
    if(userEmail != "" && userPass !=""){
      
      firebase.auth().signInWithEmailAndPassword(userEmail, userPass).then((userCredential) => {
          var user = firebase.auth().currentUser.uid
  
          firestore.collection("users").doc(user).get().then((querySnapshot) => {
              if(querySnapshot.exists){
                localStorage.setItem('keyId',user)
                localStorage.setItem('myData', JSON.stringify(querySnapshot.data()))
                alert("Iniciaste sesión")
                location.reload();
              } 
         });   
      }); 
    }
  }


  function logout(){
    localStorage.clear();
    location.reload();
  }

  function addToCart(obj){

    var keyData = localStorage.getItem("keyId");
    var arrayDataUser = localStorage.getItem("myData");

    var xs = JSON.parse(arrayDataUser)
    var arrayProductsInCart = localStorage.getItem("cartElements");
    var js = JSON.parse(arrayProductsInCart)

    var ctx = 0
    var checkStore = "same"
  
    if(keyData != null){

      if(xs.profileCompleted != 0){

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
            image:image,name_store:store,price:price,provider_id:provider,product_id:id,user_id:key,status:0,
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

  function getCartElements(){

    var arrayIDS = []

    firestore.collection("cart_items").onSnapshot((querySnapshot) => {
      var ctx = 0;
      querySnapshot.forEach((doc) => {
          var userId = doc.data().user_id
          if(userId == key){
            ctx++;
            arrayIDS.push(doc.data())
          }
      }); 

      localStorage.setItem('cartElements', JSON.stringify(arrayIDS))
  
      document.getElementById("ctxCart1").innerHTML = ctx
      document.getElementById("ctxCart2").innerHTML = ctx
      document.getElementById("credentials").style = "display:none;"
      document.getElementById("logged").style = "display:inline;"
  }); 
  }