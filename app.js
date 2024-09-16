document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('fischerCanvas');
    const ctx = canvas.getContext('2d');
    
    // Default substituents for Glucose
    let stereocenters = [
        { label1: 'H', label2: 'OH' },   // C1
        { label1: 'OH', label2: 'H' },   // C2
        { label1: 'OH', label2: 'H' },   // C3
        { label1: 'OH', label2: 'H' },   // C4
    ];

    function updateInputFields() {
        const container = document.getElementById('substituents-inputs');
        container.innerHTML = ''; // Clear previous inputs

        const numStereocenters = parseInt(document.getElementById('stereocenters').value);

        for (let i = 0; i < numStereocenters; i++) {
            const sub = stereocenters[i] || { label1: 'H', label2: 'OH' }; // Default values for new stereocenters
            stereocenters[i] = sub; // Ensure it exists in stereocenters array

            const div = document.createElement('div');
            div.className = 'input-container';

            div.innerHTML = `
                <label>C${i + 1} Left:</label>
                <input type="text" data-index="${i}" data-side="label1" value="${sub.label1}">
                <label>C${i + 1} Right:</label>
                <input type="text" data-index="${i}" data-side="label2" value="${sub.label2}">
            `;

            container.appendChild(div);
        }

        // Add event listeners for new input fields
        const inputs = container.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                const side = e.target.getAttribute('data-side');
                stereocenters[index][side] = e.target.value;
                drawFischerProjection(); // Redraw after updating substituents
            });
        });
    }

    function drawFischerProjection() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const numStereocenters = parseInt(document.getElementById('stereocenters').value);
        const centerX = canvas.width / 2;
        const centerY = 100;
        const bondLength = 80;
        const bondOffset = 60;

        // Draw CHO at the top (above C1)
        
        ctx.fillText('CHO', centerX, centerY - bondLength);
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - bondLength);
        ctx.lineTo(centerX, centerY); // Bond connecting CHO to C1
        ctx.stroke();

        // Draw stereocenters and substituents
        for (let i = 0; i < numStereocenters; i++) {
            const y = centerY + i * bondLength;
            
            // Draw the vertical carbon backbone
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX, y);
            ctx.stroke();

            // Draw horizontal bonds and substituents
            const sub = stereocenters[i % stereocenters.length];

            // Left substituent
            ctx.fillText(sub.label1, centerX - bondOffset, y);
            ctx.beginPath();
            ctx.moveTo(centerX, y);
            ctx.lineTo(centerX - bondOffset, y);
            ctx.stroke();

            // Right substituent
            ctx.fillText(sub.label2, centerX + bondOffset, y);
            ctx.beginPath();
            ctx.moveTo(centerX, y);
            ctx.lineTo(centerX + bondOffset, y);
            ctx.stroke();
        }

        // Draw CH2OH at the bottom (below the last stereocenter)
        const lastY = centerY + (numStereocenters - 1) * bondLength;
        ctx.fillText('CH₂OH', centerX, lastY + bondLength);
        ctx.beginPath();
        ctx.moveTo(centerX, lastY);
        ctx.lineTo(centerX, lastY + bondLength); // Bond connecting last stereocenter to CH2OH
        ctx.stroke();
    }
    
    
        function drawZigzag(substituents) {
        const canvas = document.getElementById('zigzagCanvas');
        const ctx = canvas.getContext('2d');
        
        const startX = 50;
        const startY = 100;
        const bondLength = 60;
        const numCarbons = substituents.length; // Number of carbons (matches stereocenters)

        // Clear canvas before drawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Set drawing style
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.font = "16px Arial";
        ctx.textAlign = "center";

        let x = startX;
        let y = startY;

        // Loop through carbons to draw zigzag
        for (let i = 0; i < numCarbons; i++) {
            let nextX = x + bondLength;
            let nextY = y + (i % 2 === 0 ? -bondLength : bondLength);

            // Draw bond line
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(nextX, nextY);
            ctx.stroke();

            // Add substituents
            const substituent = substituents[i];

            // Place substituents above/below based on alternating zigzag pattern
            const offset = (i % 2 === 0) ? -20 : 20;
            ctx.fillText(substituent.left, (x + nextX) / 2, y + offset);  // Left substituent
            ctx.fillText(substituent.right, (x + nextX) / 2, y - offset); // Right substituent

            // Move to next bond position
            x = nextX;
            y = nextY;
        }
    }
    
    
    

    // Update Fischer projection and inputs when the number of stereocenters changes
    document.getElementById('stereocenters').addEventListener('input', () => {
        updateInputFields();
        drawFischerProjection();
    });

    // Initial draw and input setup
    updateInputFields();
    drawFischerProjection();
    drawZigzag(stereocenters);
    
    
});

