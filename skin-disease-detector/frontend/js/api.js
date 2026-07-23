document.addEventListener("DOMContentLoaded", () => {
    const analyzeBtn = document.getElementById("analyze-btn");
    const loadingOverlay = document.getElementById("loading-overlay");
    const resultsOverlay = document.getElementById("results-overlay");
    const loadingText = document.getElementById("loading-text");
    
    const textOptions = [
        "Scanning pixels...", 
        "Running neural network...", 
        "Analyzing patterns...", 
        "Generating diagnosis..."
    ];

    analyzeBtn.addEventListener("click", async (e) => {
        e.stopPropagation(); // Prevent upload box click
        if (analyzeBtn.classList.contains("disabled") || !selectedFile) return;

        // Show Loading State
        loadingOverlay.classList.remove("hidden");
        if(window.loaderAnim) window.loaderAnim.play();

        // Cycle text
        let textIdx = 0;
        let textInterval = setInterval(() => {
            textIdx = (textIdx + 1) % textOptions.length;
            loadingText.textContent = textOptions[textIdx];
        }, 1200);

        // Prepare FormData
        const formData = new FormData();
        formData.append("image", selectedFile);

        try {
            // Note: Since backend is running locally on port 5000:
            const response = await fetch("https://skin-disease-api-ejjx.onrender.com/api/predict", {
                method: "POST",
                body: formData
            });
            
            const data = await response.json();
            
            clearInterval(textInterval);
            
            if (response.ok) {
                showResults(data);
            } else {
                alert("Error: " + (data.error || "Prediction failed"));
                hideLoading();
            }
        } catch (error) {
            clearInterval(textInterval);
            alert("Error connecting to the backend. Ensure app.py is running on port 5000.");
            hideLoading();
        }
    });
});

function hideLoading() {
    document.getElementById("loading-overlay").classList.add("hidden");
    if(window.loaderAnim) window.loaderAnim.stop();
}

function showResults(data) {
    hideLoading();
    
    const resultsOverlay = document.getElementById("results-overlay");
    const resultsCard = document.querySelector(".results-card");
    
    // Set Fields
    document.getElementById("res-disease").textContent = data.disease;
    
    const sevBadge = document.getElementById("res-severity");
    sevBadge.textContent = data.severity + " Risk";
    sevBadge.className = "severity-badge " + data.severity.toLowerCase();
    
    document.getElementById("res-desc").textContent = data.description;
    document.getElementById("res-rec").textContent = data.recommendation;

    // Show Overlay
    resultsOverlay.classList.remove("hidden");

    // Spring animation for Card
    gsap.fromTo(resultsCard, 
        { y: "100vh" },
        { y: 0, duration: 0.8, ease: "elastic.out(1, 0.75)" }
    );

    // Animate Gauge and counter
    setTimeout(() => {
        const gaugeFill = document.getElementById("gauge-fill");
        // 125.6 is max dashoffset (0%)
        const dashOffset = 125.6 - (125.6 * (data.confidence / 100));
        gaugeFill.style.strokeDashoffset = dashOffset;
        
        let confSpan = document.getElementById("res-confidence");
        gsap.to(confSpan, {
            innerHTML: data.confidence,
            duration: 1.5,
            ease: "power2.out",
            snap: { innerHTML: 0.1 },
            onUpdate: function() {
                confSpan.innerHTML = Number(this.targets()[0].innerHTML).toFixed(1);
            }
        });
    }, 500); // slight delay after card enters
}

function hideResults() {
    const resultsOverlay = document.getElementById("results-overlay");
    const resultsCard = document.querySelector(".results-card");
    const gaugeFill = document.getElementById("gauge-fill");
    
    gsap.to(resultsCard, {
        y: "100vh",
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
            resultsOverlay.classList.add("hidden");
            // reset gauge
            gaugeFill.style.strokeDashoffset = 125.6;
            document.getElementById("res-confidence").textContent = "0";
        }
    });
}
