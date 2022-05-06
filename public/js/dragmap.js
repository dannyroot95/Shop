 function initialize() {
        // Configuración del mapa
        var mapProp = {
          center: new google.maps.LatLng(-12.59568977541532, -69.19066319425708),
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        // Agregando el mapa al tag de id googleMap
        var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
        
        // Creando un marker en el mapa
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(-12.59568977541532, -69.19066319425708),
          map: map,
          title: 'Mi ubicación',
          draggable: true //que el marcador se pueda arrastrar
        });
       
        // Registrando el evento drag, en este caso imprime 
        // en consola la latitud y longitud
        google.maps.event.addListener(marker,'drag',function(event) {
          
          document.getElementById("latitude").innerHTML = event.latLng.lat()
          document.getElementById("longitude").innerHTML = event.latLng.lng()
       
        });


       
      }
        
      // Inicializando el mapa cuando se carga la página
      google.maps.event.addDomListener(window, 'load', initialize);
