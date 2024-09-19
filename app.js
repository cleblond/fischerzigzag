//document.addEventListener('DOMContentLoaded', () => {
 
    const canvas = document.getElementById('fischerCanvas');
    const ctx = canvas.getContext('2d');
    
    // Default substituents for Glucose
    let stereocenters = [
        { left: 'CH₃', right: 'OH' },  // C1
        { left: 'OH', right: 'NH₂' }  // C4
    ];
    
    let numStereocenters = parseInt(document.getElementById('stereocenters').value);

    function updateInputFields(first = false) {
        const container = document.getElementById('substituents-inputs');

        container.innerHTML = ''; // Clear previous inputs

        numStereocenters = parseInt(document.getElementById('stereocenters').value);

        const newsubsright = ['OH', 'H', 'Cl', 'Br'];
        const newsubsleft = ['HO', 'H', 'H₃C', 'H₂N'];

        for (let i = 0; i < numStereocenters; i++) {
            const sub = stereocenters[i] || { left: newsubsleft[Math.floor(Math.random() * newsubsleft.length)], right: newsubsright[Math.floor(Math.random() * newsubsright.length)] }; // Default values for new stereocenters
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
                <input id="${uuidv4()}" class="sub" type="text" data-index="${i}" data-side="left" value="${sub.left}">
                <label>Right:</label>
                <input id="${uuidv4()}" class="sub" type="text" data-index="${i}" data-side="right" value="${sub.right}">
            `;

            container.appendChild(div);
        }

        // Add event listeners for new input fields
        const inputs = document.querySelectorAll('.sub');
        //const inputs = document.getElementsByClassName('sub')


        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                const side = e.target.getAttribute('data-side');


                if (e.target.id == "topc" || e.target.id == "bottom"){

                    if (Number.isInteger(parseInt(e.data))) {
                        const position = e.target.selectionStart - 1; // Subtract 1 to get the position of the last character added
            
                        const subscripts = ["\u2080", "\u2081", "\u2082", "\u2083", "\u2084", "\u2085", "\u2086", "\u2087", "\u2088", "\u2089"];
                        let str = document.getElementById(e.target.id).value;
                        let newStr = str.substring(0, position) + subscripts[e.data] + str.substring(position + 1);
                        
                        document.getElementById(e.target.id).value = newStr; 

                        //stereocenters[e.target.dataset.index][e.target.dataset.side] = newStr;

                        
                    }


                
                } else {
                    stereocenters[index][side] = e.target.value;
                    if (Number.isInteger(parseInt(e.data))) {
                        const position = e.target.selectionStart - 1; // Subtract 1 to get the position of the last character added
            
                        const subscripts = ["\u2080", "\u2081", "\u2082", "\u2083", "\u2084", "\u2085", "\u2086", "\u2087", "\u2088", "\u2089"];
                        let str = document.getElementById(e.target.id).value;
                        let newStr = str.substring(0, position) + subscripts[e.data] + str.substring(position + 1);
                        
                        document.getElementById(e.target.id).value = newStr; 

                        stereocenters[e.target.dataset.index][e.target.dataset.side] = newStr;

                        
                    }
                }
                //updateInputFields();
                drawFischerProjection(); // Redraw after updating substituents
                drawZigzag(stereocenters);
            });
        });
    }

    function drawFischerProjection() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 2;
        numStereocenters = parseInt(document.getElementById('stereocenters').value);
        
        const centerX = canvas.width / 2;
        const centerY = 120;
        const bondLength = 50;
        const bondOffset = 50;

      //const sub = stereocenters[i % stereocenters.length];
        // Draw CHO at the top (above C1)
        
        console.log(bondLength);
        
        ctx.font = "20px Arial";
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        
        ctx.fillText(document.getElementById('topc').value, centerX-7, centerY-bondLength);
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - bondLength);
        ctx.lineTo(centerX, centerY); // Bond connecting CHO to C1
        ctx.stroke();
        console.log(numStereocenters);

        // Draw stereocenters and substituents
        for (let i = 0; i < numStereocenters; i++) {
            const sub = stereocenters[i];
            console.log(i);
            console.log(stereocenters);
            console.log(sub);
            console.log(stereocenters[i]);
            const y = centerY + i * bondLength;
            
            // Draw the vertical carbon backbone
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX, y);
            ctx.stroke();

            // Draw horizontal bonds and substituents
            
            //console.log(sub);

            // Left substituent
            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
            ctx.fillText(sub.left, centerX - bondOffset, y);
            ctx.beginPath();
            ctx.moveTo(centerX, y);
            ctx.lineTo(centerX - bondOffset, y);
            ctx.stroke();4

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
        ctx.fillText('CH₂OH', centerX-7, lastY + bondLength);
        ctx.beginPath();
        ctx.moveTo(centerX, lastY);
        ctx.lineTo(centerX, lastY + bondLength); // Bond connecting last stereocenter to CH2OH
        ctx.stroke();
    }
    
    function reverseString(str) {
        console.log(str);

        var splitString = str.split(""); // var splitString = "hello".split("");
        var reverseArray = splitString.reverse(); // var reverseArray = ["h", "e", "l", "l", "o"].reverse();
        var joinArray = reverseArray.join(""); // var joinArray = ["o", "l", "l", "e", "h"].join("");
        return joinArray; // "olleh"
    
    }
    
    function drawZigzag(substituents) {
        
        const canvas = document.getElementById('zigzagCanvas');
        const ctx = canvas.getContext('2d');
        
        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        
        const startX = 75;
        const startY = 125;
        const bondLength = 50;
        let suboffset = 7;
        numStereocenters = parseInt(document.getElementById('stereocenters').value);
        //const numCarbons = substituents.length; // Number of carbons (matches stereocenters)

        // Clear canvas before drawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Set drawing style
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        
        ctx.font = "20px Arial";
        //ctx.textAlign = "center";


        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        //console.log(document.getElementById('topc').value);
        //console.log(document.getElementById('bottom').value);

        ctx.fillText(reverseString(document.getElementById('topc').value), startX-suboffset, startY);
        //ctx.fillText(substituents[i].left, nextX - suboffset - bondLength*Math.cos(2*Math.PI/6), nextY - suboffset - bondLength*Math.sin(2*Math.PI/6)); 






        
        let x = startX;
        let y = startY;

        // Loop through carbons to draw zigzag
        for (let i = 0; i < numStereocenters+1; i++) {
            let nextX = x + bondLength;
            let nextY = y + i+15 +(i % 2 === 0 ? -bondLength+30 : bondLength-30);

            // Draw CC bond line
            ctx.beginPath();
            ctx.setLineDash([]);
            ctx.moveTo(x, y);
            ctx.lineTo(nextX, nextY);
            ctx.stroke();
            ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
            //ctx.fillText(substituents[i].left, nextX - suboffset - bondLength*Math.cos(2*Math.PI/6), nextY - suboffset - bondLength*Math.sin(2*Math.PI/6)); 
            const anglef1 = 36/11;
            const anglef2 = 36/7;
            //const anglef1 = 3;
            //const anglef2 = 6;



            //drawWedgeBond(x, y, bondLength, false); 


            let widthfact = Math.PI/24; 


            // Draw sub bond line 1
            function isOdd(num){return num % 2;}

            if (i < numStereocenters){
                
                //console.log(i);
                if (!isOdd(i)) { //down facing wedges
                    ctx.beginPath();
                    ctx.textAlign = 'right';
                    ctx.textBaseline = 'middle';

                    ctx.moveTo(nextX, nextY);
                    
                    let subX = nextX - bondLength*Math.cos(2*Math.PI/anglef2-widthfact);
                    let subY = nextY - bondLength*Math.sin(2*Math.PI/anglef2-widthfact);
                    tsubX = nextX - bondLength*Math.cos(2*Math.PI/anglef2 + widthfact);
                    tsubY = nextY - bondLength*Math.sin(2*Math.PI/anglef2 + widthfact);
                    ctx.lineTo(subX, subY);
                    ctx.lineTo(tsubX, tsubY);
                    ctx.closePath();
                    ctx.fill();
                    ctx.fillText(substituents[i].left, nextX + suboffset - bondLength*Math.cos(2*Math.PI/anglef2), nextY - 2*suboffset - bondLength*Math.sin(2*Math.PI/anglef2)); 


                    ctx.beginPath();
                    ctx.moveTo(nextX, nextY);
                    //console.log(Math.cos(2*Math.PI/9));
                    //console.log(Math.sin(2*Math.PI/9));
                    subX = nextX - bondLength*Math.cos(2*Math.PI/anglef1-widthfact);
                    subY = nextY - bondLength*Math.sin(2*Math.PI/anglef1-widthfact);
                    tsubX = nextX - bondLength*Math.cos(2*Math.PI/anglef1 + widthfact);
                    tsubY = nextY - bondLength*Math.sin(2*Math.PI/anglef1 + widthfact);
                    
                   

                    ctx.lineTo(subX, subY);
                    ctx.lineTo(tsubX, tsubY);
                    ctx.setLineDash([5, 5]);
                    ctx.closePath();
                    //ctx.closePath();
                    //ctx.fill();
                    ctx.stroke();

                    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                    ctx.fillText(substituents[i].right, nextX - suboffset - bondLength*Math.cos(2*Math.PI/anglef1), nextY - 2*suboffset - bondLength*Math.sin(2*Math.PI/anglef1)); 


                } else {
                    //down facing wedges
                    ctx.beginPath();

                    
                    ctx.moveTo(nextX, nextY);
                    //console.log(Math.cos(2*Math.PI*3/8));
                    //console.log(Math.sin(2*Math.PI*3/8));
                    subX = nextX + bondLength*Math.cos(2*Math.PI/anglef2-widthfact);
                    subY = nextY + bondLength*Math.sin(2*Math.PI/anglef2-widthfact);
                    tsubX = nextX + bondLength*Math.cos(2*Math.PI/anglef2 + widthfact);
                    tsubY = nextY + bondLength*Math.sin(2*Math.PI/anglef2 + widthfact);

                    ctx.lineTo(subX, subY);
                    ctx.lineTo(tsubX, tsubY);
                    ctx.setLineDash([5, 5]);
                    //ctx.fill();
                    
                    ctx.closePath();
                    ctx.stroke();
                    //ctx.fill();
                    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                    ctx.fillText(substituents[i].right, nextX + suboffset - bondLength*Math.cos(2*Math.PI/anglef2), nextY + 2*suboffset + bondLength*Math.sin(2*Math.PI/anglef2)); 



                // Draw sub bond line 2

                    ctx.beginPath();
                    ctx.moveTo(nextX, nextY);
                    //console.log(Math.cos(2*Math.PI/9));
                    //console.log(Math.sin(2*Math.PI/9));
                    subX = nextX + bondLength*Math.cos(2*Math.PI/anglef1-widthfact);
                    subY = nextY + bondLength*Math.sin(2*Math.PI/anglef1-widthfact);
                    tsubX = nextX + bondLength*Math.cos(2*Math.PI/anglef1 + widthfact);
                    tsubY = nextY + bondLength*Math.sin(2*Math.PI/anglef1 + widthfact);
                    ctx.lineTo(tsubX, tsubY);
                    ctx.lineTo(subX, subY);
                    //ctx.fill();
                    //ctx.setLineDash([5, 5]);
                    ctx.closePath();
                    //ctx.stroke();
                    ctx.fill();
                
                    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
                    ctx.fillText(substituents[i].left, nextX + suboffset - bondLength*Math.cos(2*Math.PI/anglef1), nextY + suboffset + bondLength*Math.sin(2*Math.PI/anglef1)); 

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
        
        
        
        if (isOdd(numStereocenters)) {
        console.log("odd");
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        } else {
        console.log("even");
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        }
        ctx.fillText(document.getElementById('bottomc').value,x+suboffset,y);

    }
    
    
    

    // Update Fischer projection and inputs when the number of stereocenters changes
    document.getElementById('stereocenters').addEventListener('input', (e) => {
        
        
        if (e.target.value > numStereocenters) {


        } else if (e.target.value < numStereocenters) {
        	 const numStereocenters = parseInt(document.getElementById('stereocenters').value);
        	 delete stereocenters[numStereocenters];
        
        }

        
        updateInputFields();
        drawFischerProjection();
        drawZigzag(stereocenters);
    });











    // Initial draw and input setup
    updateInputFields(true);
    drawFischerProjection();
    drawZigzag(stereocenters);
    
    
//});

