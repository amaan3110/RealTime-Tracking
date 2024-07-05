const socket = io();

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        const {longitude, latitude} = position.coords;
        socket.emit('send-location', {longitude, latitude})
    },(error)=>{
        console.log(error);
    },{
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    })
}

const map = L.map("map").setView([0,0], 5)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution: "amaan_31"
}).addTo(map)

const markers = {};

socket.on('received-location', (data)=>{
    const {id, longitude, latitude} = data;
    map.setView([longitude, latitude], 5);
    if(markers[id]){
        markers[id].setLatLng([longitude, latitude]);
    }
    else{
        markers[id] = L.marker([latitude,longitude]).addTo(map);
    }
})

socket.on('user-disconnected',(id) => {
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});