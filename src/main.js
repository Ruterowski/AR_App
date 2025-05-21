document.addEventListener("DOMContentLoaded", function () {
    let welcomePrompt = document.getElementById("welcomePrompt");
    let sceneContainer = document.getElementById("sceneContainer");
    let modelContainer = document.getElementById("animationContainer");
    let manualContainer = document.getElementById("manualContainer");
    let piecesImg = document.getElementById("piecesNeededImage");
    let animationSrc = document.getElementById("animationImage");
    let manualAnimation = document.getElementById("manualAnimation")
    const overlayCanvas = document.getElementById("overlayCanvas");

    let animationPage = 1

    const overlayCtx = overlayCanvas.getContext("2d");

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
                <a-entity camera></a-entity>
            </a-scene>
        `;

        console.log("AR loaded");
    }


    AFRAME.registerComponent("frame-capture", {
        init: function () {
            const canvas = document.createElement("canvas");
            const interval = 500;
            let busy = false;

            const sendFrame = () => {
                const video = document.querySelector("video");

                if (!video || video.readyState !== 4 || busy) return;
                busy = true;

                canvas.width = 1920;
                canvas.height = 1080;
                const ctx = canvas.getContext("2d");

                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                canvas.toBlob(blob => {
                    if (!blob) {
                        busy = false;
                        return;
                    }

                    const formData = new FormData();
                    formData.append("file", blob, "frame.jpg");

                    fetch("http://127.0.0.1:8000/recognition/m2", {
                        method: "POST",
                        body: formData
                    })
                        .then(response => response.json())
                        .then(data => {
                            const detections = data?.detections || [];
                            showManualAndAnimation(detections);

                        })
                        .catch(err => console.error("Detection error:", err))
                        .finally(() => {
                            busy = false;
                        });
                }, "image/jpeg");
            };

            setTimeout(() => {
                setInterval(sendFrame, interval);
            }, 1000);
        }
    });

    function showManualAndAnimation(detections){
        // drawBoundingBoxes(detections);
        //step_n_done
        manualContainer.style.display = "block";
        piecesImg.src = "assets/Pieces/FirstModel/step" + animationPage + ".png";
        modelContainer.style.display = "block";
        animationSrc.src = "assets/Manuals/Model2/step" + animationPage + ".gif";

        detections.forEach(det => {
            console.log(det)
            if(det?.label === "step_" + animationPage + "_done" || det?.label === "step" + animationPage + "_done"){
                animationPage++;
            }
        })
    }

    // function drawBoundingBoxes(detections) {
    //     overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    //     for (let i = 0; i < detections.length; i++) {
    //         let det = detections[i];
    //         if (det?.label === 'block_pink_4x1') {
    //             console.log(det?.box);
    //             const [x1, y1, x2, y2] = det?.box;
    //             overlayCtx.strokeStyle = "red";
    //             overlayCtx.lineWidth = 2;
    //             overlayCtx.strokeRect(x2, y2, x1 - x2, y1 - y2);
    //             overlayCtx.fillStyle = "red";
    //         }
    //     }
    // }
});
