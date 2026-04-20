/**
 * Dialogue System
 * Manages dialogue boxes and branching conversations
 */

class DialogueManager {
    constructor() {
        this.currentDialogue = null;
        this.currentSegmentIndex = 0;
        this.isDisplaying = false;
        this.isTyping = false;
        this.typingSpeed = 5; // milliseconds per character
        this.typingInterval = null;
        this.dialogueBox = document.getElementById('dialogue-box');
        this.dialogueText = document.getElementById('dialogue-text');
        this.dialogueChoices = document.getElementById('dialogue-choices');
        this.characterNameElement = document.getElementById('character-name');
        this.portraitImage = document.getElementById('dialogue-portrait');
        this.defaultPortraitPath = 'assets/characters/darling.png';
        this.onButtonClick = null;
        this.onDialogueEnd = null;
    }

    playButtonClick() {
        if (typeof this.onButtonClick === 'function') {
            this.onButtonClick();
        }
    }

    /**
     * Display a dialogue
     */
    displayDialogue(dialogue) {
        this.currentDialogue = dialogue;
        this.currentSegmentIndex = 0;
        this.isDisplaying = true;
        
        // Show dialogue box
        this.dialogueBox.classList.remove('hidden');
        
        // Set dialogue box background image if provided
        if (dialogue.boxImagePath) {
            this.dialogueBox.style.backgroundImage = `url('${dialogue.boxImagePath}')`;
        } else {
            this.dialogueBox.style.backgroundImage = '';
        }
        
        // Set character name if provided
        if (dialogue.characterName) {
            this.characterNameElement.textContent = dialogue.characterName;
        } else {
            this.characterNameElement.textContent = '';
        }
        
        // Set portrait if provided
        if (dialogue.portraitPath) {
            this.setPortrait(dialogue.portraitPath);
        } else {
            this.clearPortrait();
        }

        // Clear stale UI immediately so previous scene buttons do not flash
        this.dialogueText.textContent = '';
        this.dialogueChoices.innerHTML = '';
        
        // Show first segment
        this.displaySegment();
    }

    /**
     * Display current dialogue segment with typing animation
     */
    displaySegment() {
        // Clear any existing typing interval
        if (this.typingInterval) {
            clearInterval(this.typingInterval);
            this.typingInterval = null;
        }
        
        const dialogue = this.currentDialogue;
        
        // Get current text (handle array of segments or single string)
        const segments = Array.isArray(dialogue.text) ? dialogue.text : [dialogue.text];
        const currentText = segments[this.currentSegmentIndex];
        
        // Clear the text display
        this.dialogueText.textContent = '';

        // Clear choices while typing this segment
        this.dialogueChoices.innerHTML = '';
        
        // Update character name if there's a per-segment character names array
        if (dialogue.characterNames && Array.isArray(dialogue.characterNames)) {
            const currentName = dialogue.characterNames[this.currentSegmentIndex] || '';
            this.characterNameElement.textContent = currentName;
        }
        
        // Start typing animation
        this.typeText(currentText);
    }

    /**
     * Type out text character by character
     */
    typeText(text) {
        this.isTyping = true;
        let charIndex = 0;
        
        const typeInterval = () => {
            if (charIndex < text.length) {
                this.dialogueText.textContent += text[charIndex];
                charIndex++;
            } else {
                // Typing complete
                clearInterval(this.typingInterval);
                this.typingInterval = null;
                this.isTyping = false;
                this.showChoices();
            }
        };
        
        this.typingInterval = setInterval(typeInterval, this.typingSpeed);
    }

    /**
     * Show choices after typing is complete
     */
    showChoices() {
        const dialogue = this.currentDialogue;
        
        // Clear previous choices
        this.dialogueChoices.innerHTML = '';
        
        // Check if more segments exist
        const segments = Array.isArray(dialogue.text) ? dialogue.text : [dialogue.text];
        const hasMoreSegments = this.currentSegmentIndex < segments.length - 1;
        
        if (hasMoreSegments) {
            // Show continue button to advance to next segment
            const continueBtn = document.createElement('button');
            continueBtn.className = 'dialogue-choice';
            continueBtn.textContent = 'Continue...';
            continueBtn.onclick = () => {
                this.playButtonClick();
                this.currentSegmentIndex++;
                this.displaySegment();
            };
            this.dialogueChoices.appendChild(continueBtn);
        } else {
            // Show choices at the end
            if (dialogue.choices && dialogue.choices.length > 0) {
                for (let choice of dialogue.choices) {
                    const choiceBtn = document.createElement('button');
                    choiceBtn.className = 'dialogue-choice';
                    choiceBtn.textContent = choice.text;
                    choiceBtn.onclick = () => {
                        this.playButtonClick();
                        this.selectChoice(choice);
                    };
                    this.dialogueChoices.appendChild(choiceBtn);
                }
            } else {
                // If no choices, show close button
                const closeBtn = document.createElement('button');
                closeBtn.className = 'dialogue-choice';
                closeBtn.textContent = 'Close';
                closeBtn.onclick = () => {
                    this.playButtonClick();
                    this.endDialogue();
                };
                this.dialogueChoices.appendChild(closeBtn);
            }
        }
    }

