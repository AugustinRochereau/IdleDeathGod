function techUpgrade(name, cost, isactive, canbuy, parents, buyfunction, hudfunction) {
    this.name = name;
    this.cost = cost;
    this.isactive = isactive;
    this.canbuy = canbuy;
    this.parents = parents;
    this.buyfunction = buyfunction;
		this.hudfunction = hudfunction;
}


technologies = {
    "tech-fire": new techUpgrade("Fire", 50, false, true, [],
     function () {
      gV.maxLivingHumans*=2;
      TextBox.addText("You bring humans fire. It helps them survive.");
     }, function(){}),
    "tech-tools1": new techUpgrade("Tools 1", 100, false, false, ["tech-fire"], 
    function () {
      gV.maxLivingHumans*=2;
      TextBox.addText("Out of boredom, you take human form and explain to one guy " +
                      "how to make tools using rocks. He was very impressed.");
    }, function(){}),
    "tech-crops": new techUpgrade("Crops", 500, false, false, ["tech-tools1"], 
    function() {
      gV.maxLivingHumans*=2;
      TextBox.addText("PLACEHOLDER_UNLOCK_CROPS.");
    }, function(){}),
    "tech-huts": new techUpgrade("Huts", 200, false, false, ["tech-tools1"], 
    function() {
      gV.growthSlowdown -= 0.2;
      TextBox.addText("PLACEHOLDER_UNLOCK_HUTS.");
    }, function(){}),
    "tech-speech": new techUpgrade("Speech", 1000, false, false, ["tech-huts"], 
    function() {
      gV.soulPointMultiplier *= 1.2;
      TextBox.addText("God is happy that you brought his creatures all the way to this advanced form of communication.")
    }, function(){}),
    "tech-unlock-soul-vessels": new techUpgrade("Unlock Soul Vessels", 2000, false, false, ["tech-crops"], 
		function() {}
			,
    function() {
      document.getElementById("soulVessels").style.display = "block";
      TextBox.addText("Tinkering with the fabric of souls led to the creation of soul vessels. More souls for you");
    }),
    "tech-unlock-world-tendancy": new techUpgrade("World Tendancy", 5000, false, false, ["tech-speech"], 
			function(){},
    function(){
      document.getElementById("worldTendancy").style.display = "block";
      TextBox.addText("PLACEHOLDER_UNLOCK_WORLD_TENDANCY");
    }),
    "tech-money-system": new techUpgrade("Money System", 8000, false, false, ["tech-unlock-soul-vessels"], 
    function (){
        gV.maxHumansGrowthRateMultiplierCondition = 1;
    }, function(){}),
    "tech-basic-medicine": new techUpgrade("Basic Medicine", 50000, false, false, ["tech-unlock-world-tendancy"], 0,
    function (){
        gV.worldTendancyMaxLifeExpectancy += 10;
    }, function(){}),
    "tech-disease-mutation": new techUpgrade("Disease Mutation", 100000, false, false, ["tech-money-system"], 
    function(){
        diseaseMutation = true;
    },function(){}),
}

// let worldTendancyMinLifeExpectancy = 15;
// let worldTendancyMaxLifeExpectancy = 25;

techUpgradeWindowActive = false;


function updateTechDependencies()
{
  for(var key in technologies)
  {
    var buyable = true;
    for(pId of technologies[key].parents)
    {
      if(!technologies[pId].isactive) 
      {
        buyable = false;
        break;
      }
    }
    technologies[key].canbuy = buyable;
    if(technologies[key].isactive)
    {
      technologies[key].canbuy = false;
    }
  }
}

function buyTechUpgrade(buttonId){
    upgrade = technologies[buttonId];
    if(upgrade.canbuy)  {
        if (gV.deadSouls >= upgrade.cost) {
            gV.deadSouls -= upgrade.cost;
            upgrade.isactive = true;
            upgrade.canbuy = false;
            upgrade.buyfunction();
        }
    }
    updateTechDependencies();
    updateTechButtonsDisplay();
}

function updateTechButtonsDisplay() {
    for (var id in technologies) {
        const button = document.getElementById(id);
        upgrade = technologies[id];
        if (upgrade.isactive) {
            button.classList.remove("techUpgradeTreeButtonCannotBuy");
            button.classList.remove("techUpgradeTreeButtonCanBuy");
            button.classList.remove("techUpgradeTreeButtonActive");

            button.classList.add("techUpgradeTreeButtonActive");
        } else if (!upgrade.canbuy) {
            button.classList.remove("techUpgradeTreeButtonCannotBuy");
            button.classList.remove("techUpgradeTreeButtonCanBuy");
            button.classList.remove("techUpgradeTreeButtonActive");

            button.classList.add("techUpgradeTreeButtonCannotBuy");
        } else {
            button.classList.remove("techUpgradeTreeButtonCannotBuy");
            button.classList.remove("techUpgradeTreeButtonCanBuy");
            button.classList.remove("techUpgradeTreeButtonActive");

            button.classList.add("techUpgradeTreeButtonCanBuy");         
        }
    }
}

function frameTechButtonsUpdate(){
    multiplier = Math.max(1, gV.deadSouls / 1000);
    button = document.getElementById("tech-money-system")
    const descriptionSpan = button.querySelector('.upgradeDescription');
    if (multiplier < 100){
        descriptionSpan.textContent = 'Multiplier to max human growth rate based on souls: x' + floatNumberFormat(multiplier);
    } else {
        descriptionSpan.textContent = 'Multiplier to max human growth rate based on souls: Capped at x100';        
    }

}

