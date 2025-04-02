document.addEventListener("DOMContentLoaded", function () {
    let welcomePrompt = document.getElementById("welcomePrompt");
    let sceneContainer = document.getElementById("sceneContainer");
    let textContainer = document.getElementById("textContainer");
    let modelContainer = document.getElementById("modelContainer");
    let manualContainer = document.getElementById("manualContainer");
    let nextButton = document.getElementById("manualNextButton");
    let previousButton = document.getElementById("manualPreviousButton");
    let modelLocked = false; // Prevents updates after picking a model

    document.getElementById("continueButton").onclick = function () {
        enableAr();
    };

    function enableAr() {
        console.log("Screen clicked!");
        welcomePrompt.style.display = "none";

        sceneContainer.innerHTML = `
            <a-scene
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

        textContainer.style.display = "block";
        let selectedModel = 0;

        firstModel.addEventListener("markerFound", function () {
            if (modelLocked) return;

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
            console.log("Model locked:", selectedModel);
            pickModelButton.style.display = "none";
            modelContainer.style.display = "none";
            textContainer.style.display = "none";
            chooseManualForModel(selectedModel);
        });
    }
});
