document.addEventListener("DOMContentLoaded", function () {
    let welcomePrompt = document.getElementById("welcomePrompt");
    let sceneContainer = document.getElementById("sceneContainer");
    let textContainer = document.getElementById("textContainer");

    document.getElementById("firstModelButton").onclick = function () {
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

                <a-entity camera>
                </a-entity>
            </a-scene>
        `;

        let scene = document.querySelector("a-scene");
        scene.addEventListener("loaded", function () {
            console.log("AR loaded");
            setupAR();
        });
    }

    function setupAR() {

        const pieces = ["first-marker", "second-marker"];

        for (let i = 0; i < pieces.length - 1; i++) {
            setupMarkers(pieces[i], pieces[i + 1]);
            console.log(`Setting up markers: ${pieces[i]} and ${pieces[i + 1]}`);
        }
    }

    function setupMarkers(firstPieceId, secondPieceId, solvedPiecesId){
        let firstPiece = document.getElementById(firstPieceId);
        let secondPiece = document.getElementById(secondPieceId);
        let firstPieceFound = false;
        let stepSolved = false;

        textContainer.style.display = "block";
        textContainer.innerText = "Please scan the QR code of the first piece";

            firstPiece.addEventListener("markerFound", function () {
                firstPieceFound = true;
                textContainer.innerText = "Please scan the QR code of the second piece";
            });

            firstPiece.addEventListener("markerLost", function () {
                firstPieceFound = false;
                textContainer.innerText = "Please scan the QR code of the first piece";
            });

            secondPiece.addEventListener("markerFound", function () {
                if (firstPieceFound) {
                    textContainer.innerText = "Both pieces detected, please follow the instructions";
                }
                if (!firstPieceFound) {
                    textContainer.innerText = "You have scanned the wrong piece";
                }
            });
    }
});
