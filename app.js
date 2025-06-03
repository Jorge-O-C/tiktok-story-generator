// TikTok Story Generator - Main Application Logic

class TikTokStoryGenerator {
    constructor() {
        this.currentStep = 1;
        this.selectedCategory = null;
        this.selectedDuration = 3;
        this.generatedStory = null;
        this.voiceSettings = {
            voice: 0,
            speed: 1.0
        };
        this.backgroundStyle = 'minecraft';
        this.captionSettings = {
            font: 'bold',
            color: 'white'
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateWordCount();
    }

    bindEvents() {
        // Category selection
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', (e) => this.selectCategory(e));
        });

        // Duration slider
        const durationSlider = document.getElementById('durationSlider');
        durationSlider.addEventListener('input', (e) => this.updateDuration(e));

        // Generate story button
        document.getElementById('generateStoryBtn').addEventListener('click', () => this.generateStory());

        // Story actions
        document.getElementById('regenerateBtn').addEventListener('click', () => this.generateStory());
        document.getElementById('continueToCustomizationBtn').addEventListener('click', () => this.showCustomization());

        // Voice settings
        document.getElementById('voiceSelect').addEventListener('change', (e) => this.updateVoiceSettings(e));
        document.getElementById('speedSlider').addEventListener('input', (e) => this.updateSpeed(e));
        document.getElementById('previewVoiceBtn').addEventListener('click', () => this.previewVoice());

        // Background selection
        document.querySelectorAll('.background-option').forEach(option => {
            option.addEventListener('click', (e) => this.selectBackground(e));
        });

        // Caption settings
        document.getElementById('captionFont').addEventListener('change', (e) => this.updateCaptionSettings(e));
        document.getElementById('captionColor').addEventListener('change', (e) => this.updateCaptionSettings(e));

