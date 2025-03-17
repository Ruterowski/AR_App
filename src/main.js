document.addEventListener("DOMContentLoaded", function () {
    let welcomePrompt = document.getElementById("welcomePrompt");
    let sceneContainer = document.getElementById("sceneContainer");

    welcomePrompt.onclick = function () {
        enableAr();
    };

    function enableAr() {
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

                    <a-text id="informationText"
                        position="0 0 -1" 
                        value="Scan the markers"
                        color="white"
                        align="center"
                        width="4">
                    </a-text>

                <a-entity camera></a-entity>
            </a-scene>
        `;

        let scene = document.querySelector("a-scene");
        scene.addEventListener("loaded", function () {
            setupAR();
        });
    }

    function setupAR() {
        let arrow = document.getElementById("arrow");
        const pieces = ["first-marker", "second-marker"];

        for (let i = 0; i < pieces.length - 1; i++) {
            setupMarkers(pieces[i], pieces[i + 1]);
            console.log(`Setting up markers: ${pieces[i]} and ${pieces[i + 1]}`);
        }
    }

    function setupMarkers(firstMarkerId, secondMarkerId) {
        let secondMarkerDetected = false;

        let firstMarker = document.getElementById(firstMarkerId);
        let secondMarker = document.getElementById(secondMarkerId);
        let text = document.getElementById("informationText");

        if (!firstMarker || !secondMarker) {
            console.error(`Markers not found: ${firstMarkerId}, ${secondMarkerId}`);
            return;
        }

        if (!secondMarkerDetected) {
            console.log("Please scan the QR code of the first piece");
            text.setAttribute("value", "Please scan the QR code of the first piece");
        }

        firstMarker.addEventListener("markerFound", function () {
            let text = document.getElementById("informationText");
        });

        secondMarker.addEventListener("markerFound", function () {
            secondMarkerDetected = true;
            console.log("test");
            updateArrow(firstMarker, secondMarker);
        });

        firstMarker.addEventListener("markerLost", function(){
            removeArrow();
        });
        secondMarker.addEventListener("markerLost", function (){
            if(secondMarkerDetected) {
                console.log("You have connected the pieces incorrectly");
                text.setAttribute("value", "You have connected the pieces incorrectly");
            }
            secondMarkerDetected = false;
        });
    }

    function getMarkerPosition(marker) {
        return marker.object3D.position;
    }

    function updateArrow(firstMarker, secondMarker) {
        let arrow = document.getElementById("arrow");

        const marker1Pos = getMarkerPosition(firstMarker);
        const marker2Pos = getMarkerPosition(secondMarker);

        const dx = marker2Pos.x - marker1Pos.x;
        const dz = marker2Pos.z - marker1Pos.z;

        arrow.setAttribute("position", {
            x: (marker1Pos.x + marker2Pos.x) / 2,
            y: (marker1Pos.y + marker2Pos.y) / 2,
            z: (marker1Pos.z + marker2Pos.z) / 2,
        });

        arrow.setAttribute("rotation", {
            x: 0,
            y: Math.atan2(dz, dx) * (180 / Math.PI),
            z: 0,
        });

        const distance = Math.sqrt(dx * dx + dz * dz);
        arrow.setAttribute("scale", { x: distance, y: 1, z: 1 });
        arrow.setAttribute("visible", true);
    }

    function removeArrow() {
        let arrow = document.getElementById("arrow");
        if (arrow) {
            arrow.setAttribute("visible", false);
        }
    }
});