function toggleTechUpgradeWindow() {
    if (!techUpgradeWindowActive) {
        document.getElementById('upgradeWindow').style.display = 'block';
        techUpgradeWindowActive = true;
    } else {
        document.getElementById('upgradeWindow').style.display = 'none';
        techUpgradeWindowActive = false;
    }
}

function drawAllLines() {
    // TODO change with the new parents feature
    for(var id in technologies)
    {
      for(var pId of technologies[id].parents)
      {
        drawLine(id, pId);
      }
    }
    //drawLine("tech-fire", "tech-tools1");
    //drawLine("tech-tools1", "tech-crops");
    //drawLine("tech-tools1", "tech-huts");
    //drawLine("tech-huts", "tech-speech");
    //drawLine("tech-crops", "tech-unlock-soul-vessels");
    //drawLine("tech-speech", "tech-unlock-world-tendancy");
}

function drawLine(fromId, toId) {
    var fromElement = document.getElementById(fromId);
    var toElement= document.getElementById(toId);
    var linesContainer=document.getElementById('linesContainer');

    var fromRect = fromElement.style;
    var toRect = toElement.style;
    
    var fromX = parseFloat(fromRect.left + fromRect.width / 2);
    var fromY = parseFloat(fromRect.top + fromRect.height / 2);
    var toX = parseFloat(toRect.left + toRect.width / 2);
    var toY = parseFloat(toRect.top + toRect.height / 2);


    var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', fromX);
    line.setAttribute('y1', fromY);
    line.setAttribute('x2', toX);
    line.setAttribute('y2', toY);
    line.setAttribute('stroke', 'white');
    line.setAttribute('stroke-width', '2');

    linesContainer.appendChild(line);
}

document.addEventListener('DOMContentLoaded', (event) => {
    // Dragging functionality
    dragElement(document.getElementById("upgradeWindow"));

    function dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        var header = elmnt.querySelector(".upgradeWindowHeader");
        
        if (header) {
            // if present, the header is where you move the DIV from:
            header.onmousedown = dragMouseDown;
        } else {
            // otherwise, move the DIV from anywhere inside the DIV:
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // Custom panning for upgradeContent
    var upgradeBody = document.querySelector('.upgradeWindowBody');
    var upgradeContent = document.querySelector('.upgradeContent');
    var isPanning = false;
    var startX, startY, scrollLeft, scrollTop;

    upgradeBody.addEventListener('mousedown', (e) => {
        if (e.button === 0 || e.button === 2) { // Left or right mouse button
            isPanning = true;
            startX = e.clientX;
            startY = e.clientY;
            scrollLeft = upgradeBody.scrollLeft;
            scrollTop = upgradeBody.scrollTop;
            upgradeBody.style.cursor = 'grabbing';
        }
    });

    upgradeBody.addEventListener('mousemove', (e) => {
        if (!isPanning) return;
        e.preventDefault();
        const x = e.clientX;
        const y = e.clientY;
        const walkX = (x - startX); // Calculate distance moved
        const walkY = (y - startY); // Calculate distance moved
        upgradeBody.scrollLeft = scrollLeft - walkX;
        upgradeBody.scrollTop = scrollTop - walkY;
    });

    upgradeBody.addEventListener('mouseup', () => {
        isPanning = false;
        upgradeBody.style.cursor = 'grab';
    });

    upgradeBody.addEventListener('mouseleave', () => {
        isPanning = false;
        upgradeBody.style.cursor = 'grab';
    });

    // Prevent context menu on right-click
    upgradeBody.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    // Ensure lines are drawn after DOM is loaded
    drawAllLines();

    updateTechButtonsDisplay();
});

document.addEventListener('DOMContentLoaded', (event) => {
    const sliderThumb = document.querySelector('.sliderThumb');
    const sliderTrack = document.querySelector('.sliderTrack');
    let isDragging = false;

    sliderThumb.addEventListener('mousedown', (e) => {
        isDragging = true;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
        if (!isDragging) return;

        const trackRect = sliderTrack.getBoundingClientRect();
        let newLeft = e.clientX - trackRect.left - (sliderThumb.offsetWidth / 2);

        // Constrain the thumb within the track bounds
        if (newLeft < 0) {
            newLeft = 0;
        }
        const rightEdge = sliderTrack.offsetWidth - sliderThumb.offsetWidth;
        if (newLeft > rightEdge) {
            newLeft = rightEdge;
        }

        sliderThumb.style.left = newLeft + 'px';

        // Calculate the slider value (0 to 1) based on the thumb position
        const sliderValue = newLeft / rightEdge;

        // Update game parameter based on sliderValue
        updateGameParameter(sliderValue);
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    function updateGameParameter(value) {
        gV.lifeExpectancy = gV.worldTendancyMinLifeExpectancy + value * (gV.worldTendancyMaxLifeExpectancy - gV.worldTendancyMinLifeExpectancy);
    }

    // Allow clicking on the track to move the thumb
    sliderTrack.addEventListener('click', (e) => {
        const trackRect = sliderTrack.getBoundingClientRect();
        let newLeft = e.clientX - trackRect.left - (sliderThumb.offsetWidth / 2);

        if (newLeft < 0) {
            newLeft = 0;
        }
        const rightEdge = sliderTrack.offsetWidth - sliderThumb.offsetWidth;
        if (newLeft > rightEdge) {
            newLeft = rightEdge;
        }

        sliderThumb.style.left = newLeft + 'px';

        const sliderValue = newLeft / rightEdge;
        updateGameParameter(sliderValue);
    });
});
