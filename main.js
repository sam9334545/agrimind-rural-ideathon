// ==========================================
// 1. APP INITIALIZATION & MANDI PRICES
// ==========================================

// This runs as soon as the farmer opens the app
window.onload = () => {
    loadMandiPrices();
};

/**
 * Fetches real-time prices from your Supabase 'mandi_prices' table
 */
async function loadMandiPrices() {
    const ul = document.getElementById('mandi-ul');
    
    try {
        const { data, error } = await _supabase
            .from('mandi_prices')
            .select('*');

        if (error) throw error;

        if (data && data.length > 0) {
            ul.innerHTML = data.map(item => 
                `<li>🌾 ${item.crop_name}: <b>₹${item.price_per_quintal}</b> (${item.market_name})</li>`
            ).join('');
        } else {
            ul.innerHTML = "<li>No price data found / डेटा उपलब्ध नहीं है</li>";
        }
    } catch (err) {
        console.error("Mandi Fetch Error:", err);
        ul.innerHTML = "<li>Offline: Check connection / डेटा लोड नहीं हो सका</li>";
    }
}

// ==========================================
// 2. MODAL & USER INPUT HANDLING
// ==========================================

const startBtn = document.getElementById('startBtn');
const farmModal = document.getElementById('farmModal');
const saveFarmBtn = document.getElementById('saveFarmBtn');

// Open the Farm Details window
startBtn.addEventListener('click', () => {
    farmModal.style.display = 'flex';
});

// Process the form data
saveFarmBtn.addEventListener('click', () => {
    const soil = document.getElementById('soilType').value;
    const size = document.getElementById('farmSize').value;

    if (!size || size <= 0) {
        alert("Please enter a valid land size / कृपया जमीन का सही आकार डालें");
        return;
    }

    // Close modal and start AI calculation
    farmModal.style.display = 'none';
    processAIRequest(soil, size);
});

// ==========================================
// 3. THE AI BRAIN (Hugging Face / Edge Function)
// ==========================================

/**
 * Calls the Supabase Edge Function to get advice from a free AI model
 */
async function processAIRequest(soil, size) {
    const resultBox = document.getElementById('ai-result-box');
    const recText = document.getElementById('recommendation-text');
    const lang = document.documentElement.lang || 'en';

    // 1. UI Feedback: Show the box and a loading spinner
    resultBox.style.display = 'block';
    recText.innerHTML = lang === 'hi' 
        ? '🔄 AI सलाह तैयार कर रहा है... इसमें थोड़ा समय लग सकता है' 
        : '🔄 AI is preparing advice... this may take a moment';

    try {
        // 2. CALL THE SUPABASE EDGE FUNCTION
        // Make sure your function name in Supabase is 'get-crop-advice'
        const { data, error } = await _supabase.functions.invoke('get-crop-advice', {
            body: { soil: soil, size: size, lang: lang }
        });

        if (error) throw error;

        // 3. Handle the AI Response
        // We expect format: Crop Name | Profit | Risk
        const parts = data.advice.split('|');
        
        if (parts.length >= 3) {
            document.getElementById('recommendation-text').innerText = parts[0].trim();
            document.getElementById('profit-est').innerText = parts[1].trim();
            document.getElementById('risk-level').innerText = parts[2].trim();
        } else {
            // Fallback: If AI returns a long paragraph instead of split format
            document.getElementById('recommendation-text').innerText = data.advice;
            document.getElementById('profit-est').innerText = "Calculated by AI";
            document.getElementById('risk-level').innerText = "Varies";
        }

    } catch (err) {
        console.error("AI Error:", err);
        
        // 4. STUDENT PROJECT FALLBACK
        // If the free API is down or busy, provide a local logical recommendation
        let fallbackCrop = "Summer Moong (मूंग दाल)";
        if (soil === 'sandy') fallbackCrop = "Watermelon (तरबूज)";
        if (soil === 'black') fallbackCrop = "Cotton/Sunflower";

        recText.innerText = (lang === 'hi' ? "सुझाई गई फसल: " : "Suggested: ") + fallbackCrop;
        document.getElementById('profit-est').innerText = "₹25,000 - ₹35,000";
        document.getElementById('risk-level').innerText = "Low / कम";
        
        console.log("Using local fallback logic because API call failed.");
    }
}