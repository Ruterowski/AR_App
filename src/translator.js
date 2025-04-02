const translations = {
    en: {welcomeText: "Welcome to the assembly guide",
         chooseLanguage: "Please select a language",
         continueButton: "Continue",
         scanQRCode: "Please scan the QR code of the model",
         pickModel : "Select model",
         nextButton: "Next page",
         previousPage: "Previous page"},
    es: {welcomeText: "Bienvenido a la guía de montaje",
         chooseLanguage: "Por favor seleccione un idioma",
         continueButton: "Continua",
         scanQRCode: "Por favor escanee el código QR del modelo",
         pickModel : "Seleccionar modelo",
         nextButton: "Página siguiente",
         previousPage: "Página anterior"},
    pl: {welcomeText: "Witamy w instrukcji składania",
         chooseLanguage: "Proszę wybrać język,",
         continueButton: "Kontynuuj",
         scanQRCode: "Proszę zeskanować kod QR modelu",
         pickModel : "Wybierz model",
         nextButton: "Następna strona",
         previousPage: "Poprzednia strona"},
}

function translateText(language){
    document.getElementById("welcomeText").innerText = translations[language].welcomeText;
    document.getElementById("chooseLanguage").innerText = translations[language].chooseLanguage;
    document.getElementById("continueButton").innerText = translations[language].continueButton;
    document.getElementById("textContainer").innerText = translations[language].scanQRCode;
    document.getElementById("pickModelButton").innerText = translations[language].pickModel;
    document.getElementById("manualNextButton").innerText = translations[language].nextButton;
    document.getElementById("manualPreviousButton").innerText = translations[language].previousPage;
}