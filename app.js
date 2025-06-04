/**
 * FacelessAI - TikTok Faceless Video Generator
 * Create viral TikTok videos with AI-generated Reddit stories
 */

class FacelessAI {
    constructor() {
        // Initialize core properties
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
            // Immediately hide loading overlay to prevent infinite loading
            this.forceHideLoading();
            
            // Wait for DOM content to be fully loaded
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
            
            console.log('FacelessAI application initialized successfully');
        } catch (error) {
            console.error('Initialization error:', error);
            this.showError('Application failed to initialize properly. Please refresh the page.');
        }
    }

    forceHideLoading() {
        try {
            // Multiple approaches to ensure loading overlay is hidden
            const loadingOverlay = document.getElementById('loadingOverlay');
            if (loadingOverlay) {
                // Apply multiple hiding classes
                loadingOverlay.classList.add('app-hidden');
                loadingOverlay.style.display = 'none';
                loadingOverlay.style.visibility = 'hidden';
                loadingOverlay.style.opacity = '0';
                
                // Remove from DOM as final fallback after a short delay
                setTimeout(() => {
                    if (loadingOverlay.parentNode) {
                        try {
                            loadingOverlay.parentNode.removeChild(loadingOverlay);
                        } catch (e) {
                            console.log('Could not remove loading overlay from DOM');
                        }
                    }
                }, 100);
            }
        } catch (error) {
            console.error('Error hiding loading overlay:', error);
        }
    }

    bindElements() {
        try {
            // Core UI elements
            this.elements = {
                loadingOverlay: document.getElementById('loadingOverlay'),
                storyType: document.getElementById('storyType'),
                voiceSelect: document.getElementById('voiceSelect'),
                backgroundType: document.getElementById('backgroundType'),
                durationSlider: document.getElementById('durationSlider'),
                durationDisplay: document.getElementById('durationDisplay'),
                generateButton: document.getElementById('generateButton'),
                videoPreview: document.getElementById('videoPreview'),
                videoCanvas: document.getElementById('videoCanvas'),
                storyPreview: document.getElementById('storyPreview'),
                storyContent: document.querySelector('.story-content'),
                progressSection: document.getElementById('progressSection'),
                progressFill: document.getElementById('progressFill'),
                progressText: document.getElementById('progressText'),
                downloadSection: document.getElementById('downloadSection'),
                downloadButton: document.getElementById('downloadButton'),
                createAnother: document.getElementById('createAnother')
            };
            
            // Validate essential elements
            if (!this.elements.storyType || !this.elements.voiceSelect || !this.elements.generateButton) {
                throw new Error('Required UI elements are missing');
            }
        } catch (error) {
            console.error('Error binding elements:', error);
            throw error;
        }
    }

    setupEventListeners() {
        try {
            // Duration slider
            if (this.elements.durationSlider) {
                this.elements.durationSlider.addEventListener('input', () => {
                    const duration = this.elements.durationSlider.value;
                    this.elements.durationDisplay.textContent = `${duration} minutes`;
                });
            }
            
            // Generate button
            if (this.elements.generateButton) {
                this.elements.generateButton.addEventListener('click', () => {
                    this.generateVideo();
                });
            }
            
            // Download button
            if (this.elements.downloadButton) {
                this.elements.downloadButton.addEventListener('click', () => {
                    this.downloadVideo();
                });
            }
            
            // Create another button
            if (this.elements.createAnother) {
                this.elements.createAnother.addEventListener('click', () => {
                    this.resetGenerator();
                });
            }
        } catch (error) {
            console.error('Error setting up event listeners:', error);
        }
    }

    async loadVoices() {
        try {
            // Get all available voices from speech synthesis
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
                    
                    // Fallback in case event never fires
                    setTimeout(() => {
                        voices = synth.getVoices();
                        if (voices.length) {
                            resolve(voices);
                        } else {
                            resolve([]);
                        }
                    }, 1000);
                }
            });
            
            this.populateVoiceOptions();
        } catch (error) {
            console.error('Error loading voices:', error);
            this.showError('Could not load voice options. Speech synthesis may not be supported in your browser.');
        }
    }

    populateVoiceOptions() {
        try {
            if (!this.elements.voiceSelect) return;
            
            // Clear existing options
            this.elements.voiceSelect.innerHTML = '';
            
            // Create default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = '-- Select a voice --';
            this.elements.voiceSelect.appendChild(defaultOption);
            
            // Filter for English voices only for better compatibility
            const englishVoices = this.voices.filter(voice => voice.lang.includes('en'));
            
            // Group voices by gender
            const maleVoices = englishVoices.filter(voice => voice.name.includes('Male') || voice.name.includes('male'));
            const femaleVoices = englishVoices.filter(voice => voice.name.includes('Female') || voice.name.includes('female'));
            const otherVoices = englishVoices.filter(voice => 
                !voice.name.includes('Male') && !voice.name.includes('male') && 
                !voice.name.includes('Female') && !voice.name.includes('female'));
            
            // Add male voices group
            if (maleVoices.length > 0) {
                const maleGroup = document.createElement('optgroup');
                maleGroup.label = 'Male Voices';
                
                maleVoices.forEach(voice => {
                    const option = document.createElement('option');
                    option.value = voice.name;
                    option.textContent = voice.name;
                    maleGroup.appendChild(option);
                });
                
                this.elements.voiceSelect.appendChild(maleGroup);
            }
            
            // Add female voices group
            if (femaleVoices.length > 0) {
                const femaleGroup = document.createElement('optgroup');
                femaleGroup.label = 'Female Voices';
                
                femaleVoices.forEach(voice => {
                    const option = document.createElement('option');
                    option.value = voice.name;
                    option.textContent = voice.name;
                    femaleGroup.appendChild(option);
                });
                
                this.elements.voiceSelect.appendChild(femaleGroup);
            }
            
            // Add other voices
            if (otherVoices.length > 0) {
                const otherGroup = document.createElement('optgroup');
                otherGroup.label = 'Other Voices';
                
                otherVoices.forEach(voice => {
                    const option = document.createElement('option');
                    option.value = voice.name;
                    option.textContent = voice.name;
                    otherGroup.appendChild(option);
                });
                
                this.elements.voiceSelect.appendChild(otherGroup);
            }
            
            // If no English voices found, add all available voices
            if (englishVoices.length === 0) {
                this.voices.forEach(voice => {
                    const option = document.createElement('option');
                    option.value = voice.name;
                    option.textContent = `${voice.name} (${voice.lang})`;
                    this.elements.voiceSelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error populating voice options:', error);
        }
    }

    setupCanvas() {
        try {
            if (!this.elements.videoCanvas) return;
            
            this.canvasCtx = this.elements.videoCanvas.getContext('2d');
            
            // Set canvas to proper TikTok dimensions (9:16 ratio)
            this.elements.videoCanvas.width = 1080;
            this.elements.videoCanvas.height = 1920;
        } catch (error) {
            console.error('Error setting up canvas:', error);
        }
    }

    validateInputs() {
        // Check if all required inputs are provided
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
        try {
            // Prevent multiple generation attempts
            if (this.isGenerating) return;
            this.isGenerating = true;
            
            // Validate inputs
            if (!this.validateInputs()) {
                this.isGenerating = false;
                return;
            }
            
            // Show progress section and hide download section
            this.elements.progressSection.style.display = 'block';
            this.elements.downloadSection.style.display = 'none';
            this.elements.progressFill.style.width = '0%';
            this.elements.progressText.textContent = 'Generating story...';
            
            // Get input values
            const storyType = this.elements.storyType.value;
            const voiceName = this.elements.voiceSelect.value;
            const backgroundType = this.elements.backgroundType.value;
            const duration = parseInt(this.elements.durationSlider.value);
            
            // Update progress
            this.updateProgress(10, 'Generating AI story...');
            
            // Generate story based on type and duration
            this.storyText = await this.generateStory(storyType, duration);
            
            // Display generated story in preview
            this.elements.storyContent.textContent = this.storyText;
            
            // Update progress
            this.updateProgress(30, 'Preparing video canvas...');
            
            // Prepare canvas
            this.showCanvasPreview();
            this.drawBackground(backgroundType);
            
            // Update progress
            this.updateProgress(50, 'Generating audio narration...');
            
            // Generate audio narration
            const audioBlob = await this.generateAudio(this.storyText, voiceName);
            
            // Update progress
            this.updateProgress(70, 'Creating MP4 video...');
            
            // Generate video with FFmpeg
            this.videoBlob = await this.createVideoWithFFmpeg(audioBlob, duration);
            
            // Update progress
            this.updateProgress(100, 'Video ready!');
            
            // Show download section
            setTimeout(() => {
                this.elements.progressSection.style.display = 'none';
                this.elements.downloadSection.style.display = 'block';
            }, 500);
            
            this.isGenerating = false;
        } catch (error) {
            console.error('Error generating video:', error);
            this.showError('Error generating video: ' + error.message);
            this.elements.progressSection.style.display = 'none';
            this.isGenerating = false;
        }
    }

    updateProgress(percent, text) {
        if (this.elements.progressFill) {
            this.elements.progressFill.style.width = `${percent}%`;
        }
        
        if (this.elements.progressText) {
            this.elements.progressText.textContent = text;
        }
    }

    async generateStory(storyType, duration) {
        try {
            // Calculate target word count based on duration (140 words per minute speaking rate)
            const targetWordCount = duration * 140;
            
            // Generate story text based on type
            let story = '';
            
            switch (storyType) {
                case 'aita':
                    story = this.generateAITAStory(targetWordCount);
                    break;
                case 'tifu':
                    story = this.generateTIFUStory(targetWordCount);
                    break;
                case 'relationship':
                    story = this.generateRelationshipStory(targetWordCount);
                    break;
                default:
                    story = this.generateAITAStory(targetWordCount);
            }
            
            return story;
        } catch (error) {
            console.error('Error generating story:', error);
            throw new Error('Failed to generate story. Please try again.');
        }
    }

    generateAITAStory(targetWordCount) {
        // Generate a random AITA story
        const characters = [
            { name: 'Alex', gender: 'male', age: this.getRandomInt(20, 45) },
            { name: 'Jessica', gender: 'female', age: this.getRandomInt(20, 45) },
            { name: 'Michael', gender: 'male', age: this.getRandomInt(20, 45) },
            { name: 'Sarah', gender: 'female', age: this.getRandomInt(20, 45) },
            { name: 'Chris', gender: 'male', age: this.getRandomInt(20, 45) },
            { name: 'Olivia', gender: 'female', age: this.getRandomInt(20, 45) }
        ];
        
        const relationships = [
            'spouse', 'friend', 'sibling', 'roommate', 'coworker', 'neighbor', 
            'cousin', 'in-law', 'boss', 'ex', 'partner', 'classmate'
        ];
        
        const locations = [
            'at home', 'at work', 'at a party', 'at a restaurant', 'during vacation',
            'at a family gathering', 'at the mall', 'on social media', 'at school',
            'at the gym', 'at the park', 'in the neighborhood'
        ];
        
        const actions = [
            'refused to do', 'said no to', 'called out', 'confronted about',
            'set boundaries about', 'argued about', 'disagreed about',
            'stood up against', 'criticized', 'expressed concern over'
        ];
        
        const issues = [
            'borrowing money', 'helping with a task', 'sharing responsibilities',
            'personal space', 'pet peeves', 'financial decisions', 'lifestyle choices',
            'political views', 'family traditions', 'personal habits', 'communication styles',
            'social media behavior', 'ethical disagreements', 'privacy concerns'
        ];
        
        const consequences = [
            'now they\'re upset with me', 'they called me selfish', 'they think I\'m being unreasonable',
            'they\'re giving me the silent treatment', 'they\'re demanding an apology',
            'mutual friends are taking their side', 'they told everyone I was being difficult',
            'they\'re threatening to cut contact', 'they made a scene', 'they\'re involving others in our dispute'
        ];
        
        // Select random elements
        const mainCharacter = this.getRandomElement(characters);
        const otherCharacter = this.getRandomElement(characters.filter(c => c !== mainCharacter));
        const relationship = this.getRandomElement(relationships);
        const location = this.getRandomElement(locations);
        const action = this.getRandomElement(actions);
        const issue = this.getRandomElement(issues);
        const consequence = this.getRandomElement(consequences);
        
        // Create title
        const title = `AITA for ${action} my ${relationship}'s ${issue}?`;
        
        // Create story beginning
        let story = `${title}\n\nI (${mainCharacter.gender === 'male' ? 'M' : 'F'}${mainCharacter.age}) have been dealing with a situation involving my ${relationship}, ${otherCharacter.name} (${otherCharacter.gender === 'male' ? 'M' : 'F'}${otherCharacter.age}).\n\n`;
        
        // Add background
        story += `We've known each other for ${this.getRandomInt(1, 20)} years, and generally get along well. However, recently ${location}, we had a disagreement about ${issue}.\n\n`;
        
        // Add main incident
        story += `Here's what happened: ${otherCharacter.name} was ${this.generateRandomIncident(mainCharacter, otherCharacter, issue)}. I felt uncomfortable with this and decided to ${action} this behavior.\n\n`;
        
        // Add confrontation
        story += `When I ${action} this, ${otherCharacter.name} didn't take it well. ${this.generateRandomConflict(mainCharacter, otherCharacter)}. ${consequence}.\n\n`;
        
        // Add reasoning
        story += `From my perspective, I was just ${this.generateRandomJustification()}. But now I'm wondering if I took things too far.\n\n`;
        
        // Add family/friend reactions if needed to reach target word count
        if (this.countWords(story) < targetWordCount * 0.7) {
            story += `My family thinks ${this.generateRandomOpinion()}, while my friends are saying ${this.generateRandomOpinion()}.\n\n`;
        }
        
        // Add questions and TLDR to reach target word count
        if (this.countWords(story) < targetWordCount * 0.9) {
            story += `I've been thinking about this for days and can't decide if I was in the wrong. Was I being too harsh? Should I have approached this differently? Am I missing something here?\n\n`;
        }
        
        // Add TLDR
        story += `TLDR: I ${action} my ${relationship}'s ${issue} and ${consequence}. AITA?`;
        
        return story;
    }

    generateTIFUStory(targetWordCount) {
        // Generate a random TIFU story
        const timeframes = [
            'today', 'yesterday', 'last week', 'last month',
            'this morning', 'last night', 'a few days ago'
        ];
        
        const settings = [
            'at work', 'at home', 'at my friend\'s place', 'at a restaurant',
            'on public transport', 'at the gym', 'at a family gathering',
            'at the mall', 'on vacation', 'at school', 'at a party'
        ];
        
        const mistakes = [
            'accidentally sent a private message to the wrong person',
            'completely misunderstood an important situation',
            'didn\'t double-check important information',
            'forgot about a critical appointment',
            'misinterpreted someone\'s intentions',
            'made an embarrassing assumption',
            'clicked on a suspicious link',
            'let my curiosity get the better of me',
            'trusted the wrong person with sensitive information',
            'ignored obvious warning signs',
            'spoke without thinking',
            'tried to multitask at the worst possible moment'
        ];
        
        const consequences = [
            'and now I might lose my job',
            'and ruined a relationship',
            'and everyone thinks I\'m a complete idiot',
            'and can never show my face there again',
            'and had to explain the entire situation to my parents',
            'and embarrassed myself in front of everyone',
            'and now I\'m in serious trouble',
            'and lost a lot of money',
            'and damaged something expensive',
            'and now I\'m dealing with the aftermath',
            'and can\'t undo the damage I\'ve caused',
            'and had to spend hours fixing the mistake'
        ];
        
        // Select random elements
        const timeframe = this.getRandomElement(timeframes);
        const setting = this.getRandomElement(settings);
        const mistake = this.getRandomElement(mistakes);
        const consequence = this.getRandomElement(consequences);
        
        // Create title
        const title = `TIFU by ${mistake} ${consequence}`;
        
        // Create story beginning
        let story = `${title}\n\nThis actually happened ${timeframe}, but I'm still dealing with the fallout.\n\n`;
        
        // Add background
        story += `For some context, I was ${setting} ${this.generateRandomContext()}.\n\n`;
        
        // Add the build-up
        story += `Everything was going normally until ${this.generateRandomBuildUp()}. I had no idea what was about to happen.\n\n`;
        
        // Add the main mistake
        story += `That's when I ${mistake}. It seemed harmless at the time, but boy was I wrong.\n\n`;
        
        // Add immediate reaction
        story += `Immediately, I realized what I had done. ${this.generateRandomReaction()}. My heart sank as I understood the implications.\n\n`;
        
        // Add consequences
        story += `The consequences were swift and brutal. ${this.generateRandomConsequenceDetail()} ${consequence}.\n\n`;
        
        // Add attempts to fix if needed to reach target word count
        if (this.countWords(story) < targetWordCount * 0.7) {
            story += `I tried to fix the situation by ${this.generateRandomFixAttempt()}, but it only made things ${this.getRandomElement(['worse', 'more complicated', 'more embarrassing'])}. ${this.generateRandomAdditionalConsequence()}.\n\n`;
        }
        
        // Add lessons learned if needed to reach target word count
        if (this.countWords(story) < targetWordCount * 0.9) {
            story += `Lesson learned: ${this.generateRandomLesson()}. I'll definitely be more careful in the future.\n\n`;
            story += `Has anyone else made a similar mistake? I could really use some advice or just commiseration right now.\n\n`;
        }
        
        // Add TLDR
        story += `TLDR: ${timeframe} ${setting}, I ${mistake} ${consequence}.`;
        
        return story;
    }

    generateRelationshipStory(targetWordCount) {
        // Generate a random relationship advice story
        const relationships = [
            { type: 'boyfriend', duration: this.getRandomInt(1, 8) },
            { type: 'girlfriend', duration: this.getRandomInt(1, 8) },
            { type: 'husband', duration: this.getRandomInt(2, 15) },
            { type: 'wife', duration: this.getRandomInt(2, 15) },
            { type: 'partner', duration: this.getRandomInt(1, 10) },
            { type: 'fiancé', duration: this.getRandomInt(1, 5) },
            { type: 'fiancée', duration: this.getRandomInt(1, 5) }
        ];
        
        const ages = {
            self: this.getRandomInt(20, 45),
            other: this.getRandomInt(20, 45)
        };
        
        const issues = [
            'communication problems',
            'trust issues',
            'different life goals',
            'jealousy',
            'family interference',
            'financial disagreements',
            'emotional distance',
            'different expectations',
            'lack of support',
            'incompatible lifestyles',
            'different priorities',
            'personal space concerns'
        ];
        
        const incidents = [
            'found suspicious messages',
            'had a major argument',
            'discovered a secret',
            'overheard a concerning conversation',
            'noticed a change in behavior',
            'faced an ultimatum',
            'received unexpected news',
            'witnessed something concerning',
            'experienced repeated problems',
            'confronted about an issue',
            'felt deeply hurt by actions'
        ];
        
        // Select random elements
        const relationship = this.getRandomElement(relationships);
        const issue = this.getRandomElement(issues);
        const incident = this.getRandomElement(incidents);
        const selfGender = this.getRandomElement(['M', 'F']);
        const otherGender = selfGender === 'M' ? 'F' : 'M';
        
        // Create title
        const title = `Need advice about ${issue} with my ${relationship.type} of ${relationship.duration} years`;
        
        // Create story beginning
        let story = `${title}\n\nI (${selfGender}${ages.self}) and my ${relationship.type} (${otherGender}${ages.other}) have been together for ${relationship.duration} years. Overall, our relationship has been ${this.getRandomElement(['good', 'great', 'mostly positive', 'stable', 'loving'])} until recently.\n\n`;
        
        // Add background
        story += `For context, we ${this.generateRandomRelationshipBackground()}. Our typical dynamic has been ${this.generateRandomDynamic()}.\n\n`;
        
        // Add issue description
        story += `The problem started when I ${incident}. Specifically, ${this.generateRandomIssueDetail(issue)}.\n\n`;
        
        // Add reaction
        story += `When this happened, I felt ${this.generateRandomEmotionalReaction()} and ${this.getRandomElement(['confronted the issue directly', 'tried to discuss it calmly', 'wasn\'t sure how to react', 'felt too hurt to talk about it immediately'])}.\n\n`;
        
        // Add partner's response
        story += `My ${relationship.type}'s response was ${this.generateRandomPartnerResponse()}. This made me feel ${this.generateRandomEmotionalReaction()}.\n\n`;
        
        // Add attempts to resolve if needed to reach target word count
        if (this.countWords(story) < targetWordCount * 0.6) {
            story += `We've tried to address this by ${this.generateRandomResolutionAttempt()}, but ${this.generateRandomObstacle()}.\n\n`;
        }
        
        // Add additional context if needed to reach target word count
        if (this.countWords(story) < targetWordCount * 0.8) {
            story += `Other relevant details: ${this.generateRandomAdditionalContext()}. I'm wondering if this might be affecting our situation.\n\n`;
        }
        
        // Add questions and request for advice
        story += `I'm at a loss for what to do next. Is this a red flag? Should I be more understanding? How do I approach this in a constructive way?\n\n`;
        
        if (this.countWords(story) < targetWordCount * 0.9) {
            story += `Has anyone been in a similar situation? What worked for you? I really want to make this relationship work, but I'm not sure if I'm overreacting or if these are legitimate concerns.\n\n`;
        }
        
        // Add TLDR
        story += `TLDR: ${incident} with my ${relationship.type} of ${relationship.duration} years, revealing ${issue}. Need advice on how to move forward.`;
        
        return story;
    }

    // Helper methods for story generation
    generateRandomIncident(mainCharacter, otherCharacter, issue) {
        const incidents = [
            `constantly bringing up ${issue} without considering my feelings`,
            `making decisions about ${issue} without consulting me first`,
            `pressuring me to change my stance on ${issue}`,
            `telling others about our disagreement over ${issue}`,
            `being inconsiderate about how ${issue} affects me`,
            `dismissing my concerns about ${issue} as unimportant`,
            `insisting their approach to ${issue} was the only right way`,
            `bringing other people into our discussion about ${issue}`,
            `making hurtful comments about my perspective on ${issue}`,
            `refusing to compromise on anything related to ${issue}`
        ];
        
        return this.getRandomElement(incidents);
    }

    generateRandomConflict(mainCharacter, otherCharacter) {
        const conflicts = [
            'They raised their voice and accused me of always making problems',
            'They stormed off and refused to discuss it further',
            'They brought up unrelated issues from the past',
            'They started crying and said I was being cruel',
            'They laughed it off as if my concerns were ridiculous',
            'They called me names and said I was overreacting',
            'They threatened to tell others about private matters',
            'They turned it around and blamed me for everything',
            'They gave me the silent treatment for hours',
            'They insisted I was being unreasonable and controlling'
        ];
        
        return this.getRandomElement(conflicts);
    }

    generateRandomJustification() {
        const justifications = [
            'standing up for myself',
            'setting healthy boundaries',
            'being honest about my feelings',
            'trying to address a recurring issue',
            'advocating for what I thought was fair',
            'protecting my own wellbeing',
            'asking for basic respect',
            'trying to communicate clearly',
            'pointing out a genuine problem',
            'expressing my discomfort with the situation'
        ];
        
        return this.getRandomElement(justifications);
    }

    generateRandomOpinion() {
        const opinions = [
            'I was completely justified',
            'I took things too far',
            'I should have been more understanding',
            'I had every right to speak up',
            'I mishandled the situation',
            'I needed to set this boundary',
            'I could have been more tactful',
            'I shouldn\'t feel guilty at all',
            'I was being too sensitive',
            'I was in the right, but my timing was poor'
        ];
        
        return this.getRandomElement(opinions);
    }

    generateRandomContext() {
        const contexts = [
            'minding my own business',
            'having what I thought was a normal day',
            'dealing with some stress from work',
            'enjoying some downtime',
            'celebrating a small personal win',
            'catching up with friends',
            'trying to relax after a long week',
            'working on an important project',
            'just trying to get through the day',
            'in an unusually good mood'
        ];
        
        return this.getRandomElement(contexts);
    }

    generateRandomBuildUp() {
        const buildUps = [
            'I received an unexpected message',
            'someone made an odd comment',
            'I noticed something strange',
            'a series of coincidences lined up',
            'I had a momentary lapse in judgment',
            'I got distracted at the worst possible moment',
            'I was trying to be helpful',
            'I thought I was being clever',
            'I made what seemed like a minor decision',
            'I was trying to impress someone'
        ];
        
        return this.getRandomElement(buildUps);
    }

    generateRandomReaction() {
        const reactions = [
            'My face went completely red',
            'I froze in absolute horror',
            'I tried to play it cool but was panicking inside',
            'I started stammering excuses',
            'I couldn\'t believe what I had just done',
            'I wanted the ground to open up and swallow me',
            'I looked around desperately for an escape',
            'I felt like time was standing still',
            'My stomach dropped instantly',
            'I knew immediately I had messed up badly'
        ];
        
        return this.getRandomElement(reactions);
    }

    generateRandomConsequenceDetail() {
        const details = [
            'Everyone in the room went silent and stared at me.',
            'I received a series of increasingly angry messages.',
            'Word spread faster than I could have imagined.',
            'The situation escalated within minutes.',
            'What should have been private became very public.',
            'The misunderstanding snowballed out of control.',
            'Multiple people witnessed my embarrassing mistake.',
            'The timing couldn\'t have been worse.',
            'The evidence of my mistake was undeniable.',
            'There was no way to take back what happened.'
        ];
        
        return this.getRandomElement(details);
    }

    generateRandomFixAttempt() {
        const attempts = [
            'profusely apologizing to everyone involved',
            'trying to explain the misunderstanding',
            'sending a lengthy explanation message',
            'enlisting friends to help smooth things over',
            'offering to make amends',
            'pretending it was an intentional joke',
            'trying to distract from the situation',
            'denying it happened at first',
            'attempting to minimize the significance',
            'creating an elaborate cover story'
        ];
        
        return this.getRandomElement(attempts);
    }

    generateRandomAdditionalConsequence() {
        const consequences = [
            'Now even more people know about my mistake',
            'This created a whole new problem to deal with',
            'I accidentally implicated someone else in the process',
            'I revealed other embarrassing information while explaining',
            'My attempts to fix it became a separate issue',
            'My credibility is completely shot now',
            'I\'ve become the subject of office/school gossip',
            'I\'ve been given an unfortunate nickname',
            'Someone recorded my panicked reaction',
            'The story has already become exaggerated in retelling'
        ];
        
        return this.getRandomElement(consequences);
    }

    generateRandomLesson() {
        const lessons = [
            'Always double-check before hitting send',
            'Think before you speak, especially when emotional',
            'Don\'t make assumptions without verification',
            'Trust your gut when something seems off',
            'Never act impulsively when important matters are involved',
            'Keep personal and professional boundaries clear',
            'Don\'t overshare, even with people you trust',
            'Always have a backup plan for important events',
            'Pay attention to details, they matter more than you think',
            'Consider potential consequences before taking action'
        ];
        
        return this.getRandomElement(lessons);
    }

    generateRandomRelationshipBackground() {
        const backgrounds = [
            'met in college and have been together since',
            'were friends for years before dating',
            'met through mutual friends at a party',
            'connected on a dating app and hit it off immediately',
            'work in the same industry but different companies',
            'live together in an apartment we bought last year',
            'have different career paths but always supported each other',
            'come from different cultural backgrounds',
            'share many common interests and hobbies',
            'have gone through several major life events together'
        ];
        
        return this.getRandomElement(backgrounds);
    }

    generateRandomDynamic() {
        const dynamics = [
            'open and communicative about most things',
            'supportive of each other\'s goals and dreams',
            'generally balanced in terms of give and take',
            'respectful of each other\'s independence',
            'affectionate and emotionally connected',
            'practical about finances and responsibilities',
            'good at resolving minor conflicts quickly',
            'on the same page about major life decisions',
            'comfortable with each other\'s friends and family',
            'aligned on future plans like marriage or children'
        ];
        
        return this.getRandomElement(dynamics);
    }

    generateRandomIssueDetail(issue) {
        const details = {
            'communication problems': [
                'they\'ve been increasingly dismissive when I try to talk about important topics',
                'they\'ll shut down completely when difficult subjects come up',
                'they\'ve been keeping things from me that I later discover from others',
                'they communicate through text even for serious matters that should be discussed face-to-face',
                'they interrupt me constantly or seem distracted when I\'m speaking'
            ],
            'trust issues': [
                'I noticed they\'ve been hiding their phone screen when I\'m around',
                'they\'ve been coming home at unusual hours without explanation',
                'they\'ve been inconsistent about their whereabouts',
                'I found they\'ve been in contact with an ex without telling me',
                'they\'ve lied about small things which makes me wonder about bigger issues'
            ],
            'different life goals': [
                'they suddenly mentioned wanting to move to another country for work',
                'they\'ve changed their mind about having children',
                'they want to pursue a career that would require a completely different lifestyle',
                'they\'ve been talking about priorities that seem incompatible with our relationship',
                'they\'ve expressed wanting a lifestyle I can\'t see myself in'
            ]
        };
        
        // If the specific issue has details, use them, otherwise use generic details
        const specificDetails = details[issue];
        if (specificDetails) {
            return this.getRandomElement(specificDetails);
        }
        
        // Generic details for any issue
        const genericDetails = [
            'they\'ve been acting differently in the past few weeks',
            'there was a specific incident that highlighted the problem',
            'it\'s been a recurring theme in our relationship recently',
            'what started as a minor issue has grown into something bigger',
            'I\'ve noticed a pattern that concerns me'
        ];
        
        return this.getRandomElement(genericDetails);
    }

    generateRandomEmotionalReaction() {
        const reactions = [
            'betrayed',
            'confused',
            'heartbroken',
            'anxious',
            'angry',
            'insecure',
            'disappointed',
            'frustrated',
            'hurt',
            'shocked',
            'conflicted',
            'overwhelmed'
        ];
        
        return this.getRandomElement(reactions);
    }

    generateRandomPartnerResponse() {
        const responses = [
            'defensive, saying I was overreacting',
            'dismissive, as if my concerns weren\'t valid',
            'angry that I would even bring up the issue',
            'apologetic but made excuses for their behavior',
            'completely silent, refusing to engage with the topic',
            'surprised, claiming they hadn\'t realized there was a problem',
            'tearful and emotionally distraught',
            'accusatory, turning the issue back on me',
            'understanding at first but later minimized the situation',
            'conflicted, acknowledging the issue but unwilling to change'
        ];
        
        return this.getRandomElement(responses);
    }

    generateRandomResolutionAttempt() {
        const attempts = [
            'having several long conversations about our issues',
            'suggesting couple\'s therapy or counseling',
            'establishing new boundaries and expectations',
            'taking time apart to reflect individually',
            'writing down our feelings to share with each other',
            'asking mutual friends for advice and perspective',
            'reading relationship books and trying the exercises',
            'scheduling regular "check-ins" to discuss our relationship',
            'trying to be more intentional about quality time together',
            'creating specific action plans to address the problems'
        ];
        
        return this.getRandomElement(attempts);
    }

    generateRandomObstacle() {
        const obstacles = [
            'we keep hitting the same roadblocks',
            'the same issues resurface after brief improvements',
            'there seems to be an underlying problem we can\'t identify',
            'we end up arguing instead of resolving anything',
            'they agree to changes but don\'t follow through',
            'I\'m not seeing the effort I hoped for from their side',
            'external stressors keep interfering with our progress',
            'we have fundamentally different views on the issue',
            'the trust has been damaged and is hard to rebuild',
            'we can\'t agree on a compromise that works for both of us'
        ];
        
        return this.getRandomElement(obstacles);
    }

    generateRandomAdditionalContext() {
        const contexts = [
            'we\'ve been under financial stress recently',
            'both of us have been especially busy with work/school',
            'there\'s been family drama affecting our relationship',
            'one of us has been dealing with health issues',
            'we recently went through a major life change together',
            'we\'ve been living long-distance for part of our relationship',
            'we have different love languages and communication styles',
            'there\'s a significant age gap between us',
            'cultural differences sometimes complicate our understanding of each other',
            'previous relationship traumas may be influencing current behaviors'
        ];
        
        return this.getRandomElement(contexts);
    }

    async generateAudio(text, voiceName) {
        try {
            return new Promise((resolve, reject) => {
                // Mock audio generation for now since we can't actually record audio synthesis
                // In a real implementation, this would use the Web Speech API and MediaRecorder
                
                // Simulate audio processing time based on text length
                const processingTime = Math.min(text.length * 10, 5000);
                
                setTimeout(() => {
                    // Create a mock audio blob
                    const mockAudioBlob = new Blob([new ArrayBuffer(1000)], { type: 'audio/mp3' });
                    resolve(mockAudioBlob);
                }, processingTime);
            });
        } catch (error) {
            console.error('Error generating audio:', error);
            throw new Error('Failed to generate audio narration. Please try again.');
        }
    }

    showCanvasPreview() {
        try {
            if (!this.elements.videoCanvas || !this.canvasCtx) return;
            
            // Hide placeholder and show canvas
            const placeholder = this.elements.videoPreview.querySelector('.preview-placeholder');
            if (placeholder) {
                placeholder.style.display = 'none';
            }
            
            this.elements.videoCanvas.style.display = 'block';
            
            // Clear canvas
            this.canvasCtx.clearRect(0, 0, this.elements.videoCanvas.width, this.elements.videoCanvas.height);
            
            // Set background
            this.canvasCtx.fillStyle = '#000';
            this.canvasCtx.fillRect(0, 0, this.elements.videoCanvas.width, this.elements.videoCanvas.height);
        } catch (error) {
            console.error('Error showing canvas preview:', error);
        }
    }

    drawBackground(backgroundType) {
        try {
            if (!this.canvasCtx) return;
            
            // Cancel any existing animation
            if (this.backgroundAnimationId) {
                cancelAnimationFrame(this.backgroundAnimationId);
            }
            
            const canvas = this.elements.videoCanvas;
            const ctx = this.canvasCtx;
            
            // Different background animations based on type
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
        } catch (error) {
            console.error('Error drawing background:', error);
        }
    }

    drawMinecraftBackground() {
        if (!this.canvasCtx) return;
        
        const canvas = this.elements.videoCanvas;
        const ctx = this.canvasCtx;
        
        let offset = 0;
        
        const animate = () => {
            // Clear canvas
            ctx.fillStyle = '#87CEEB'; // Sky blue
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw blocks
            const blockSize = 40;
            const numBlocksX = Math.ceil(canvas.width / blockSize);
            const numBlocksY = Math.ceil(canvas.height / blockSize) + 1;
            
            offset = (offset + 2) % blockSize;
            
            for (let y = 0; y < numBlocksY; y++) {
                for (let x = 0; x < numBlocksX; x++) {
                    const blockType = Math.floor((x + y) % 3);
                    
                    let color;
                    switch (blockType) {
                        case 0:
                            color = '#8B4513'; // Brown (dirt)
                            break;
                        case 1:
                            color = '#567D46'; // Green (grass)
                            break;
                        case 2:
                            color = '#707070'; // Gray (stone)
                            break;
                    }
                    
                    ctx.fillStyle = color;
                    ctx.fillRect(
                        x * blockSize,
                        canvas.height - (y * blockSize) + offset,
                        blockSize,
                        blockSize
                    );
                    
                    // Add block outline
                    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(
                        x * blockSize,
                        canvas.height - (y * blockSize) + offset,
                        blockSize,
                        blockSize
                    );
                }
            }
            
            // Request next frame
            this.backgroundAnimationId = requestAnimationFrame(animate);
        };
        
        // Start animation
        animate();
    }

    drawNatureBackground() {
        if (!this.canvasCtx) return;
        
        const canvas = this.elements.videoCanvas;
        const ctx = this.canvasCtx;
        
        let hue = 0;
        
        const animate = () => {
            // Clear canvas with gradient
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, `hsl(${(hue + 180) % 360}, 70%, 80%)`); // Sky
            gradient.addColorStop(0.7, `hsl(${(hue + 220) % 360}, 60%, 60%)`); // Horizon
            gradient.addColorStop(1, `hsl(${(hue + 110) % 360}, 60%, 40%)`); // Ground
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw mountains
            ctx.fillStyle = `hsl(${(hue + 120) % 360}, 30%, 30%)`;
            
            // First mountain range
            ctx.beginPath();
            ctx.moveTo(0, canvas.height * 0.7);
            
            for (let x = 0; x < canvas.width; x += 50) {
                const y = canvas.height * 0.7 - Math.sin(x * 0.01 + hue * 0.01) * 100 - Math.random() * 20;
                ctx.lineTo(x, y);
            }
            
            ctx.lineTo(canvas.width, canvas.height * 0.7);
            ctx.lineTo(0, canvas.height * 0.7);
            ctx.fill();
            
            // Second mountain range
            ctx.fillStyle = `hsl(${(hue + 140) % 360}, 40%, 20%)`;
            ctx.beginPath();
            ctx.moveTo(0, canvas.height * 0.8);
            
            for (let x = 0; x < canvas.width; x += 30) {
                const y = canvas.height * 0.8 - Math.sin(x * 0.02 + hue * 0.02) * 80 - Math.random() * 10;
                ctx.lineTo(x, y);
            }
            
            ctx.lineTo(canvas.width, canvas.height * 0.8);
            ctx.lineTo(0, canvas.height * 0.8);
            ctx.fill();
            
            // Update hue
            hue = (hue + 0.2) % 360;
            
            // Request next frame
            this.backgroundAnimationId = requestAnimationFrame(animate);
        };
        
        // Start animation
        animate();
    }

    drawUrbanBackground() {
        if (!this.canvasCtx) return;
        
        const canvas = this.elements.videoCanvas;
        const ctx = this.canvasCtx;
        
        let offset = 0;
        
        const animate = () => {
            // Dark blue/purple night sky
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#0f1034');
            gradient.addColorStop(1, '#263570');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw stars
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            for (let i = 0; i < 100; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height * 0.7;
                const size = Math.random() * 2 + 1;
                const alpha = Math.random() * 0.8 + 0.2;
                
                ctx.globalAlpha = alpha;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
            
            // Draw buildings
            const buildingCount = 20;
            const buildingWidth = canvas.width / buildingCount;
            
            offset = (offset + 0.5) % (buildingWidth * 2);
            
            for (let i = 0; i < buildingCount + 1; i++) {
                const x = i * buildingWidth - offset;
                const height = Math.random() * canvas.height * 0.5 + canvas.height * 0.3;
                const y = canvas.height - height;
                
                // Building
                ctx.fillStyle = '#111111';
                ctx.fillRect(x, y, buildingWidth, height);
                
                // Windows
                ctx.fillStyle = 'rgba(255, 255, 0, 0.8)';
                
                const windowSize = buildingWidth / 6;
                const windowSpacing = windowSize * 1.5;
                
                for (let wx = x + windowSize; wx < x + buildingWidth - windowSize; wx += windowSpacing) {
                    for (let wy = y + windowSize; wy < canvas.height - windowSize; wy += windowSpacing) {
                        // Only draw some windows (random pattern)
                        if (Math.random() > 0.3) {
                            ctx.fillRect(wx, wy, windowSize, windowSize);
                        }
                    }
                }
            }
            
            // Request next frame
            this.backgroundAnimationId = requestAnimationFrame(animate);
        };
        
        // Start animation
        animate();
    }

    drawAbstractBackground() {
        if (!this.canvasCtx) return;
        
        const canvas = this.elements.videoCanvas;
        const ctx = this.canvasCtx;
        
        let time = 0;
        
        const animate = () => {
            // Clear canvas with gradient
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            
            gradient.addColorStop(0, `hsl(${time % 360}, 70%, 20%)`);
            gradient.addColorStop(0.5, `hsl(${(time + 120) % 360}, 80%, 30%)`);
            gradient.addColorStop(1, `hsl(${(time + 240) % 360}, 90%, 20%)`);
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw circles
            for (let i = 0; i < 10; i++) {
                const x = canvas.width * 0.5 + Math.sin(time * 0.01 + i) * canvas.width * 0.4;
                const y = canvas.height * 0.5 + Math.cos(time * 0.01 + i * 0.7) * canvas.height * 0.4;
                const radius = 50 + Math.sin(time * 0.02 + i * 0.5) * 30;
                
                const circleGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                circleGradient.addColorStop(0, `hsla(${(time + i * 30) % 360}, 100%, 70%, 0.8)`);
                circleGradient.addColorStop(1, `hsla(${(time + i * 30) % 360}, 100%, 50%, 0)`);
                
                ctx.fillStyle = circleGradient;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Update time
            time += 1;
            
            // Request next frame
            this.backgroundAnimationId = requestAnimationFrame(animate);
        };
        
        // Start animation
        animate();
    }

    drawOceanBackground() {
        if (!this.canvasCtx) return;
        
        const canvas = this.elements.videoCanvas;
        const ctx = this.canvasCtx;
        
        let time = 0;
        
        const animate = () => {
            // Ocean gradient background
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#0a2e44'); // Deep blue at top
            gradient.addColorStop(0.7, '#0f5e9c'); // Medium blue
            gradient.addColorStop(1, '#2389da'); // Light blue at bottom
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw waves
            const waveCount = 6;
            const waveHeight = canvas.height / waveCount;
            
            for (let i = 0; i < waveCount; i++) {
                const y = canvas.height - (i * waveHeight);
                const alpha = 0.1 + (i * 0.05);
                
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.beginPath();
                ctx.moveTo(0, y);
                
                for (let x = 0; x < canvas.width; x++) {
                    const waveY = y + Math.sin(x * 0.01 + time * 0.05 + i) * 20;
                    ctx.lineTo(x, waveY);
                }
                
                ctx.lineTo(canvas.width, canvas.height);
                ctx.lineTo(0, canvas.height);
                ctx.closePath();
                ctx.fill();
            }
            
            // Draw small bubbles
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            for (let i = 0; i < 20; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const size = Math.random() * 5 + 2;
                const alpha = Math.random() * 0.3 + 0.1;
                
                ctx.globalAlpha = alpha;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
            
            // Update time
            time += 1;
            
            // Request next frame
            this.backgroundAnimationId = requestAnimationFrame(animate);
        };
        
        // Start animation
        animate();
    }

    async createVideoWithFFmpeg(audioBlob, duration) {
        try {
            // This is a mock implementation
            // In a real application, this would use FFmpeg.wasm to create an actual video
            
            // Simulate video processing time based on duration
            const processingTime = Math.min(duration * 1000, 10000);
            
            this.updateProgress(85, `Processing video (${duration} minutes)...`);
            
            return new Promise((resolve) => {
                setTimeout(() => {
                    // Create a mock video blob
                    const mockVideoBlob = new Blob([new ArrayBuffer(100000)], { type: 'video/mp4' });
                    resolve(mockVideoBlob);
                }, processingTime);
            });
        } catch (error) {
            console.error('Error creating video with FFmpeg:', error);
            throw new Error('Failed to create video. Please try again.');
        }
    }

    downloadVideo() {
        try {
            if (!this.videoBlob) {
                throw new Error('No video available to download');
            }
            
            const url = URL.createObjectURL(this.videoBlob);
            const a = document.createElement('a');
            a.href = url;
            
            // Generate filename with timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const storyType = this.elements.storyType.value;
            a.download = `facelessai-${storyType}-${timestamp}.mp4`;
            
            // Trigger download
            document.body.appendChild(a);
            a.click();
            
            // Clean up
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
        } catch (error) {
            console.error('Error downloading video:', error);
            this.showError('Failed to download video: ' + error.message);
        }
    }

    resetGenerator() {
        try {
            // Hide download section
            this.elements.downloadSection.style.display = 'none';
            
            // Clear story preview
            this.elements.storyContent.textContent = 'Your AI-generated story will appear here after clicking "Generate Video"';
            
            // Hide canvas and show placeholder
            this.elements.videoCanvas.style.display = 'none';
            const placeholder = this.elements.videoPreview.querySelector('.preview-placeholder');
            if (placeholder) {
                placeholder.style.display = 'flex';
            }
            
            // Cancel background animation
            if (this.backgroundAnimationId) {
                cancelAnimationFrame(this.backgroundAnimationId);
                this.backgroundAnimationId = null;
            }
            
            // Reset video blob
            this.videoBlob = null;
            this.storyText = '';
        } catch (error) {
            console.error('Error resetting generator:', error);
        }
    }

    showError(message) {
        // Simple alert for now - could be replaced with a custom modal
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

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new FacelessAI();
});