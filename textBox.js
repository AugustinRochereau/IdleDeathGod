speakerRevealName = {
    'God': true,
};

const TextBox = {
    textContainer: null,
    textQueue: [],
    typing: false,
    textBeingDisplayed: null,
    textSpeed: 120, // Adjust the typing speed as needed
    
    init: function(containerId) {
        this.textContainer = document.getElementById(containerId);
        this.typeText();
        this.addText("A very short time after the creation of the humans, God got very quickly bored of them. Instead of supervising them, he creates a new entity, deep below the mortal realm");
        this.addText("...  ... You.");
        this.addText("Watch over the mortals, my creation. I have more important matters to attend. You are in charge of the upper as the below realm, do as you will, but try to keep them going.", 'God');
    },
    
    typeText: function() {
        if (this.textQueue.length > 0 && !this.typing) {
            this.typing = true;
            const { text, speaker } = this.textQueue.shift();
            this.textBeingDisplayed = text;
            const textElement = document.createElement('div');
            if (speaker === 'God') {
                textElement.className = 'godText';
                textElement.innerHTML = text.split('').map((char, index) => {
                  if(char == ' ')
                  { 
                    return `<span style="animation-delay: ${Math.random() * 2 - 1}s;">&nbsp;</span>`
                  }
                  else
                  {
                    return `<span style="animation-delay: ${Math.random()*2 - 1}s;">${char}</span>`
                  }
                }).join('');
            }
            else{
            textElement.textContent = text;
            }
            this.textContainer.appendChild(textElement);
            
            const animationDuration = (text.length * this.textSpeed) / 1000;
            textElement.style.animation = `scrollText ${animationDuration}s linear forwards`;
            
            textElement.addEventListener('animationend', () => {
                this.typing = false;
                textElement.remove();
                
                // Check if there's more text in the queue
                if (this.textQueue.length > 0) {
                    this.typeText();
                }
            });
        }
    },
    
    addText: function(newText, speaker='') {
        if (newText !== this.textBeingDisplayed) {
            let textToDisplay = '';
            if (speaker !== '') {
                if (speakerRevealName[speaker]) {
                    textToDisplay = speaker + ": " + newText;
                } else {
                    textToDisplay = "????: " + newText;
                }
            } else {
                textToDisplay = newText;
            }
            this.textQueue.push({text: textToDisplay, speaker: speaker});
            if (!this.typing) {
                this.typeText();
            }
        }
    }
};

// Function to initialize TextBox object after DOM content is loaded
function initializeTextBox() {
    TextBox.init('textContainer');
}

// Call the initialization function after DOM content is loaded
document.addEventListener("DOMContentLoaded", initializeTextBox);
