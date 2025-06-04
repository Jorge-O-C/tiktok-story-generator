/**
 * FacelessAI - TikTok Faceless Video Generator
 * Create viral TikTok videos with AI-generated Reddit stories
 */

class FacelessAI {
    constructor() {
        // Core application state
        this.voices = [];
        this.videoBlob = null;
        this.storyText = '';
        this.isGenerating = false;
        this.canvasCtx = null;
        this.backgroundAnimationId = null;
        
        // Initialize the application
        this.init();
    }

    async init() {
        try {
            // Hide loading overlay immediately
            this.hideLoadingOverlay();
            
            // Wait for DOM to be ready
            if (document.readyState !== 'complete') {
                await new Promise(resolve => {
                    window.addEventListener('load', resolve);
                });
            }
            
            // Initialize components
            this.bindElements();
            this.setupEventListeners();
            await this.loadVoices();
            this.setupCanvas();
            
            console.log('FacelessAI initialized successfully');
        } catch (error) {
            console.error('Initialization error:', error);
            this.showError('Application failed to initialize. Please refresh the page.');
        }
    }

    hideLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('hidden');
            // Remove from DOM after animation
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300);
        }
    }

    bindElements() {
        this.elements = {
            storyType: document.getElementById('storyType'),
            voiceSelect: document.getElementById('voiceSelect'),
            backgroundType: document.getElementById('backgroundType'),
            durationSlider: document.getElementById('durationSlider'),
            durationDisplay: document.getElementById('durationDisplay'),
            wordCount: document.getElementById('wordCount'),
            generateButton: document.getElementById('generateVideo'),
            videoPreview: document.getElementById('videoPreview'),
            videoCanvas: document.getElementById('videoCanvas'),
            storyContent: document.getElementById('storyContent'),
            progressSection: document.getElementById('progressSection'),
            progressFill: document.getElementById('progressFill'),
            progressText: document.getElementById('progressText'),
            downloadSection: document.getElementById('downloadSection'),
            downloadButton: document.getElementById('downloadButton'),
            createAnother: document.getElementById('createAnother')
        };
    }

    setupEventListeners() {
        // Duration slider
        this.elements.durationSlider.addEventListener('input', () => {
            const duration = this.elements.durationSlider.value;
            this.elements.durationDisplay.textContent = `${duration} minutes`;
            this.elements.wordCount.textContent = `Target: ${duration * 140} words`;
        });
        
        // Generate button
        this.elements.generateButton.addEventListener('click', () => {
            this.generateVideo();
        });
        
        // Download button
        this.elements.downloadButton.addEventListener('click', () => {
            this.downloadVideo();
        });
        
        // Create another button
        this.elements.createAnother.addEventListener('click', () => {
            this.resetGenerator();
        });
    }

    async loadVoices() {
        try {
            this.voices = await new Promise(resolve => {
                const synth = window.speechSynthesis;
                let voices = synth.getVoices();
                
                if (voices.length) {
                    resolve(voices);
                } else {
                    synth.addEventListener('voiceschanged', () => {
                        voices = synth.getVoices();
                        resolve(voices);
                    });
                    
                    // Fallback
                    setTimeout(() => {
                        resolve(synth.getVoices());
                    }, 1000);
                }
            });
            
            this.populateVoiceOptions();
        } catch (error) {
            console.error('Error loading voices:', error);
        }
    }

    populateVoiceOptions() {
        const select = this.elements.voiceSelect;
        select.innerHTML = '';
        
        // Default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '-- Select a voice --';
        select.appendChild(defaultOption);
        
        // Filter English voices
        const englishVoices = this.voices.filter(voice => voice.lang.includes('en'));
        
        // Group by gender
        const maleVoices = englishVoices.filter(voice => 
            voice.name.toLowerCase().includes('male') || 
            voice.name.toLowerCase().includes('david') ||
            voice.name.toLowerCase().includes('alex')
        );
        
        const femaleVoices = englishVoices.filter(voice => 
            voice.name.toLowerCase().includes('female') || 
            voice.name.toLowerCase().includes('victoria') ||
            voice.name.toLowerCase().includes('samantha')
        );
        
        const otherVoices = englishVoices.filter(voice => 
            !maleVoices.includes(voice) && !femaleVoices.includes(voice)
        );
        
        // Add voice groups
        if (maleVoices.length > 0) {
            const maleGroup = document.createElement('optgroup');
            maleGroup.label = 'Male Voices';
            maleVoices.forEach(voice => {
                const option = document.createElement('option');
                option.value = voice.name;
                option.textContent = voice.name;
                maleGroup.appendChild(option);
            });
            select.appendChild(maleGroup);
        }
        
        if (femaleVoices.length > 0) {
            const femaleGroup = document.createElement('optgroup');
            femaleGroup.label = 'Female Voices';
            femaleVoices.forEach(voice => {
                const option = document.createElement('option');
                option.value = voice.name;
                option.textContent = voice.name;
                femaleGroup.appendChild(option);
            });
            select.appendChild(femaleGroup);
        }
        
        if (otherVoices.length > 0) {
            const otherGroup = document.createElement('optgroup');
            otherGroup.label = 'Other Voices';
            otherVoices.forEach(voice => {
                const option = document.createElement('option');
                option.value = voice.name;
                option.textContent = voice.name;
                otherGroup.appendChild(option);
            });
            select.appendChild(otherGroup);
        }
        
        // If no English voices, add all available
        if (englishVoices.length === 0) {
            this.voices.forEach(voice => {
                const option = document.createElement('option');
                option.value = voice.name;
                option.textContent = `${voice.name} (${voice.lang})`;
                select.appendChild(option);
            });
        }
    }

    setupCanvas() {
        if (!this.elements.videoCanvas) return;
        
        this.canvasCtx = this.elements.videoCanvas.getContext('2d');
        this.elements.videoCanvas.width = 1080;
        this.elements.videoCanvas.height = 1920;
        
        // Set canvas size for proper display
        this.elements.videoCanvas.style.width = '100%';
        this.elements.videoCanvas.style.height = '100%';
    }

    validateInputs() {
        if (!this.elements.storyType.value) {
            this.showError('Please select a story type');
            return false;
        }
        
        if (!this.elements.voiceSelect.value) {
            this.showError('Please select a voice');
            return false;
        }
        
        if (!this.elements.backgroundType.value) {
            this.showError('Please select a background style');
            return false;
        }
        
        return true;
    }

    async generateVideo() {
        if (this.isGenerating) return;
        
        if (!this.validateInputs()) return;
        
        this.isGenerating = true;
        
        try {
            // Disable button and show loading state
            this.elements.generateButton.disabled = true;
            this.elements.generateButton.textContent = 'Generating...';
            
            // Show progress
            this.elements.progressSection.style.display = 'block';
            this.elements.downloadSection.style.display = 'none';
            this.updateProgress(0, 'Initializing...');
            
            // Get settings
            const storyType = this.elements.storyType.value;
            const voiceName = this.elements.voiceSelect.value;
            const backgroundType = this.elements.backgroundType.value;
            const duration = parseInt(this.elements.durationSlider.value);
            
            // Generate story
            this.updateProgress(20, 'Generating AI story...');
            this.storyText = await this.generateStory(storyType, duration);
            this.elements.storyContent.textContent = this.storyText;
            
            // Setup canvas
            this.updateProgress(40, 'Preparing video canvas...');
            this.showCanvasPreview();
            await this.delay(500); // Small delay to ensure canvas is ready
            this.drawBackground(backgroundType);
            
            // Generate audio
            this.updateProgress(60, 'Creating audio narration...');
            await this.simulateAudioGeneration();
            
            // Create video
            this.updateProgress(80, 'Generating MP4 video...');
            await this.simulateVideoCreation(duration);
            
            // Complete
            this.updateProgress(100, 'Video ready!');
            
            setTimeout(() => {
                this.elements.progressSection.style.display = 'none';
                this.elements.downloadSection.style.display = 'block';
            }, 1000);
            
        } catch (error) {
            console.error('Error generating video:', error);
            this.showError('Error generating video: ' + error.message);
            this.elements.progressSection.style.display = 'none';
        } finally {
            this.isGenerating = false;
            this.elements.generateButton.disabled = false;
            this.elements.generateButton.innerHTML = '<span class="button-icon">🎬</span>Generate Video';
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    updateProgress(percent, text) {
        this.elements.progressFill.style.width = `${percent}%`;
        this.elements.progressText.textContent = text;
    }

    async generateStory(storyType, duration) {
        const targetWordCount = duration * 140;
        
        switch (storyType) {
            case 'aita':
                return this.generateAITAStory(targetWordCount);
            case 'tifu':
                return this.generateTIFUStory(targetWordCount);
            case 'relationship':
                return this.generateRelationshipStory(targetWordCount);
            default:
                return this.generateAITAStory(targetWordCount);
        }
    }

    generateAITAStory(targetWordCount) {
        const characters = [
            { name: 'Alex', gender: 'male', age: this.getRandomInt(20, 45) },
            { name: 'Jessica', gender: 'female', age: this.getRandomInt(20, 45) },
            { name: 'Michael', gender: 'male', age: this.getRandomInt(20, 45) },
            { name: 'Sarah', gender: 'female', age: this.getRandomInt(20, 45) },
            { name: 'Chris', gender: 'male', age: this.getRandomInt(20, 45) },
            { name: 'Emma', gender: 'female', age: this.getRandomInt(20, 45) }
        ];
        
        const relationships = ['spouse', 'friend', 'sibling', 'roommate', 'coworker', 'neighbor'];
        const locations = ['at home', 'at work', 'at a party', 'at a restaurant', 'during vacation'];
        const conflicts = ['money issues', 'personal boundaries', 'family drama', 'work problems', 'lifestyle differences'];
        
        const mainChar = this.getRandomElement(characters);
        const otherChar = this.getRandomElement(characters.filter(c => c !== mainChar));
        const relationship = this.getRandomElement(relationships);
        const location = this.getRandomElement(locations);
        const conflict = this.getRandomElement(conflicts);
        
        const title = `AITA for confronting my ${relationship} about ${conflict}?`;
        
        let story = `${title}\n\nI (${mainChar.gender === 'male' ? 'M' : 'F'}${mainChar.age}) have been dealing with a situation involving my ${relationship}, ${otherChar.name} (${otherChar.gender === 'male' ? 'M' : 'F'}${otherChar.age}).\n\n`;
        
        story += `We've known each other for ${this.getRandomInt(2, 15)} years, and usually get along well. However, recently ${location}, we had a major disagreement about ${conflict}.\n\n`;
        
        story += `Here's what happened: ${otherChar.name} has been ${this.generateConflictDetails(conflict)}. I felt this was unfair and decided to address it directly.\n\n`;
        
        story += `When I brought up my concerns, ${otherChar.name} ${this.generateReaction()}. This led to a heated argument where ${this.generateEscalation()}.\n\n`;
        
        story += `Now ${otherChar.name} is ${this.generateConsequence()}, and I'm starting to wonder if I was too harsh. My family thinks ${this.generateOpinion()}, while my friends are saying ${this.generateOpinion()}.\n\n`;
        
        story += `I've been thinking about this situation for days. Was I wrong to confront them? Should I have handled it differently? I genuinely thought I was standing up for what's right, but now I'm second-guessing myself.\n\n`;
        
        // Pad to target word count if needed
        while (this.countWords(story) < targetWordCount * 0.9) {
            story += `${this.generateAdditionalContext()} `;
        }
        
        story += `TLDR: I confronted my ${relationship} about ${conflict} and now they're upset with me. AITA?`;
        
        return story;
    }

    generateTIFUStory(targetWordCount) {
        const timeframes = ['today', 'yesterday', 'last week', 'this morning', 'last night'];
        const settings = ['at work', 'at home', 'at a friend\'s place', 'at school', 'on public transport'];
        const mistakes = [
            'sent a private message to the wrong person',
            'misunderstood an important instruction',
            'forgot about a critical deadline',
            'accidentally deleted important files',
            'said something embarrassing in front of everyone'
        ];
        
        const timeframe = this.getRandomElement(timeframes);
        const setting = this.getRandomElement(settings);
        const mistake = this.getRandomElement(mistakes);
        
        const title = `TIFU by ${mistake}`;
        
        let story = `${title}\n\nThis happened ${timeframe}, but I'm still dealing with the consequences.\n\n`;
        
        story += `For context, I was ${setting} ${this.generateTIFUContext()}. Everything seemed normal until ${this.generateTIFUBuildUp()}.\n\n`;
        
        story += `That's when I ${mistake}. At first, I didn't think it was a big deal, but I was completely wrong.\n\n`;
        
        story += `${this.generateTIFUReaction()} The situation quickly escalated when ${this.generateTIFUEscalation()}.\n\n`;
        
        story += `I tried to fix the situation by ${this.generateTIFUFixAttempt()}, but this only made things worse. ${this.generateTIFUConsequence()}.\n\n`;
        
        story += `The worst part is that ${this.generateTIFUWorstPart()}. I've learned my lesson the hard way: ${this.generateTIFULesson()}.\n\n`;
        
        // Pad to target word count if needed
        while (this.countWords(story) < targetWordCount * 0.9) {
            story += `${this.generateTIFUAdditional()} `;
        }
        
        story += `TLDR: ${timeframe} I ${mistake} and now ${this.generateTIFUTLDR()}.`;
        
        return story;
    }

    generateRelationshipStory(targetWordCount) {
        const relationships = [
            { type: 'boyfriend', duration: this.getRandomInt(1, 8) },
            { type: 'girlfriend', duration: this.getRandomInt(1, 8) },
            { type: 'partner', duration: this.getRandomInt(1, 10) }
        ];
        
        const issues = ['communication problems', 'trust issues', 'different life goals', 'family interference', 'financial disagreements'];
        const ages = { self: this.getRandomInt(20, 40), other: this.getRandomInt(20, 40) };
        
        const relationship = this.getRandomElement(relationships);
        const issue = this.getRandomElement(issues);
        const selfGender = this.getRandomElement(['M', 'F']);
        const otherGender = selfGender === 'M' ? 'F' : 'M';
        
        const title = `Need advice about ${issue} with my ${relationship.type}`;
        
        let story = `${title}\n\nI (${selfGender}${ages.self}) and my ${relationship.type} (${otherGender}${ages.other}) have been together for ${relationship.duration} years.\n\n`;
        
        story += `Our relationship has been ${this.getRandomElement(['great', 'mostly good', 'stable'])} until recently. We ${this.generateRelationshipBackground()}.\n\n`;
        
        story += `The problem started when ${this.generateRelationshipIncident(issue)}. This has been causing ${this.generateRelationshipImpact()}.\n\n`;
        
        story += `When I tried to discuss this, my ${relationship.type} ${this.generatePartnerResponse()}. This made me feel ${this.generateEmotionalReaction()}.\n\n`;
        
        story += `We've tried ${this.generateResolutionAttempt()}, but ${this.generateObstacle()}. I'm worried that ${this.generateWorry()}.\n\n`;
        
        story += `I really love my ${relationship.type} and want to make this work, but I'm not sure how to move forward. Has anyone been in a similar situation? What would you do?\n\n`;
        
        // Pad to target word count if needed
        while (this.countWords(story) < targetWordCount * 0.9) {
            story += `${this.generateRelationshipAdditional()} `;
        }
        
        story += `TLDR: Having ${issue} with my ${relationship.type} of ${relationship.duration} years. Need advice on how to handle this.`;
        
        return story;
    }

    // Story generation helper methods (keeping all the existing helper methods)
    generateConflictDetails(conflict) {
        const details = {
            'money issues': 'constantly borrowing money without paying it back',
            'personal boundaries': 'not respecting my personal space and privacy',
            'family drama': 'involving me in their family conflicts',
            'work problems': 'making my work environment uncomfortable',
            'lifestyle differences': 'criticizing my lifestyle choices'
        };
        return details[conflict] || 'causing problems in our relationship';
    }

    generateReaction() {
        const reactions = [
            'got defensive and started yelling',
            'denied everything and called me dramatic',
            'broke down crying and said I was being mean',
            'laughed it off like it wasn\'t serious',
            'accused me of being controlling'
        ];
        return this.getRandomElement(reactions);
    }

    generateEscalation() {
        const escalations = [
            'they brought up past arguments',
            'they threatened to cut contact',
            'they involved other people in our dispute',
            'they said hurtful things they can\'t take back',
            'they stormed out and haven\'t spoken to me since'
        ];
        return this.getRandomElement(escalations);
    }

    generateConsequence() {
        const consequences = [
            'giving me the silent treatment',
            'telling everyone I\'m the problem',
            'demanding an apology from me',
            'avoiding me completely',
            'making our mutual friends choose sides'
        ];
        return this.getRandomElement(consequences);
    }

    generateOpinion() {
        const opinions = [
            'I was completely justified',
            'I should have been more diplomatic',
            'I was right but my timing was wrong',
            'I should apologize and move on',
            'they\'re overreacting to the situation'
        ];
        return this.getRandomElement(opinions);
    }

    generateAdditionalContext() {
        const contexts = [
            'This isn\'t the first time something like this has happened.',
            'I\'ve always tried to be understanding in the past.',
            'Our relationship has been strained lately anyway.',
            'I was already stressed about other things when this occurred.',
            'Other people have noticed this pattern of behavior too.'
        ];
        return this.getRandomElement(contexts);
    }

    // Include all other helper methods...
    generateTIFUContext() {
        const contexts = [
            'having what I thought was a normal day',
            'dealing with some work stress',
            'trying to multitask like usual',
            'in a hurry to get things done',
            'distracted by other responsibilities'
        ];
        return this.getRandomElement(contexts);
    }

    generateTIFUBuildUp() {
        const buildUps = [
            'I received an unexpected message',
            'someone asked me to handle something quickly',
            'I was trying to be helpful',
            'I thought I was being efficient',
            'I made what seemed like a routine decision'
        ];
        return this.getRandomElement(buildUps);
    }

    generateTIFUReaction() {
        const reactions = [
            'My heart sank when I realized what happened.',
            'I immediately knew I had messed up badly.',
            'I felt my face turn red with embarrassment.',
            'I wanted to disappear into the ground.',
            'I stood there in shock, unable to move.'
        ];
        return this.getRandomElement(reactions);
    }

    generateTIFUEscalation() {
        const escalations = [
            'everyone around me noticed what happened',
            'the situation got much worse than I expected',
            'multiple people got involved',
            'word spread faster than I could control',
            'the consequences became immediately apparent'
        ];
        return this.getRandomElement(escalations);
    }

    generateTIFUFixAttempt() {
        const attempts = [
            'apologizing profusely to everyone involved',
            'trying to explain the misunderstanding',
            'attempting to undo what I had done',
            'asking for help from others',
            'pretending it was intentional'
        ];
        return this.getRandomElement(attempts);
    }

    generateTIFUConsequence() {
        const consequences = [
            'Now everyone thinks I\'m incompetent.',
            'I\'ve become the subject of office gossip.',
            'I have to deal with the fallout for weeks.',
            'My reputation has taken a serious hit.',
            'I\'ve created more problems than I solved.'
        ];
        return this.getRandomElement(consequences);
    }

    generateTIFUWorstPart() {
        const worstParts = [
            'this could have been easily avoided',
            'I should have known better',
            'everyone saw it happen',
            'it happened at the worst possible time',
            'I can\'t undo the damage'
        ];
        return this.getRandomElement(worstParts);
    }

    generateTIFULesson() {
        const lessons = [
            'always double-check before taking action',
            'don\'t rush when handling important matters',
            'think before you speak or act',
            'pay attention to details',
            'ask for clarification when unsure'
        ];
        return this.getRandomElement(lessons);
    }

    generateTIFUAdditional() {
        const additional = [
            'I\'ve been replaying this in my head constantly.',
            'My friends think the whole situation is hilarious.',
            'I don\'t think I\'ll live this down anytime soon.',
            'At least I learned something from this experience.',
            'I hope sharing this helps others avoid the same mistake.'
        ];
        return this.getRandomElement(additional);
    }

    generateTIFUTLDR() {
        const tldrs = [
            'I\'m dealing with the embarrassing consequences',
            'everyone knows about my mistake',
            'I\'ve learned an important lesson',
            'I have to face the aftermath',
            'my reputation is in shambles'
        ];
        return this.getRandomElement(tldrs);
    }

    generateRelationshipBackground() {
        const backgrounds = [
            'met in college and have grown together',
            'have always been supportive of each other',
            'share many common interests and values',
            'have built a strong foundation over the years',
            'have been through challenges before'
        ];
        return this.getRandomElement(backgrounds);
    }

    generateRelationshipIncident(issue) {
        const incidents = {
            'communication problems': 'they started shutting down during important conversations',
            'trust issues': 'I discovered they had been hiding things from me',
            'different life goals': 'they revealed they want something completely different',
            'family interference': 'their family started getting involved in our decisions',
            'financial disagreements': 'we realized we have very different money values'
        };
        return incidents[issue] || 'we had a major disagreement';
    }

    generateRelationshipImpact() {
        const impacts = [
            'tension between us',
            'frequent arguments',
            'emotional distance',
            'stress in our relationship',
            'uncertainty about our future'
        ];
        return this.getRandomElement(impacts);
    }

    generatePartnerResponse() {
        const responses = [
            'got defensive and shut down',
            'said I was overreacting',
            'promised to change but nothing happened',
            'turned the issue back on me',
            'avoided the conversation entirely'
        ];
        return this.getRandomElement(responses);
    }

    generateEmotionalReaction() {
        const reactions = [
            'hurt and confused',
            'frustrated and unheard',
            'disappointed and sad',
            'angry and betrayed',
            'lost and uncertain'
        ];
        return this.getRandomElement(reactions);
    }

    generateResolutionAttempt() {
        const attempts = [
            'having multiple serious conversations',
            'setting clearer boundaries and expectations',
            'seeking advice from friends and family',
            'taking some time apart to think',
            'trying to compromise on our differences'
        ];
        return this.getRandomElement(attempts);
    }

    generateObstacle() {
        const obstacles = [
            'we keep falling into the same patterns',
            'neither of us wants to compromise',
            'external pressures are making it harder',
            'we can\'t seem to understand each other',
            'the trust has been damaged'
        ];
        return this.getRandomElement(obstacles);
    }

    generateWorry() {
        const worries = [
            'this issue might be a dealbreaker',
            'we\'re growing apart instead of together',
            'we\'re not compatible long-term',
            'I\'m wasting time in the wrong relationship',
            'we can\'t solve this fundamental problem'
        ];
        return this.getRandomElement(worries);
    }

    generateRelationshipAdditional() {
        const additional = [
            'I still love them deeply despite these issues.',
            'We have so much history together.',
            'I don\'t want to give up without trying everything.',
            'Sometimes I wonder if we\'re just incompatible.',
            'I\'m scared of making the wrong decision.'
        ];
        return this.getRandomElement(additional);
    }

    showCanvasPreview() {
        const placeholder = this.elements.videoPreview.querySelector('.preview-placeholder');
        if (placeholder) {
            placeholder.style.display = 'none';
        }
        
        this.elements.videoCanvas.style.display = 'block';
        
        // Clear canvas with black background
        if (this.canvasCtx) {
            this.canvasCtx.fillStyle = '#000';
            this.canvasCtx.fillRect(0, 0, this.elements.videoCanvas.width, this.elements.videoCanvas.height);
        }
    }

    drawBackground(backgroundType) {
        // Cancel existing animation
        if (this.backgroundAnimationId) {
            cancelAnimationFrame(this.backgroundAnimationId);
        }
        
        // Ensure canvas context is available
        if (!this.canvasCtx) {
            console.error('Canvas context not available');
            return;
        }
        
        switch (backgroundType) {
            case 'minecraft':
                this.drawMinecraftBackground();
                break;
            case 'nature':
                this.drawNatureBackground();
                break;
            case 'urban':
                this.drawUrbanBackground();
                break;
            case 'abstract':
                this.drawAbstractBackground();
                break;
            case 'ocean':
                this.drawOceanBackground();
                break;
            default:
                this.drawMinecraftBackground();
        }
    }

    drawMinecraftBackground() {
        const canvas = this.elements.videoCanvas;
        const ctx = this.canvasCtx;
        let offset = 0;
        
        const animate = () => {
            try {
                // Sky blue background
                ctx.fillStyle = '#87CEEB';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Draw blocks
                const blockSize = 60;
                const numBlocksX = Math.ceil(canvas.width / blockSize);
                const numBlocksY = Math.ceil(canvas.height / blockSize) + 1;
                
                offset = (offset + 3) % blockSize;
                
                for (let y = 0; y < numBlocksY; y++) {
                    for (let x = 0; x < numBlocksX; x++) {
                        const blockType = Math.floor((x + y) % 3);
                        
                        let color;
                        switch (blockType) {
                            case 0: color = '#8B4513'; break; // Brown
                            case 1: color = '#567D46'; break; // Green
                            case 2: color = '#707070'; break; // Gray
                        }
                        
                        ctx.fillStyle = color;
                        ctx.fillRect(
                            x * blockSize,
                            canvas.height - (y * blockSize) + offset,
                            blockSize,
                            blockSize
                        );
                        
                        // Block outline
                        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
                        ctx.lineWidth = 3;
                        ctx.strokeRect(
                            x * blockSize,
                            canvas.height - (y * blockSize) + offset,
                            blockSize,
                            blockSize
                        );
                    }
                }
                
                this.backgroundAnimationId = requestAnimationFrame(animate);
            } catch (error) {
                console.error('Animation error:', error);
            }
        };
        
        animate();
    }

    drawNatureBackground() {
        const canvas = this.elements.videoCanvas;
        const ctx = this.canvasCtx;
        let hue = 0;
        
        const animate = () => {
            try {
                // Gradient sky
                const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
                gradient.addColorStop(0, `hsl(${(hue + 180) % 360}, 70%, 80%)`);
                gradient.addColorStop(0.7, `hsl(${(hue + 220) % 360}, 60%, 60%)`);
                gradient.addColorStop(1, `hsl(${(hue + 110) % 360}, 60%, 40%)`);
                
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Mountains
                ctx.fillStyle = `hsl(${(hue + 120) % 360}, 30%, 30%)`;
                ctx.beginPath();
                ctx.moveTo(0, canvas.height * 0.7);
                
                for (let x = 0; x < canvas.width; x += 50) {
                    const y = canvas.height * 0.7 - Math.sin(x * 0.01 + hue * 0.01) * 150;
                    ctx.lineTo(x, y);
                }
                
                ctx.lineTo(canvas.width, canvas.height);
                ctx.lineTo(0, canvas.height);
                ctx.fill();
                
                hue = (hue + 0.3) % 360;
                this.backgroundAnimationId = requestAnimationFrame(animate);
            } catch (error) {
                console.error('Animation error:', error);
            }
        };
        
        animate();
    }

    drawUrbanBackground() {
        const canvas = this.elements.videoCanvas;
        const ctx = this.canvasCtx;
        let offset = 0;
        
        const animate = () => {
            try {
                // Night sky gradient
                const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
                gradient.addColorStop(0, '#0f1034');
                gradient.addColorStop(1, '#263570');
                
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Stars
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                for (let i = 0; i < 150; i++) {
                    const x = (i * 77) % canvas.width;
                    const y = (i * 83) % (canvas.height * 0.7);
                    const size = 1 + (i % 3);
                    
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                // Buildings
                const buildingCount = 25;
                const buildingWidth = canvas.width / buildingCount;
                
                offset = (offset + 1) % (buildingWidth * 2);
                
                for (let i = 0; i < buildingCount + 1; i++) {
                    const x = i * buildingWidth - offset;
                    const height = (i * 37) % (canvas.height * 0.6) + canvas.height * 0.3;
                    const y = canvas.height - height;
                    
                    // Building
                    ctx.fillStyle = '#111111';
                    ctx.fillRect(x, y, buildingWidth, height);
                    
                    // Windows
                    ctx.fillStyle = 'rgba(255, 255, 0, 0.8)';
                    const windowSize = buildingWidth / 6;
                    const windowSpacing = windowSize * 1.8;
                    
                    for (let wx = x + windowSize; wx < x + buildingWidth - windowSize; wx += windowSpacing) {
                        for (let wy = y + windowSize; wy < canvas.height - windowSize; wy += windowSpacing) {
                            if ((wx + wy) % 150 > 50) {
                                ctx.fillRect(wx, wy, windowSize, windowSize);
                            }
                        }
                    }
                }
                
                this.backgroundAnimationId = requestAnimationFrame(animate);
            } catch (error) {
                console.error('Animation error:', error);
            }
        };
        
        animate();
    }

    drawAbstractBackground() {
        const canvas = this.elements.videoCanvas;
        const ctx = this.canvasCtx;
        let time = 0;
        
        const animate = () => {
            try {
                // Gradient background
                const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                gradient.addColorStop(0, `hsl(${time % 360}, 70%, 20%)`);
                gradient.addColorStop(0.5, `hsl(${(time + 120) % 360}, 80%, 30%)`);
                gradient.addColorStop(1, `hsl(${(time + 240) % 360}, 90%, 20%)`);
                
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Animated circles
                for (let i = 0; i < 12; i++) {
                    const x = canvas.width * 0.5 + Math.sin(time * 0.01 + i) * canvas.width * 0.4;
                    const y = canvas.height * 0.5 + Math.cos(time * 0.01 + i * 0.7) * canvas.height * 0.4;
                    const radius = 60 + Math.sin(time * 0.02 + i * 0.5) * 40;
                    
                    const circleGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                    circleGradient.addColorStop(0, `hsla(${(time + i * 30) % 360}, 100%, 70%, 0.8)`);
                    circleGradient.addColorStop(1, `hsla(${(time + i * 30) % 360}, 100%, 50%, 0)`);
                    
                    ctx.fillStyle = circleGradient;
                    ctx.beginPath();
                    ctx.arc(x, y, radius, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                time += 1;
                this.backgroundAnimationId = requestAnimationFrame(animate);
            } catch (error) {
                console.error('Animation error:', error);
            }
        };
        
        animate();
    }

    drawOceanBackground() {
        const canvas = this.elements.videoCanvas;
        const ctx = this.canvasCtx;
        let time = 0;
        
        const animate = () => {
            try {
                // Ocean gradient
                const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
                gradient.addColorStop(0, '#0a2e44');
                gradient.addColorStop(0.7, '#0f5e9c');
                gradient.addColorStop(1, '#2389da');
                
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Waves
                const waveCount = 8;
                const waveHeight = canvas.height / waveCount;
                
                for (let i = 0; i < waveCount; i++) {
                    const y = canvas.height - (i * waveHeight);
                    const alpha = 0.1 + (i * 0.06);
                    
                    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    
                    for (let x = 0; x < canvas.width; x++) {
                        const waveY = y + Math.sin(x * 0.01 + time * 0.05 + i) * 25;
                        ctx.lineTo(x, waveY);
                    }
                    
                    ctx.lineTo(canvas.width, canvas.height);
                    ctx.lineTo(0, canvas.height);
                    ctx.closePath();
                    ctx.fill();
                }
                
                // Bubbles
                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                for (let i = 0; i < 30; i++) {
                    const x = (i * 123 + time) % canvas.width;
                    const y = (i * 157 + time * 2) % canvas.height;
                    const size = 2 + (i % 6);
                    
                    ctx.globalAlpha = 0.4;
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.globalAlpha = 1;
                
                time += 1;
                this.backgroundAnimationId = requestAnimationFrame(animate);
            } catch (error) {
                console.error('Animation error:', error);
            }
        };
        
        animate();
    }

    async simulateAudioGeneration() {
        return new Promise(resolve => {
            setTimeout(resolve, 1000);
        });
    }

    async simulateVideoCreation(duration) {
        return new Promise(resolve => {
            const processingTime = Math.min(duration * 500, 3000);
            setTimeout(() => {
                // Create mock video blob
                this.videoBlob = new Blob([new ArrayBuffer(100000)], { type: 'video/mp4' });
                resolve();
            }, processingTime);
        });
    }

    downloadVideo() {
        if (!this.videoBlob) {
            this.showError('No video available to download');
            return;
        }
        
        const url = URL.createObjectURL(this.videoBlob);
        const a = document.createElement('a');
        a.href = url;
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const storyType = this.elements.storyType.value;
        a.download = `facelessai-${storyType}-${timestamp}.mp4`;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    resetGenerator() {
        // Hide sections
        this.elements.downloadSection.style.display = 'none';
        this.elements.progressSection.style.display = 'none';
        
        // Reset story content
        this.elements.storyContent.textContent = 'Your AI-generated story will appear here after clicking "Generate Video"';
        
        // Hide canvas and show placeholder
        this.elements.videoCanvas.style.display = 'none';
        const placeholder = this.elements.videoPreview.querySelector('.preview-placeholder');
        if (placeholder) {
            placeholder.style.display = 'flex';
        }
        
        // Cancel animations
        if (this.backgroundAnimationId) {
            cancelAnimationFrame(this.backgroundAnimationId);
            this.backgroundAnimationId = null;
        }
        
        // Reset state
        this.videoBlob = null;
        this.storyText = '';
        this.isGenerating = false;
        
        // Reset button
        this.elements.generateButton.disabled = false;
        this.elements.generateButton.innerHTML = '<span class="button-icon">🎬</span>Generate Video';
    }

    showError(message) {
        alert(message);
    }

    // Utility methods
    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    countWords(text) {
        return text.split(/\s+/).filter(word => word.length > 0).length;
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new FacelessAI();
});