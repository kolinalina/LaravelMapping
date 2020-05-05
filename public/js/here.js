if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(position =>{
        localCoord = position.coords;
        objLocalCoord = {
            lat: localCoord.latitude,
            lang: localCoord.longitude
        }

      let platform = new H.service.Platform({
        'apikey': window.hereApiKey
      });
      

    
      let defaultLayers = platform.createDefaultLayers();

      // Instantiate (and display) a map object:
      let map = new H.Map(
        document.getElementById('mapContainer'),
        defaultLayers.vector.normal.map,
        {
          zoom: 13,
          center: { lng: 13.4, lat: 52.51 },
          pixelRatio: window.devicePixelRatio || 1
        });
        
        window.addEventListener('resize', () => map.getViewPort().resize());

    let ui = H.ui.UI.createDefault(map, defaultLayers);
    let mapEvents = new H.mapevents.MapEvents(map);
    let behavior =  new H.mapevents.Behavior(mapEvents);
    
    function addDragableMarker(map, behavior){
        let inputLat = document.getElementById('lat');
        let inputLng = document.getElementById('lng');

        if(inputLat.value != '' && inputLng.value != ''){
            objLocalCoord={
                lat: inputLat.value,
                lng: inputLng.value
            }
        }

        let marker = new H.map.Marker(objLocalCoord, {
            volatility: true
        })
        marker.draggable = true;
        map.addObject(marker);

        map.addEventListener('dragstart', function(ev){
            let target = ev.target,
                pointer = ev.currentPointer;
            if (target instanceof H.map.Marker){
                let targetPosition = map.goToScreen(target.getGeometry());
                target['offset'] = new H.math.Point(
                    pointer.viewportX - targetPosition.x, pointer.viewportY - targetPosition.y
                );
                behavior.disable();
            }

        }, false);


        map.addEventListener('drag', function(ev){
            let target = ev.target,
                pointer = ev.currentPointer;
            if (target instanceof H.map.Marker){
                // let targetPosition = map.goToScreen(target.getGeometry());
               target.setGeometry(
                   map.screenToGeo(
                       pointer.viewportX - target['offset'].x, pointer.viewportY - target['offset'].y

                   ));
                
            }

        }, false);
     }

    })
}else{
        console.error("Geolocation is not support in your browser!");
}
