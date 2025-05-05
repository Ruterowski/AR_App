document.addEventListener("DOMContentLoaded", function () {
    let welcomePrompt = document.getElementById("welcomePrompt");
    let sceneContainer = document.getElementById("sceneContainer");
    let modelContainer = document.getElementById("modelContainer");
    let manualContainer = document.getElementById("manualContainer");
    let nextButton = document.getElementById("manualNextButton");
    let previousButton = document.getElementById("manualPreviousButton");
    let modelLocked = false; // Prevents updates after picking a model

    ///ENABLE THE WELCOME PROMPT AGAIN
    //document.getElementById("continueButton").onclick = function () {
        enableAr();
    //};

    function enableAr() {
        console.log("Screen clicked!");
        welcomePrompt.style.display = "none";

        sceneContainer.innerHTML = `
            <a-scene
                frame-capture
                vr-mode-ui="enabled: false;"
                loading-screen="enabled: false;"
                arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: false;"
                embedded
            >
                <a-marker id="firstModelQR" type="pattern" preset="custom" url="assets/Models3D/firstMarker.patt" emitevents="true"></a-marker>
                <a-marker id="second-marker" type="pattern" preset="custom" url="assets/marker.patt" emitevents="true"></a-marker>

                <a-entity camera></a-entity>
            </a-scene>
        `;

        console.log("AR loaded");

        selectModel();
    }

    function chooseManualForModel(model) {
        switch (model) {
            case 1:
                showManualForModel('Model1')
        }
    }

    function showManualForModel(model) {
        manualContainer.style.display = "block";
        let img = document.getElementById("manualImg");
        let page = 1;
        img.src = "assets/Manuals/" + model + "/1.png";

        nextButton.onclick = function () {
            page++;
            updateManualImage(model, page);
        }

        previousButton.onclick = function () {
            if (page > 1) {
                page--;
                updateManualImage(model, page)
            }
        }

        //TODO: Hide the 'next button' when there are no more pages in the manual
    }

    function updateManualImage(model, page){
        if (page > 1){
            previousButton.style.visibility = "visible";
        }
        else{
            previousButton.style.visibility = "hidden";
        }

        document.getElementById("manualImg").src = "assets/Manuals/" + model + "/" + page + ".png";
    }

    function selectModel() {
        let firstModel = document.getElementById("firstModelQR");
        let pickModelButton = document.getElementById("pickModelButton");

        let selectedModel = 0;

        firstModel.addEventListener("markerFound", function () {
            if (modelLocked) return;-image

            modelContainer.style.display = "block";
            document.getElementById("modelImage").src = "assets/Models3D/firstModel3D.png";
            document.getElementById("pickModelDiv").style.display = "block";
            selectedModel = 1;
        });

        firstModel.addEventListener("markerLost", function () {
            if (modelLocked) return;

            modelContainer.style.display = "none";
            document.getElementById("pickModelDiv").style.display = "none";
            selectedModel = 0;
        });

        pickModelButton.addEventListener("click", function () {
            modelLocked = true;
            console.log("Model locked:", selectedModel)
            document.getElementById("pickModelDiv").style.display = "none";
            modelContainer.style.display = "none";
            textContainer.style.display = "none";
            chooseManualForModel(selectedModel);
        });
    }

    AFRAME.registerComponent("frame-capture", {
        init: function () {
            const canvas = document.createElement("canvas");
            const interval = 2000; // capture every 2 seconds
            let busy = false;

            const sendFrame = () => {
                const video = document.querySelector("video");

                // Make sure video is ready
                if (!video || video.readyState !== 4 || busy) return;
                busy = true;

                // Set canvas size to match the video frame
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext("2d");

                // Draw current video frame to canvas
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Convert canvas to blob (JPEG) and send to backend
                canvas.toBlob(blob => {
                    if (!blob) {
                        busy = false;
                        return;
                    }

                    const formData = new FormData();
                    formData.append("file", blob, "frame.jpg");

                    fetch("http://127.0.0.1:8000/recognition", {
                        method: "POST",
                        body: formData
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log(data)
                        })
                        .catch(err => console.error("Detection error:", err))
                        .finally(() => {
                            busy = false;
                        });
                }, "image/jpeg"); // ✅ set correct MIME type
            };

            // Wait a moment before starting
            setTimeout(() => {
                setInterval(sendFrame, interval);
            }, 1000);
        }
    });
});
