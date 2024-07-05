function techUpgrade(name, cost, isactive, canbuy) {
    this.name = name;
    this.cost = cost;
    this.isactive = isactive;
    this.canbuy = canbuy;
}

technologies = {
    "tech-fire": new techUpgrade("Fire", 50, false, true),
    "tech-tools1": new techUpgrade("Tools 1", 100, false, false),
}

techUpgradeWindowActive = false;

function buyTechUpgrade(buttonId){
    upgrade = technologies[buttonId];
    if(upgrade.canbuy)  {
        if (deadSouls >= upgrade.cost) {
            deadSouls -= upgrade.cost;
            upgrade.isactive = true;
            upgrade.canbuy = false;
            switch (upgrade.name){
                case "Fire":
                    maxLivingHumans *= 2;
                    TextBox.addText("You bring humans fire. It helps them survive.");
                    technologies["tech-tools1"].canbuy = true;
                    break;
                case "Tools 1":
                    maxLivingHumans *= 2;
                    TextBox.addText("Out of boredom, you take human form and explain to one guy " +
                                    "how to make tools using rocks. He was very impressed.");               
                default:
                    break;
            }
        }
    }
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
    drawLine("tech-fire", "tech-tools1");
}

function drawLine(fromId, toId) {
    var fromElement = document.getElementById(fromId);
    var toElement=document.getElementById(toId);
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
        if (e.button === 2) { // Right mouse button
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