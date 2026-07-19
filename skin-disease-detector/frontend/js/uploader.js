let selectedFile = null;

document.addEventListener("DOMContentLoaded", () => {
    const dropZone = document.getElementById("drop-zone");
    const fileInput = document.getElementById("file-input");
    const uploadContent = document.getElementById("upload-content");
    const previewContainer = document.getElementById("preview-container");
    const imagePreview = document.getElementById("image-preview");
    const fileName = document.getElementById("file-name");
    const fileSize = document.getElementById("file-size");
    const analyzeBtn = document.getElementById("analyze-btn");

    // Click to Open File Dialog
    dropZone.addEventListener("click", () => {
        fileInput.click();
    });

    // Handle File Selection
    fileInput.addEventListener("change", (e) => {
        if (e.target.files.length) {
            handleFile(e.target.files[0]);
        }
    });

    // Drag and Drop Events
    dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.classList.add("drag-active");
    });

    dropZone.addEventListener("dragleave", () => {
        dropZone.classList.remove("drag-active");
    });

    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.classList.remove("drag-active");
        
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    function handleFile(file) {
        // Validate type
        if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
            alert("Only JPG and PNG files are allowed.");
            return;
        }

        selectedFile = file;
        
        // Show file details
        fileName.textContent = file.name;
        fileSize.textContent = (file.size / (1024 * 1024)).toFixed(2) + " MB";

        // Generate Preview
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            uploadContent.classList.add("hidden");
            previewContainer.classList.remove("hidden");
            
            // Enable Analyze Button
            analyzeBtn.classList.remove("disabled");
            analyzeBtn.disabled = false;
            if(window.updateMagneticButtons) window.updateMagneticButtons();
        };
        reader.readAsDataURL(file);
    }
    
    // Close / scan another
    document.getElementById("close-results").addEventListener("click", () => {
        hideResults();
        resetUploader();
    });
    document.getElementById("scan-another-btn").addEventListener("click", () => {
        hideResults();
        resetUploader();
    });
});

function resetUploader() {
    selectedFile = null;
    document.getElementById("file-input").value = "";
    document.getElementById("upload-content").classList.remove("hidden");
    document.getElementById("preview-container").classList.add("hidden");
    
    const analyzeBtn = document.getElementById("analyze-btn");
    analyzeBtn.classList.add("disabled");
    analyzeBtn.disabled = true;
}
