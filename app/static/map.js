var centerLocation = new google.maps.LatLng(40.183, 44.515)

var options = {
    zoom: 18,
    center: centerLocation
}
var map = new google.maps.Map(document.getElementById("map-canvas"), options);
var geocoder = new google.maps.Geocoder();

var styles = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "elementType": "geometry.fill",
    "stylers": [
      {
        "weight": 2
    }
    ]
  },
  {
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#212121"
      },
      {
        "visibility": "on"
      },
      {
        "weight": 3
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#523735"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#c9b2a6"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#dcd2be"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#ae9e90"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#93817c"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#a5b076"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#447530"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#fdfcf8"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f8c967"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#e9bc62"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e98d58"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#db8555"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#806b63"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8f7d77"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#b9d3c2"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#92998d"
      }
    ]
}
]

map.setOptions({styles: styles});

// Detecting user Location
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        var centerLocation = new google.maps.LatLng(
            position.coords.latitude, position.coords.longitude
        )
        map.panTo(centerLocation)
    })
}

google.maps.event.addListener(map, 'click', function(event) {
  geocoder.geocode({
    'latLng': event.latLng
  }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[0]) {
        getStories(results[0].place_id)
        openBar()
        document.getElementById('sidebar').getElementsByTagName('h1')[0].innerHTML = results[0].formatted_address
      }
    }
  });
});

function openBar() {
    document.getElementById('sidebar').style.width = '400px'
}

function closeBar() {
    document.getElementById('sidebar').style.width = '0'
}

var modal = document.getElementById('inputModal')
var btn = document.getElementById("addButton")

btn.onclick = function() {
    modal.style.display = "block"
}

var closeBtn = document.getElementsByClassName("close")[0];
closeBtn.onclick = function() {
    modal.style.display = "none"
}

function getStories(place_id) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/getStories/" + place_id, false)
    xhttp.send()
    stories = JSON.parse(xhttp.responseText)
    storyCont = document.getElementById('storyContainer')
    while (storyCont.firstChild) {
        if (storyCont.firstChild.nodeName == 'A') {
            break
        }
        storyCont.removeChild(storyCont.firstChild)
    }
    document.getElementById("addStoryButton").onclick = function() {
        addStory(place_id)
    }
    for (var i = 0; i < stories.length; i++) {
        str = document.createElement('div')
        str.innerHTML = stories[i]["story"]
        aut = document.createElement('p')
        aut.innerHTML = stories[i]["author"]
        str.appendChild(aut)
        storyCont.insertBefore(str, storyCont.firstChild)
    }
}

function addStory(place_id) {
    var story =  document.getElementById("story").value
    var author = document.getElementById("author").value
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/addStory", false)
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("place_id=" + place_id + "&story=" + story + "&author=" + author)
    rsp = JSON.parse(xhttp.responseText)
    if (rsp["status"] == "ok") {
        getStories(place_id)
        modal.style.display = "none"
        document.getElementById("inputForm").reset()
    }
}
