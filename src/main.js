document.addEventListener("DOMContentLoaded", function() {

    let welcomePrompt = document.getElementById("welcomePrompt");
    document.addEventListener("click", function () {
        console.log("clicked");
        enableAr();
    });

    let arrow = document.getElementById("arrow");

    const pieces = ["first-marker", "second-marker"];

    for (let i = 0; i < pieces.length - 1; i++) {
        setupMarkers(pieces[i], pieces[i + 1]);
    }

    function setupMarkers(firstMarkerId, secondMarkerId) {

        let secondMarkerDetected = false;

        let firstMarker = document.getElementById(firstMarkerId);
        let secondMarker = document.getElementById(secondMarkerId);

        firstMarker.addEventListener("markerFound", function () {
            let text = document.getElementById("informationText");

            let position = getMarkerPosition(firstMarker);

            text.setAttribute("position", {
                x: position.x,
                y: position.y,
                z: position.z + 2,
            });

            if (!secondMarkerDetected) {
                text.setAttribute("value", "Please scan the QR code of first piece");
                }
            else {
                secondMarkerDetected = true;
                text.setAttribute("value", "You have connected the pieces wrong");
            }

            secondMarker.addEventListener("markerFound", function () {
                secondMarkerDetected = true;
                updateArrow(firstMarker, secondMarker);
            });

        });

        firstMarker.addEventListener("markerLost", removeArrow);
        secondMarker.addEventListener("markerLost", removeArrow);

        function getMarkerPosition(firstMarker) {
            return firstMarker.object3D.position;
        }

        function updateArrow(firstMarker, secondMarker) {
            const marker1Pos = getMarkerPosition(firstMarker);
            const marker2Pos = getMarkerPosition(secondMarker);

            // Calculate the direction from marker1 to marker2
            const dx = marker2Pos.x - marker1Pos.x;
            const dz = marker2Pos.z - marker1Pos.z;

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
            arrow.setAttribute('scale', {x: distance, y: 1, z: 1});
            arrow.setAttribute("visible", true);
        }

        function removeArrow() {
            console.log("marker lost");
            arrow.setAttribute("visible", false);
        }
    }

    function enableAr() {
            let sceneContainer = document.getElementById("sceneContainer");

                console.log("Screen clicked!");
                welcomePrompt.style.display = "none";

                // Inject the AR Scene dynamically
                sceneContainer.innerHTML = `
            <a-scene
                vr-mode-ui="enabled: false;"
                loading-screen="enabled: false;"
                arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: false;"
                embedded
            >
                <a-marker id="first-marker" type="pattern" preset="custom" url="assets/firstMarker.patt" emitevents="true"></a-marker>
                <a-marker id="second-marker" type="pattern" preset="custom" url="assets/marker.patt" emitevents="true"></a-marker>

                <a-entity id="arrow"
                    geometry="primitive: cylinder; height: 0.1; radius: 0.02"
                    material="color: green;"
                    position="0 1 -2"
                    rotation="0 0 0"
                    scale="1 1 1"
                    visible="false">
                </a-entity>

                <a-text id="informationText" value="" position="0 1 0" align="center" color="White" scale="1 1 1"></a-text>
                <a-entity camera></a-entity>
            </a-scene>
        `;
        }
});
