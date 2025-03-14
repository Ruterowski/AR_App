document.addEventListener("DOMContentLoaded", function() {
    let firstMarker = document.getElementById("first-marker");
    let secondMarker = document.getElementById("second-marker");
    let arrow = document.getElementById("arrow");

    firstMarker.addEventListener("markerFound", updateArrow);
    secondMarker.addEventListener("markerFound", updateArrow);

    firstMarker.addEventListener("markerLost", removeArrow);
    secondMarker.addEventListener("markerLost", removeArrow);

    function updateArrow() {
        const marker1Pos = firstMarker.object3D.position;
        const marker2Pos = secondMarker.object3D.position;

        // Calculate the direction from marker1 to marker2
        const dx = marker1Pos.x - marker2Pos.x;
        const dz = marker1Pos.z - marker2Pos.z;

        // Set the arrow's position to the midpoint between the two markers
        arrow.setAttribute('position', {
            x: (marker1Pos.x + marker2Pos.x) / 2,
            y: (marker1Pos.y + marker2Pos.y) / 2,
            z: (marker1Pos.z + marker2Pos.z) / 2
        });

        // Rotate the arrow to point in the correct direction
        arrow.setAttribute('rotation', {
            x: 0,
            y: Math.atan2(dz, dx) * (180 / Math.PI),  // Rotate based on angle between markers
            z: 0
        });

        // Scale the arrow to match the distance between the two markers
        const distance = Math.sqrt(dx * dx + dz * dz);
        arrow.setAttribute('scale', { x: distance, y: 1, z: 1 });
    }

    function removeArrow() {
        console.log("marker lost");
        arrow.setAttribute('position', {
            x: 0,
            y: 0,
            z: 0
        })

        arrow.setAttribute('rotation', {
            x: 0,
            y: 0,
            z: 0
        })

        arrow.setAttribute('scale', {
            x: 0,
            y: 0,
            z: 0
        })
    }
});