    /**
     * Handle choice selection
     */
    selectChoice(choice) {
        if (choice.nextDialogueId) {
            // Continue to next dialogue
            if (this.currentDialogue.nextDialogues && 
                this.currentDialogue.nextDialogues[choice.nextDialogueId]) {
                this.displayDialogue(this.currentDialogue.nextDialogues[choice.nextDialogueId]);
            } else {
                this.endDialogue();
            }
        } else {
            this.endDialogue();
        }
        
        // Execute choice callback if exists
        if (choice.onSelect) {
            choice.onSelect();
        }
    }

    /**
     * End current dialogue
     */
    endDialogue() {
        // Clear any typing interval
        if (this.typingInterval) {
            clearInterval(this.typingInterval);
            this.typingInterval = null;
        }
        
        this.isDisplaying = false;
        this.isTyping = false;
        this.currentDialogue = null;
        this.dialogueBox.classList.add('hidden');
        this.portraitImage.classList.add('hidden');
        this.dialogueText.textContent = '';
        this.dialogueChoices.innerHTML = '';
        this.characterNameElement.textContent = '';
        this.dialogueBox.style.backgroundImage = '';
        
        if (this.onDialogueEnd) {
            this.onDialogueEnd();
        }
    }

    /**
     * Set the dialogue portrait image
     */
    setPortrait(imagePath) {
        if (imagePath) {
            this.portraitImage.src = this.defaultPortraitPath;
            this.portraitImage.classList.remove('hidden');
        } else {
            this.portraitImage.classList.add('hidden');
        }
    }

    /**
     * Clear the dialogue portrait image
     */
    clearPortrait() {
        this.portraitImage.classList.add('hidden');
        this.portraitImage.src = '';
    }

    /**
     * Hide dialogue box
     */
    hide() {
        this.dialogueBox.classList.add('hidden');
        this.isDisplaying = false;
    }

    /**
     * Check if currently displaying dialogue
     */
    isActive() {
        return this.isDisplaying;
    }
}

/**
 * Dialogue Tree - represents a conversation
 */
class Dialogue {
    constructor(id, text, choices = [], portraitPath = null, characterName = null, characterNames = null, boxImagePath = null) {
        this.id = id;
        this.text = text;
        this.choices = choices;
        this.nextDialogues = {};
        this.portraitPath = portraitPath;
        this.characterName = characterName;
        this.characterNames = characterNames;
        this.boxImagePath = boxImagePath;
    }

    /**
     * Add a choice option
     */
    addChoice(choice) {
        this.choices.push(choice);
    }

    /**
     * Set next dialogue for a choice
     */
    setNextDialogue(choiceIndex, nextDialogue) {
        if (this.choices[choiceIndex]) {
            const choiceId = `choice_${choiceIndex}`;
            this.choices[choiceIndex].nextDialogueId = choiceId;
            this.nextDialogues[choiceId] = nextDialogue;
        }
    }
}

/**
 * Dialogue Choice - represents an option in a dialogue
 */
class DialogueChoice {
    constructor(text, nextDialogueId = null, onSelect = null) {
        this.text = text;
        this.nextDialogueId = nextDialogueId;
        this.onSelect = onSelect;
    }

    /**
     * Set callback when this choice is selected
     */
    onChoose(callback) {
        this.onSelect = callback;
    }
}

/**
 * Helper function to create a simple dialogue from text
 */
function createSimpleDialogue(id, text, choices = []) {
    const dialogue = new Dialogue(id, text);
    for (let choiceText of choices) {
        dialogue.addChoice(new DialogueChoice(choiceText));
    }
    return dialogue;
}