        // Video controls
        document.getElementById('previewVideoBtn').addEventListener('click', () => this.previewVideo());
        document.getElementById('generateVideoBtn').addEventListener('click', () => this.generateVideo());
    }

    selectCategory(e) {
        // Remove previous selection
        document.querySelectorAll('.category-card').forEach(card => {
            card.classList.remove('selected');
        });

        // Add selection to clicked card
        e.currentTarget.classList.add('selected');
        this.selectedCategory = e.currentTarget.dataset.category;

        // Show duration section after short delay
        setTimeout(() => {
            this.showSection('durationSection');
        }, 300);
    }

    updateDuration(e) {
        this.selectedDuration = parseInt(e.target.value);
        document.getElementById('durationValue').textContent = this.selectedDuration;
        this.updateWordCount();
    }

    updateWordCount() {
        const wordsPerMinute = 140;
        const estimatedWords = this.selectedDuration * wordsPerMinute;
        document.getElementById('wordCount').textContent = estimatedWords;
    }

    async generateStory() {
        // Show loading state
        const contentDiv = document.getElementById('storyContent');
        const titleDiv = document.getElementById('storyTitle');
        const tldrDiv = document.getElementById('storyTldr');
        
        contentDiv.innerHTML = '<div class="loading-spinner">Generating your unique story...</div>';
        titleDiv.textContent = 'Loading story...';
        tldrDiv.textContent = '';

        // Show story section
        this.showSection('storySection');

        // Simulate API call delay
        await this.delay(2000);

        // Generate procedural story
        const story = this.createProceduralStory();
        this.generatedStory = story;

        // Update UI with generated story
        this.displayStory(story);
    }

    createProceduralStory() {
        const generators = {
            aita: () => this.generateAITAStory(),
            tifu: () => this.generateTIFUStory(),
            relationship: () => this.generateRelationshipStory()
        };

        return generators[this.selectedCategory]();
    }

    generateAITAStory() {
        const scenarios = [
            {
                context: "wedding planning",
                conflict: "budget disagreement",
                relationship: "fiancé",
                ages: [25, 28],
                genders: ["F", "M"]
            },
            {
                context: "family dinner",
                conflict: "dietary restrictions",
                relationship: "sister-in-law",
                ages: [30, 32],
                genders: ["M", "F"]
            },
            {
                context: "workplace situation",
                conflict: "promotion opportunity",
                relationship: "colleague",
                ages: [27, 29],
                genders: ["F", "F"]
            }
        ];

        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        const wordsNeeded = this.selectedDuration * 140;
        
        const title = `AITA for ${this.generateConflictAction()} during ${scenario.context}?`;
        
        let content = `I (${scenario.ages[0]}${scenario.genders[0]}) have been dealing with this situation with my ${scenario.relationship} (${scenario.ages[1]}${scenario.genders[1]}) and I honestly don't know if I'm in the wrong here.\n\n`;
        
        content += this.generateDetailedNarrative(scenario, wordsNeeded - 100);
        
        const tldr = `TL;DR: Had a ${scenario.conflict} with my ${scenario.relationship} during ${scenario.context}, now everyone thinks I'm the asshole but I think I was justified.`;

        return { title, content, tldr, subreddit: "r/AmItheAsshole" };
    }

    generateTIFUStory() {
        const fuckups = [
            {
                setting: "work presentation",
                mistake: "wrong file shared",
                consequence: "embarrassing photos shown",
                timeline: "today"
            },
            {
                setting: "first date",
                mistake: "autocorrect text fail",
                consequence: "completely wrong message sent",
                timeline: "yesterday"
            },
            {
                setting: "cooking dinner",
                mistake: "confused salt and sugar",
                consequence: "inedible meal for guests",
                timeline: "last week"
            }
        ];

        const fuckup = fuckups[Math.floor(Math.random() * fuckups.length)];
        const wordsNeeded = this.selectedDuration * 140;

        const title = `TIFU by ${fuckup.mistake} during ${fuckup.setting}`;
        
        let content = `This happened ${fuckup.timeline} and I'm still cringing about it. So there I was, everything was going perfectly until I made the most embarrassing mistake of my life.\n\n`;
        
        content += this.generateTIFUNarrative(fuckup, wordsNeeded - 100);
        
        const tldr = `TL;DR: ${fuckup.mistake} during ${fuckup.setting}, resulted in ${fuckup.consequence} and maximum embarrassment.`;

        return { title, content, tldr, subreddit: "r/tifu" };
    }

    generateRelationshipStory() {
        const relationships = [
            {
                duration: "2 years",
                ages: [24, 26],
                issue: "communication problems",
                trigger: "constant phone checking",
                feeling: "ignored and unimportant"
            },
            {
                duration: "6 months",
                ages: [22, 23],
                issue: "trust issues",
                trigger: "secretive behavior",
                feeling: "suspicious and anxious"
            },
            {
                duration: "4 years",
                ages: [28, 30],
                issue: "future planning disagreement",
                trigger: "avoiding marriage talk",
                feeling: "uncertain about the future"
            }
        ];

        const rel = relationships[Math.floor(Math.random() * relationships.length)];
        const wordsNeeded = this.selectedDuration * 140;

        const title = `How do I (${rel.ages[0]}F) address ${rel.issue} with my boyfriend (${rel.ages[1]}M) of ${rel.duration}?`;
        
        let content = `I've been with my boyfriend for ${rel.duration} and overall our relationship has been really good, but lately I've been feeling ${rel.feeling} because of some ongoing issues.\n\n`;
        
        content += this.generateRelationshipNarrative(rel, wordsNeeded - 100);
        
        const tldr = `TL;DR: Been with BF for ${rel.duration}, ${rel.issue} because of ${rel.trigger}, feeling ${rel.feeling}, need advice on how to fix this.`;

        return { title, content, tldr, subreddit: "r/relationship_advice" };
    }

    generateConflictAction() {
        const actions = [
            "refusing to compromise",
            "standing my ground",
            "calling them out",
            "setting boundaries",
            "walking away",
            "speaking my mind"
        ];
        return actions[Math.floor(Math.random() * actions.length)];
    }

    generateDetailedNarrative(scenario, targetWords) {
        let narrative = "";
        const events = [
            `The situation started when we were discussing ${scenario.context}. `,
            `Everything seemed fine at first, but then the ${scenario.conflict} became a major issue. `,
            `I tried to be reasonable and find a middle ground, but my ${scenario.relationship} was being completely unreasonable. `,
            `They kept insisting on their way and wouldn't listen to any of my concerns or suggestions. `,
            `I finally had enough and told them exactly how I felt about the whole situation. `,
            `This led to a huge argument where they accused me of being selfish and inconsiderate. `,
            `Now the whole family is involved and everyone is taking sides. `,
            `Some people think I went too far, but others agree that I was justified in my response. `,
            `The situation has escalated beyond what I ever expected and now relationships are strained. `,
            `I'm starting to question whether I handled this the right way, but I still believe I was right. `
        ];

        while (narrative.split(' ').length < targetWords && events.length > 0) {
            const randomEvent = events.splice(Math.floor(Math.random() * events.length), 1)[0];
            narrative += randomEvent;
        }

        return narrative;
    }

    generateTIFUNarrative(fuckup, targetWords) {
        let narrative = "";
        const events = [
            `So I was preparing for ${fuckup.setting} and everything was going smoothly. `,
            `I had been planning this for weeks and was feeling pretty confident about how it would go. `,
            `But then, in a moment of complete brain fog, I made the fatal error of ${fuckup.mistake}. `,
            `At first, I didn't realize what had happened and continued on like everything was normal. `,
            `It wasn't until I saw everyone's faces that I realized something was terribly wrong. `,
            `The look of shock and confusion told me immediately that I had messed up big time. `,
            `${fuckup.consequence} and I wanted to disappear into the ground right then and there. `,
            `I tried to recover and fix the situation, but the damage was already done. `,
            `Everyone was trying to be polite, but I could tell they were all thinking about what just happened. `,
            `I spent the rest of the time apologizing and trying to explain, but it just made things more awkward. `
        ];

        while (narrative.split(' ').length < targetWords && events.length > 0) {
            const randomEvent = events.splice(Math.floor(Math.random() * events.length), 1)[0];
            narrative += randomEvent;
        }

        return narrative;
    }

    generateRelationshipNarrative(rel, targetWords) {
        let narrative = "";
        const events = [
            `The main issue is ${rel.trigger}, which has been happening more and more frequently. `,
            `When I try to bring it up, he either dismisses my concerns or changes the subject completely. `,
            `I've attempted to have serious conversations about this multiple times, but we never seem to make progress. `,
            `It's affecting my mental health because I constantly feel ${rel.feeling} in the relationship. `,
            `My friends have noticed the change in my mood and keep asking if everything is okay. `,
            `I love him and want to make this work, but I don't know how much longer I can handle this situation. `,
            `We used to communicate so well about everything, but now it feels like we're speaking different languages. `,
            `I've considered giving him an ultimatum, but I'm worried that might push him away completely. `,
            `Has anyone else dealt with something similar? I really need advice on how to approach this. `,
            `I'm willing to put in the work to fix this, but it needs to be a team effort from both of us. `
        ];

        while (narrative.split(' ').length < targetWords && events.length > 0) {
            const randomEvent = events.splice(Math.floor(Math.random() * events.length), 1)[0];
            narrative += randomEvent;
        }

        return narrative;
    }

    displayStory(story) {
        document.getElementById('subredditName').textContent = story.subreddit;
        document.getElementById('storyTitle').textContent = story.title;
        document.getElementById('storyContent').textContent = story.content;
        document.getElementById('storyTldr').textContent = story.tldr;
    }

    showCustomization() {
        this.showSection('customizationSection');
        // Auto-scroll to customization section
        document.getElementById('customizationSection').scrollIntoView({ behavior: 'smooth' });
    }

    updateVoiceSettings(e) {
        this.voiceSettings.voice = parseInt(e.target.value);
    }

    updateSpeed(e) {
        this.voiceSettings.speed = parseFloat(e.target.value);
        document.getElementById('speedValue').textContent = e.target.value;
    }

    previewVoice() {
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance("This is a preview of how your story will sound.");
            utterance.rate = this.voiceSettings.speed;
            
            const voices = speechSynthesis.getVoices();
            if (voices.length > 0) {
                utterance.voice = voices[this.voiceSettings.voice] || voices[0];
            }
            
            speechSynthesis.speak(utterance);
        } else {
            alert('Speech synthesis not supported in this browser.');
        }
    }

    selectBackground(e) {
        // Remove previous selection
        document.querySelectorAll('.background-option').forEach(option => {
            option.classList.remove('active');
        });

        // Add selection to clicked option
        e.currentTarget.classList.add('active');
        this.backgroundStyle = e.currentTarget.dataset.background;
        
        // Update preview
        this.updateVideoPreview();
    }

    updateCaptionSettings(e) {
        if (e.target.id === 'captionFont') {
            this.captionSettings.font = e.target.value;
        } else if (e.target.id === 'captionColor') {
            this.captionSettings.color = e.target.value;
        }
        this.updateVideoPreview();
    }

    updateVideoPreview() {
        const backgroundDiv = document.getElementById('backgroundAnimation');
        const captionsDiv = document.getElementById('videoCaptions');
        
        // Update background style
        const backgroundStyles = {
            minecraft: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
            nature: 'linear-gradient(135deg, #667eea, #764ba2)',
            urban: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
            abstract: 'linear-gradient(135deg, #FF9A9E, #FECFEF)',
            ocean: 'linear-gradient(45deg, #667eea, #764ba2)'
        };
        
        backgroundDiv.style.background = backgroundStyles[this.backgroundStyle];
        
        // Update caption styling
        const captionText = captionsDiv.querySelector('.caption-text');
        if (captionText) {
            const fontStyles = {
                bold: { fontWeight: 'bold', fontFamily: 'Arial, sans-serif' },
                clean: { fontWeight: 'normal', fontFamily: 'Helvetica, sans-serif' },
                impact: { fontWeight: 'bold', fontFamily: 'Impact, sans-serif' }
            };
            
            const colorStyles = {
                white: { color: 'white', background: 'rgba(0, 0, 0, 0.7)' },
                yellow: { color: '#FFD700', background: 'rgba(0, 0, 0, 0.7)' },
                gradient: { background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }
            };
            
            Object.assign(captionText.style, fontStyles[this.captionSettings.font]);
            Object.assign(captionText.style, colorStyles[this.captionSettings.color]);
        }
        
        // Show video section
        this.showSection('videoSection');
        
        // Update video length display
        document.getElementById('videoLength').textContent = `${this.selectedDuration}:00`;
    }

    previewVideo() {
        if (!this.generatedStory) {
            alert('Please generate a story first!');
            return;
        }
        
        this.updateVideoPreview();
        
        // Simulate preview with sample text
        const captionText = document.querySelector('.caption-text');
        const words = this.generatedStory.content.split(' ').slice(0, 20);
        let currentWord = 0;
        
        const previewInterval = setInterval(() => {
            if (currentWord < words.length) {
                const highlightedText = words.map((word, index) => {
                    if (index === currentWord) {
                        return `<span style="background-color: yellow; color: black;">${word}</span>`;
                    }
                    return word;
                }).join(' ');
                
                captionText.innerHTML = highlightedText;
                currentWord++;
            } else {
                clearInterval(previewInterval);
                captionText.textContent = 'Preview complete! Click "Generate MP4 Video" to create your full video.';
            }
        }, 300);
    }

    async generateVideo() {
        if (!this.generatedStory) {
            alert('Please generate a story first!');
            return;
        }

        // Show progress container
        const progressContainer = document.getElementById('progressContainer');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        progressContainer.classList.remove('hidden');
        
        // Simulate video generation process
        const steps = [
            { text: 'Initializing video generator...', progress: 10 },
            { text: 'Processing story text...', progress: 25 },
            { text: 'Generating voice narration...', progress: 40 },
            { text: 'Rendering background animation...', progress: 60 },
            { text: 'Synchronizing captions...', progress: 80 },
            { text: 'Encoding MP4 video...', progress: 95 },
            { text: 'Video generation complete!', progress: 100 }
        ];
        
        for (let step of steps) {
            progressText.textContent = step.text;
            progressFill.style.width = step.progress + '%';
            await this.delay(1500);
        }
        
        // Hide progress and show download
        progressContainer.classList.add('hidden');
        document.getElementById('downloadContainer').classList.remove('hidden');
        
        // Setup download button
        this.setupDownload();
    }

    setupDownload() {
        const downloadBtn = document.getElementById('downloadBtn');
        downloadBtn.addEventListener('click', () => {
            // Create a mock MP4 file for download
            const videoData = this.createMockVideoFile();
            const blob = new Blob([videoData], { type: 'video/mp4' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `tiktok-story-${this.selectedCategory}-${Date.now()}.mp4`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    createMockVideoFile() {
        // Create a simple mock video file header (this would be replaced with actual FFmpeg.wasm output)
        const mockMP4Header = new ArrayBuffer(1024);
        const view = new Uint8Array(mockMP4Header);
        
        // Add MP4 file signature
        const mp4Signature = [0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70];
        mp4Signature.forEach((byte, index) => {
            view[index] = byte;
        });
        
        // Fill rest with mock data representing video content
        for (let i = mp4Signature.length; i < view.length; i++) {
            view[i] = Math.floor(Math.random() * 256);
        }
        
        return mockMP4Header;
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.step-section').forEach(section => {
            section.classList.add('hidden');
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionId);
        targetSection.classList.remove('hidden');
        targetSection.classList.add('animate-in');
        
        // Scroll to section
        setTimeout(() => {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TikTokStoryGenerator();
    
    // Load voices for speech synthesis
    if ('speechSynthesis' in window) {
        speechSynthesis.onvoiceschanged = function() {
            const voices = speechSynthesis.getVoices();
            console.log('Available voices:', voices.length);
        };
    }
});

// Handle responsive design for mobile
window.addEventListener('resize', () => {
    // Adjust video preview size for mobile
    const videoPreview = document.querySelector('.video-preview');
    if (videoPreview && window.innerWidth < 768) {
        videoPreview.style.width = '200px';
        videoPreview.style.height = '356px';
    } else if (videoPreview) {
        videoPreview.style.width = '270px';
        videoPreview.style.height = '480px';
    }
});