     // ================================================================================================================
      var userLocation;
      const successCallback = async (position) => {
        userLocation = position;
        console.log(userLocation.coords.latitude, userLocation.coords.longitude);
      };
      const errorCallback = async (error) => {
        console.log(error);
      };

      async function getLocation() {
        if (navigator.geolocation) {
          await navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
        } else {
          console.log("Geolocation is not supported by this browser.");
        }
      }
      getLocation();
      // ================================================================================================================
      // get user location
      function getMyLocation() {
        map.setView([userLocation.coords.latitude, userLocation.coords.longitude], 6);
        L.marker([userLocation.coords.latitude, userLocation.coords.longitude]).addTo(map).bindPopup("You are here").openPopup();
        console.log(userLocation.coords.latitude, userLocation.coords.longitude);
      }
      // map default location and zoom
      let map = L.map("map", {drawControl: true}).setView([31.7917, -8.222168], 6);
      L.marker([31.7917, -8.222168]).addTo(map).openPopup();

      // add layers to the map
      var layerControl = L.control.layers().addTo(map);

      var streets = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      var satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
      });
      var googleStreets = L.tileLayer("https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
        attribution: "Google",
      });
      var appleStreets = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
        attribution: "Apple",
      });
      var baseMaps = {
        Streets: streets,
        Satellite: satellite,
        GoogleStreets: googleStreets,
      };

      layerControl.addBaseLayer(baseMaps.Streets, "Streets");
      layerControl.addBaseLayer(baseMaps.Satellite, "Satellite");
      layerControl.addBaseLayer(baseMaps.GoogleStreets, "Google Streets");
      layerControl.addBaseLayer(appleStreets, "Apple Streets");
      // ================================================================================================================

      // get the location from the input
      let lat = document.getElementById("lat");
      let lng = document.getElementById("lng");

      function getLat(e) {
        e.preventDefault();
        map.setView([lat.value, lng.value], 6);
        L.marker([lat.value, lng.value]).addTo(map).openPopup();
      }

      // ================================================================================================================

      // draw control
      var drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);
      var drawControl = new L.Control.Draw({
        edit: {
          featureGroup: drawnItems,
        },
        draw: {
          polygon: {
            allowIntersection: false,
            showArea: true,
          },
          polyline: false,
          circle: false,
          circlemarker: false,
          rectangle: false,
          marker: false,
        },
      });
      map.addControl(new L.Control.Fullscreen(), drawControl, {
        position: "topleft",
      });
      map.on(L.Draw.Event.CREATED, function (event) {
        var layer = event.layer;
        drawnItems.addLayer(layer);
      });

      // ================================================================================================================
      // get user location
      map.locate({setView: true, maxZoom: 15});
      function onLocationFound(e) {
        var radius = e.accuracy / 2;

        L.Icon.Default.imagePath = "./images/layers-2x.png";
        L.circle(e.latlng, radius).addTo(map).bindPopup("You're here").openPopup();
      }
      map.on("locationfound", onLocationFound);

      map.on("draw:created", function (e) {
        var type = e.layerType,
          layer = e.layer;
        if (type === "marker") {
          layer.bindPopup(() => {
            console.log(e.layer);
            // e.layer.bindPopup("hna kayn sehd");
          });
        }
        drawnItems.addLayer(layer);
      });

      // ================================================================================================================
      // scale
      L.control.scale().addTo(map);

      // ================================================================================================================
      // geocoder
      //   if (L.Browser.gecko) {
      //     alert("Upgrade your browser, dude!");
      //   }
      var geocoder = L.Control.geocoder({
        defaultMarkGeocode: false,
      })
        .on("markgeocode", function (e) {
          var bbox = e.geocode.bbox;
          var poly = L.polygon([bbox.getSouthEast(), bbox.getNorthEast(), bbox.getNorthWest(), bbox.getSouthWest()]).addTo(map);
          map.fitBounds(poly.getBounds());
        })
        .addTo(map);

      // ================================================================================================================
      // polygon
      var polygon = L.polygon([
        [30.7917, -9.0926],
        [30.7917, -7.0926],
        [33.7917, -8.222168],
      ]).addTo(map);
      // polygon.bindPopup("hna kayn sehd");

      // var popup = L.popup();

      // function onMapClick(e) {
      //     popup
      //         .setLatLng(e.latlng)
      //         .setContent("You clicked the map at " + e.latlng.toString())
      //         .openOn(map);
      // }

      // map.on("click", onMapClick);

      // ================================================================================================================
      if (navigator.geolocation) {
        //adding the map to the map div
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);
        // full screen option
      } else {
        console.log("Geolocation is not supported by this browser.");
      }