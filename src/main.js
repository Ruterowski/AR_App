document.addEventListener("DOMContentLoaded", function() {
    let marker = document.getElementById("animated-marker");
    let textElement = document.getElementById("marker-text");

    marker.addEventListener("markerFound", function() {
        let position = marker.object3D.position;
        textElement.setAttribute("value", `Position: x=${position.x.toFixed(2)} y=${position.y.toFixed(2)} z=${position.z.toFixed(2)}`);
    });

    marker.addEventListener("markerLost", function() {
        textElement.setAttribute("value", "Marker Lost");
    });
});