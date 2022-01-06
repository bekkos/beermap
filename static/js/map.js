let editing = -1;

let map = L.map('map').setView([59.91273, 10.74609], 13);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiY2l2YmVlcm1hcCIsImEiOiJja3kyNmJsNmcwZHFhMnVsajRkYjJzMG1zIn0.Sna_CWX0aSDcuuvbv1vjsQ'
}).addTo(map);



$.post("/query", (data) => {
    let d = JSON.parse(data);
    console.log(d);
    for(let i = 0; i < d.length; i++) {
        let marker = L.marker([d[i][3], d[i][4]]).addTo(map);
        marker.bindPopup(`<b>${d[i][1]}</b><br>${d[i][2]}<br><a href="/bar?id=${d[i][0]}">Les mer</a>`);
    }
}).fail(() => {

});


const edit = () => {
    if(editing == -1) {
        notification("Please select the bar location from the map", 0);
        
    } else {

        
    }
    editing = -editing;
}


function onMapClick(e) {
    console.log(e.latlng);
    if(editing == 1) {
        createPopup(e.latlng);
    }
}

map.on('click', onMapClick);


const createPopup = (latlng) => {
    let name = prompt("Bar name");
    let description = prompt("Description");
    data = {
        'name': name,
        'description': description,
        'lat': latlng['lat'],
        'lng': latlng['lng']
    }
    $.post("/add", data, (r) => {
        let d = JSON.parse(r);
        console.log(d);
        var marker = L.marker([latlng['lat'], latlng['lng']]).addTo(map);
        marker.bindPopup(`<b>${name}</b><br>${description}<br><a href="/bar?id=${d[0]}">Les mer</a>`);
    }).fail(() => {
        notification("Something went wrong.", 1);
    });
    
    editing = -1;
}

const notification = (s, type) => {
    let b = document.getElementById("nb");
    if(type == 0) {
        b.innerHTML += `
                <div class="notification n-success">
                    <p class="text-primary">${s}</p>
                </div>
            `;
    } else {
        b.innerHTML += `
                <div class="notification n-failure">
                    <p class="text-primary">${s}</p>
                </div>
            `;

    }
}