document.addEventListener("DOMContentLoaded", () => {
    // Custom Cursor tracking
    const cursor = document.getElementById("custom-cursor");
    const trail = document.getElementById("cursor-trail");
    
    document.addEventListener("mousemove", (e) => {
        // Move core dot instantly
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
        
        // Trail with GSAP for smoothness
        gsap.to(trail, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.15,
            ease: "power2.out"
        });
    });

    // Cursor hover effects on interactive elements
    const interactables = document.querySelectorAll("button, .upload-zone, .close-btn");
    interactables.forEach(el => {
        el.addEventListener("mouseenter", () => trail.classList.add("hovering"));
        el.addEventListener("mouseleave", () => trail.classList.remove("hovering"));
    });

    // 3D Tilt effect on glass cards
    const cards = document.querySelectorAll(".glass-card");
    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            
            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                transformPerspective: 1000,
                duration: 0.5,
                ease: "power1.out"
            });
        });
        
        card.addEventListener("mouseleave", () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: "power1.out"
            });
        });
    });
    
    // Magnetic Hover Effect for Buttons
    const buttons = document.querySelectorAll("button:not(.disabled)");
    updateMagneticButtons(); // Call once
});

function updateMagneticButtons() {
    const buttons = document.querySelectorAll("button:not(.disabled)");
    buttons.forEach(btn => {
        // remove old listeners if needed or just add
        btn.onmousemove = (e) => {
            const rect = btn.getBoundingClientRect();
            const h = rect.width / 2;
            
            const x = e.clientX - rect.left - h;
            const y = e.clientY - rect.top - (rect.height / 2);

            gsap.to(btn, {
                x: x * 0.2,
                y: y * 0.2,
                duration: 0.3,
                ease: "power2.out"
            });
        };

        btn.onmouseleave = () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.3, ease: "power2.out" });
        };
    });
}
