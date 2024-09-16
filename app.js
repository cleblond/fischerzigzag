document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('fischerCanvas');
    const ctx = canvas.getContext('2d');
    
    // Default substituents for Glucose
    let stereocenters = [
        { left: 'CH3', right: 'OH' },  // C1
        { left: 'CH3CH2', right: 'NH2' }  // C4
    ];

    function updateInputFields(first = false) {
        const container = document.getElementById('substituents-inputs');

        container.innerHTML = ''; // Clear previous inputs

        const numStereocenters = parseInt(document.getElementById('stereocenters').value);

        for (let i = 0; i < numStereocenters; i++) {
            const sub = stereocenters[i] || { left: 'H', right: 'OH' }; // Default values for new stereocenters
            stereocenters[i] = sub; // Ensure it exists in stereocenters array

            const div = document.createElement('div');
            div.className = 'input-container';
            
            function uuidv4() {
                return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
                  (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
                );
              }

            div.innerHTML = `
                <label>C${i + 1} Left:</label>
                <input id="${uuidv4()}" type="text" data-index="${i}" data-side="left" value="${sub.left}">
                <label>C${i + 1} Right:</label>
                <input id="${uuidv4()}" type="text" data-index="${i}" data-side="right" value="${sub.right}">
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
                console.log(e.target.dataset.index);

                

                if (Number.isInteger(parseInt(e.data))) {
                    console.log(e);
                    const position = e.target.selectionStart - 1; // Subtract 1 to get the position of the last character added
        
                    const subscripts = ["\u2080", "\u2081", "\u2082", "\u2083", "\u2084", "\u2085", "\u2086", "\u2087", "\u2088", "\u2089"];
                    let str = document.getElementById(e.target.id).value;
                    let newStr = str.substring(0, position) + subscripts[e.data] + str.substring(position + 1);
                    
                    document.getElementById(e.target.id).value = newStr; 

                    console.log(e.target.dataset.side);
                    stereocenters[e.target.dataset.index][e.target.dataset.side] = newStr;

                    console.log(stereocenters);
                    
                }
                //updateInputFields();
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
        ctx.font = "20px Arial";
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
            console.log(sub);

            // Left substituent
            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
            ctx.fillText(sub.left, centerX - bondOffset, y);
            ctx.beginPath();
            ctx.moveTo(centerX, y);
            ctx.lineTo(centerX - bondOffset, y);
            ctx.stroke();

            // Right substituent
            ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
            ctx.fillText(sub.right, centerX + bondOffset, y);
            ctx.beginPath();
            ctx.moveTo(centerX, y);
            ctx.lineTo(centerX + bondOffset, y);
            ctx.stroke();
        }

        // Draw CH2OH at the bottom (below the last stereocenter)
        const lastY = centerY + (numStereocenters - 1) * bondLength;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('CH₂OH', centerX, lastY + bondLength);
        ctx.beginPath();
        ctx.moveTo(centerX, lastY);
        ctx.lineTo(centerX, lastY + bondLength); // Bond connecting last stereocenter to CH2OH
        ctx.stroke();
    }
    

    /*
    const inputFields = document.querySelectorAll('input[type="text"]');
    inputFields.forEach(input => {
        input.addEventListener('input', (e) => {
        if (Number.isInteger(parseInt(e.data))) {
            const position = e.target.selectionStart - 1; // Subtract 1 to get the position of the last character added

            const subscripts = ["\u2080", "\u2081", "\u2082", "\u2083", "\u2084", "\u2085", "\u2086", "\u2087", "\u2088", "\u2089"];
            let str = document.getElementById(e.target.id).value;
            let newStr = str.substring(0, position) + subscripts[e.data] + str.substring(position + 1);
            
            document.getElementById(e.target.id).value = newStr; 
        
        }
        
        //drawProjection();
        //drawSawhorseProjection(carbon1, carbon2);

        });
    });
    */

    
        function drawZigzag(substituents) {
        const canvas = document.getElementById('zigzagCanvas');
        const ctx = canvas.getContext('2d');
        
        const startX = 50;
        const startY = 200;
        const bondLength = 60;
        const numCarbons = substituents.length; // Number of carbons (matches stereocenters)

        // Clear canvas before drawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Set drawing style
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        
        ctx.font = "20px Arial";
        //ctx.textAlign = "center";


        ctx.textAlign = 'right'; ctx.textBaseline = 'top';
        ctx.fillText(document.getElementById('top').value,startX,startY);
        //ctx.fillText(substituents[i].left, nextX - suboffset - bondLength*Math.cos(2*Math.PI/6), nextY - suboffset - bondLength*Math.sin(2*Math.PI/6)); 






        
        let x = startX;
        let y = startY;
        let suboffset = 10;
        // Loop through carbons to draw zigzag
        for (let i = 0; i < numCarbons+1; i++) {
            let nextX = x + bondLength;
            let nextY = y + (i % 2 === 0 ? -bondLength : bondLength);

            // Draw CC bond line
            ctx.beginPath();
            ctx.setLineDash([]);
            ctx.moveTo(x, y);
            ctx.lineTo(nextX, nextY);
            ctx.stroke();
            ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
            //ctx.fillText(substituents[i].left, nextX - suboffset - bondLength*Math.cos(2*Math.PI/6), nextY - suboffset - bondLength*Math.sin(2*Math.PI/6)); 


            //drawWedgeBond(x, y, bondLength, false); 


            let widthfact = Math.PI/24; 


            // Draw sub bond line 1
            function isOdd(num){return num % 2;}

            if (i < numCarbons){
                
                console.log(i);
                if (!isOdd(i)) { //down facing wedges
                    ctx.beginPath();
                    ctx.textAlign = 'right';
                    ctx.textBaseline = 'middle';

                    ctx.moveTo(nextX, nextY);
                    
                    let subX = nextX - bondLength*Math.cos(2*Math.PI/6-widthfact);
                    let subY = nextY - bondLength*Math.sin(2*Math.PI/6-widthfact);
                    tsubX = nextX - bondLength*Math.cos(2*Math.PI/6 + widthfact);
                    tsubY = nextY - bondLength*Math.sin(2*Math.PI/6 + widthfact);
                    ctx.lineTo(subX, subY);
                    ctx.lineTo(tsubX, tsubY);
                    ctx.closePath();
                    ctx.fill();
                    ctx.fillText(substituents[i].left, nextX - suboffset - bondLength*Math.cos(2*Math.PI/6), nextY - suboffset - bondLength*Math.sin(2*Math.PI/6)); 


                    ctx.beginPath();
                    ctx.moveTo(nextX, nextY);
                    console.log(Math.cos(2*Math.PI/9));
                    console.log(Math.sin(2*Math.PI/9));
                    subX = nextX - bondLength*Math.cos(2*Math.PI/3-widthfact);
                    subY = nextY - bondLength*Math.sin(2*Math.PI/3-widthfact);
                    tsubX = nextX - bondLength*Math.cos(2*Math.PI/3 + widthfact);
                    tsubY = nextY - bondLength*Math.sin(2*Math.PI/3 + widthfact);
                    
                   

                    ctx.lineTo(subX, subY);
                    ctx.lineTo(tsubX, tsubY);
                    ctx.setLineDash([5, 5]);
                    ctx.closePath();
                    //ctx.closePath();
                    //ctx.fill();
                    ctx.stroke();

                    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                    ctx.fillText(substituents[i].right, nextX + suboffset - bondLength*Math.cos(2*Math.PI/3), nextY - suboffset - bondLength*Math.sin(2*Math.PI/3)); 


                } else {
                    //down facing wedges
                    ctx.beginPath();

                    
                    ctx.moveTo(nextX, nextY);
                    console.log(Math.cos(2*Math.PI*3/8));
                    console.log(Math.sin(2*Math.PI*3/8));
                    subX = nextX + bondLength*Math.cos(2*Math.PI/6-widthfact);
                    subY = nextY + bondLength*Math.sin(2*Math.PI/6)-widthfact;
                    tsubX = nextX + bondLength*Math.cos(2*Math.PI/6 + widthfact);
                    tsubY = nextY + bondLength*Math.sin(2*Math.PI/6 + widthfact);

                    ctx.lineTo(subX, subY);
                    ctx.lineTo(tsubX, tsubY);
                    ctx.setLineDash([5, 5]);
                    //ctx.fill();
                    
                    ctx.closePath();
                    ctx.stroke();
                    //ctx.fill();
                    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                    ctx.fillText(substituents[i].right, nextX - suboffset - bondLength*Math.cos(2*Math.PI/6), nextY + suboffset + bondLength*Math.sin(2*Math.PI/6)); 



                // Draw sub bond line 2

                    ctx.beginPath();
                    ctx.moveTo(nextX, nextY);
                    console.log(Math.cos(2*Math.PI/9));
                    console.log(Math.sin(2*Math.PI/9));
                    subX = nextX + bondLength*Math.cos(2*Math.PI/3-widthfact);
                    subY = nextY + bondLength*Math.sin(2*Math.PI/3-widthfact);
                    tsubX = nextX + bondLength*Math.cos(2*Math.PI/3 + widthfact);
                    tsubY = nextY + bondLength*Math.sin(2*Math.PI/3 + widthfact);
                    ctx.lineTo(tsubX, tsubY);
                    ctx.lineTo(subX, subY);
                    //ctx.fill();
                    //ctx.setLineDash([5, 5]);
                    ctx.closePath();
                    //ctx.stroke();
                    ctx.fill();
                
                    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
                    ctx.fillText(substituents[i].left, nextX + suboffset - bondLength*Math.cos(2*Math.PI/3), nextY + suboffset + bondLength*Math.sin(2*Math.PI/3)); 

                }



            }



            // Add substituents
            const substituent = substituents[i];

            // Place substituents above/below based on alternating zigzag pattern
            const offset = (i % 2 === 0) ? -20 : 20;
            //console.log(substituent.left);
            //ctx.fillText(substituent.left, (x + nextX) / 2, y + offset);  // Left substituent
            //ctx.fillText(substituent.right, (x + nextX) / 2, y - offset); // Right substituent

            // Move to next bond position
            x = nextX;
            y = nextY;
        }
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText(document.getElementById('bottom').value,x,y);

    }
    
    
    

    // Update Fischer projection and inputs when the number of stereocenters changes
    document.getElementById('stereocenters').addEventListener('input', () => {
        updateInputFields();
        drawFischerProjection();
    });











    // Initial draw and input setup
    updateInputFields(true);
    drawFischerProjection();
    drawZigzag(stereocenters);
    
    
});

