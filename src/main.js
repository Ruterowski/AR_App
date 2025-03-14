document.addEventListener("DOMContentLoaded", function() {
    let marker = document.getElementById("animated-marker");
    let line = document.getElementById("line");

    marker.addEventListener("markerFound", function() {
        const position = marker.object3D.position;
        console.log(position);
        line.setAttribute("line", {
            start: position.x + " " + position.y + " " + position.z
        });
    });

    marker.addEventListener("markerLost", function() {
        console.log("Marker Lost");
        line.setAttribute("line", {start: "0 0 0", end: "0 0 0"});
    })
});