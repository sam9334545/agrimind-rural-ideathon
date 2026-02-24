const translations = {
    en: {
        heroTitle: "Smart Farming With AI",
        heroDesc: "Get intelligent crop recommendations, maximize profit, and minimize risks before planting.",
        welcome: "Welcome Farmer",
        mandi: "Live Mandi Prices:",
        modalT: "Farm Details",
        soilL: "Soil Type:",
        sizeL: "Land Size (Acres):",
        saveB: "Get AI Advice"
    },
    hi: {
        heroTitle: "AI के साथ स्मार्ट खेती",
        heroDesc: "बुवाई से पहले फसल के सुझाव, लाभ विश्लेषण और जोखिम की जानकारी प्राप्त करें।",
        welcome: "किसान भाइयों का स्वागत है",
        mandi: "ताजा मंडी भाव:",
        modalT: "खेत की जानकारी",
        soilL: "मिट्टी का प्रकार:",
        sizeL: "जमीन (एकड़ में):",
        saveB: "AI सलाह प्राप्त करें"
    }
};

function switchLanguage(lang) {
    const t = translations[lang];
    document.getElementById('hero-title').innerHTML = t.heroTitle;
    document.getElementById('hero-desc').innerText = t.heroDesc;
    document.getElementById('welcome-text').innerText = t.welcome;
    document.getElementById('mandi-title').innerText = t.mandi;
    document.getElementById('modal-title').innerText = t.modalT;
    document.getElementById('label-soil').innerText = t.soilL;
    document.getElementById('label-size').innerText = t.sizeL;
    document.getElementById('saveFarmBtn').innerText = t.saveB;
}