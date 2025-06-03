// FacelessAI - TikTok Video Generator
// Main application class with improved error handling

class FacelessAI {
    constructor() {
        this.currentStoryType = null;
        this.currentStory = null;
        this.currentVoice = null;
        this.currentBackground = 'minecraft';
        this.speechRate = 1.0;
        this.duration = 5;
        this.isGenerating = false;
        this.videoRecorder = null;
        this.animationId = null;
        this.videoChunks = [];
        this.videoBlob = null;
        
        // Application data
        this.data = {
            storyTypes: [
                {
                    id: "aita",
                    name: "AITA (Am I The Asshole)",
                    emoji: "🤔",
                    description: "Moral dilemmas and ethical conflicts requiring community judgment",
                    color: "#FF6B6B"
                },
                {
                    id: "tifu", 
                    name: "TIFU (Today I F***ed Up)",
                    emoji: "😅",
                    description: "Embarrassing mistakes and their humorous consequences",
                    color: "#4ECDC4"
                },
                {
                    id: "relationship",
                    name: "Relationship Advice",
                    emoji: "💕",
                    description: "Interpersonal conflicts and romantic situations needing guidance",
                    color: "#45B7D1"
                }
            ],
            voiceOptions: [
                {
                    id: "male1",
                    name: "Alex (Male)",
                    gender: "male",
                    pitch: 0.8,
                    rate: 1.0
                },
                {
                    id: "female1", 
                    name: "Sarah (Female)",
                    gender: "female",
                    pitch: 1.2,
                    rate: 1.0
                },
                {
                    id: "male2",
                    name: "David (Male)",
                    gender: "male", 
                    pitch: 0.6,
                    rate: 0.9
                },
                {
                    id: "female2",
                    name: "Emma (Female)",
                    gender: "female",
                    pitch: 1.4,
                    rate: 1.1
                }
            ],
            backgrounds: [
                {
                    id: "minecraft",
                    name: "Minecraft Parkour",
                    description: "Block-style geometric patterns with movement"
                },
                {
                    id: "nature",
                    name: "Peaceful Nature",
                    description: "Flowing gradients with natural themes"
                },
                {
                    id: "urban",
                    name: "Urban Neon",
                    description: "City-inspired neon lights and patterns"
                },
                {
                    id: "abstract",
                    name: "Abstract Geometry", 
                    description: "Colorful geometric shapes and transitions"
                },
                {
                    id: "ocean",
                    name: "Ocean Waves",
                    description: "Smooth wave animations with blue themes"
                }
            ],
            features: [
                {
                    icon: "🤖",
                    title: "AI Story Generation",
                    description: "Create unique Reddit-style stories in real-time with advanced AI algorithms"
                },
                {
                    icon: "🎥",
                    title: "TikTok Ready Videos",
                    description: "Generate 1080x1920 MP4 videos optimized for TikTok's algorithm"
                },
                {
                    icon: "🗣️",
                    title: "Natural Voice Narration",
                    description: "Multiple male and female voice options with customizable speech settings"
                },
                {
                    icon: "🎨",
                    title: "Dynamic Backgrounds",
                    description: "5 animated background styles to match your content aesthetic"
                },
                {
                    icon: "⚡",
                    title: "Instant Generation",
                    description: "Create professional videos in minutes with our automated pipeline"
                },
                {
                    icon: "📱",
                    title: "Mobile Optimized",
                    description: "Fully responsive design that works perfectly on all devices"
                }
            ]
        };
        
        this.init();
    }

    init() {
        try {
            // Ensure loading overlay is hidden on start
            this.hideLoading();
            
            // Wait a bit for DOM to be fully ready
            setTimeout(() => {
                this.bindEvents();
                this.populateContent();
                this.setupDefaults();
            }, 100);
        } catch (error) {
            console.error('Failed to initialize FacelessAI:', error);
            this.hideLoading();
        }
    }

    bindEvents() {
        try {
            // Navigation events
            const startBtn = document.getElementById('start-creating-btn');
            if (startBtn) {
                startBtn.addEventListener('click', () => this.showGenerator());
            }
            
            const learnBtn = document.getElementById('learn-more-btn');
            if (learnBtn) {
                learnBtn.addEventListener('click', () => this.scrollToFeatures());
            }
            
            const backBtn = document.getElementById('back-home-btn');
            if (backBtn) {
                backBtn.addEventListener('click', () => this.showLandingPage());
            }
            
            // Generator events
            const generateBtn = document.getElementById('generate-story-btn');
            if (generateBtn) {
                generateBtn.addEventListener('click', () => this.generateStory());
            }
            
            const createBtn = document.getElementById('create-video-btn');
            if (createBtn) {
                createBtn.addEventListener('click', () => this.createVideo());
            }
            
            const downloadBtn = document.getElementById('download-video-btn');
            if (downloadBtn) {
                downloadBtn.addEventListener('click', () => this.downloadVideo());
            }
            
            const voicePreviewBtn = document.getElementById('voice-preview-btn');
            if (voicePreviewBtn) {
                voicePreviewBtn.addEventListener('click', () => this.previewVoice());
            }
            
            // Control events
            const durationSlider = document.getElementById('duration-slider');
            if (durationSlider) {
                durationSlider.addEventListener('input', (e) => this.updateDuration(e.target.value));
            }
            
            const speechRateSlider = document.getElementById('speech-rate');
            if (speechRateSlider) {
                speechRateSlider.addEventListener('input', (e) => this.updateSpeechRate(e.target.value));
            }
            
            const voiceSelect = document.getElementById('voice-select');
            if (voiceSelect) {
                voiceSelect.addEventListener('change', (e) => this.updateVoice(e.target.value));
            }
            
            const backgroundSelect = document.getElementById('background-select');
            if (backgroundSelect) {
                backgroundSelect.addEventListener('change', (e) => this.updateBackground(e.target.value));
            }
        } catch (error) {
            console.error('Error binding events:', error);
        }
    }

    populateContent() {
        try {
            this.populateFeatures();
            this.populateStoryTypesPreview();
            this.populateStoryTypeSelection();
            this.populateVoiceOptions();
            this.populateBackgroundOptions();
        } catch (error) {
            console.error('Error populating content:', error);
        }
    }

    populateFeatures() {
        const featuresGrid = document.getElementById('features-grid');
        if (!featuresGrid) return;
        
        try {
            featuresGrid.innerHTML = this.data.features.map(feature => `
                <div class="feature-card">
                    <span class="feature-card__icon">${feature.icon}</span>
                    <h3 class="feature-card__title">${feature.title}</h3>
                    <p class="feature-card__description">${feature.description}</p>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error populating features:', error);
        }
    }

    populateStoryTypesPreview() {
        const storyTypesPreview = document.getElementById('story-types-preview');
        if (!storyTypesPreview) return;
        
        try {
            storyTypesPreview.innerHTML = this.data.storyTypes.map(type => `
                <div class="story-type-preview-card" data-type="${type.id}">
                    <span class="story-type-preview-card__emoji">${type.emoji}</span>
                    <h3 class="story-type-preview-card__name">${type.name}</h3>
                    <p class="story-type-preview-card__description">${type.description}</p>
                </div>
            `).join('');
            
            // Add click handlers for preview cards
            storyTypesPreview.querySelectorAll('.story-type-preview-card').forEach(card => {
                card.addEventListener('click', () => {
                    this.showGenerator();
                    setTimeout(() => {
                        this.selectStoryType(card.dataset.type);
                    }, 100);
                });
            });
        } catch (error) {
            console.error('Error populating story types preview:', error);
        }
    }

    populateStoryTypeSelection() {
        const storyTypeSelection = document.getElementById('story-type-selection');
        if (!storyTypeSelection) return;
        
        try {
            storyTypeSelection.innerHTML = this.data.storyTypes.map(type => `
                <div class="story-type-card" data-type="${type.id}">
                    <span class="story-type-card__emoji">${type.emoji}</span>
                    <div class="story-type-card__content">
                        <h4>${type.name}</h4>
                        <p>${type.description}</p>
                    </div>
                </div>
            `).join('');

            // Add click handlers for story type cards
            storyTypeSelection.querySelectorAll('.story-type-card').forEach(card => {
                card.addEventListener('click', () => {
                    this.selectStoryType(card.dataset.type);
                });
            });
        } catch (error) {
            console.error('Error populating story type selection:', error);
        }
    }

    populateVoiceOptions() {
        const voiceSelect = document.getElementById('voice-select');
        if (!voiceSelect) return;
        
        try {
            voiceSelect.innerHTML = this.data.voiceOptions.map(voice => `
                <option value="${voice.id}">${voice.name}</option>
            `).join('');
        } catch (error) {
            console.error('Error populating voice options:', error);
        }
    }

    populateBackgroundOptions() {
        const backgroundSelect = document.getElementById('background-select');
        if (!backgroundSelect) return;
        
        try {
            backgroundSelect.innerHTML = this.data.backgrounds.map(bg => `
                <option value="${bg.id}">${bg.name} - ${bg.description}</option>
            `).join('');
        } catch (error) {
            console.error('Error populating background options:', error);
        }
    }

    setupDefaults() {
        try {
            this.selectStoryType('aita');
            this.updateVoice('female1');
            this.updateBackground('minecraft');
            this.updateDuration(5);
            this.updateSpeechRate(1.0);
        } catch (error) {
            console.error('Error setting up defaults:', error);
        }
    }

    showGenerator() {
        try {
            const landingPage = document.getElementById('landing-page');
            const generator = document.getElementById('video-generator');
            
            if (landingPage) landingPage.classList.add('hidden');
            if (generator) generator.classList.remove('hidden');
        } catch (error) {
            console.error('Error showing generator:', error);
        }
    }

    showLandingPage() {
        try {
            const landingPage = document.getElementById('landing-page');
            const generator = document.getElementById('video-generator');
            
            if (landingPage) landingPage.classList.remove('hidden');
            if (generator) generator.classList.add('hidden');
        } catch (error) {
            console.error('Error showing landing page:', error);
        }
    }

    scrollToFeatures() {
        try {
            const featuresSection = document.querySelector('.features');
            if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: 'smooth' });
            }
        } catch (error) {
            console.error('Error scrolling to features:', error);
        }
    }

    selectStoryType(typeId) {
        try {
            this.currentStoryType = typeId;
            
            // Update UI
            const cards = document.querySelectorAll('.story-type-card');
            cards.forEach(card => {
                if (card.dataset.type === typeId) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            });
        } catch (error) {
            console.error('Error selecting story type:', error);
        }
    }

    updateDuration(value) {
        try {
            this.duration = parseInt(value);
            const display = document.getElementById('duration-value');
            if (display) {
                display.textContent = value;
            }
        } catch (error) {
            console.error('Error updating duration:', error);
        }
    }

    updateSpeechRate(value) {
        try {
            this.speechRate = parseFloat(value);
            const display = document.getElementById('speech-rate-value');
            if (display) {
                display.textContent = value + 'x';
            }
        } catch (error) {
            console.error('Error updating speech rate:', error);
        }
    }

    updateVoice(voiceId) {
        try {
            this.currentVoice = this.data.voiceOptions.find(v => v.id === voiceId);
        } catch (error) {
            console.error('Error updating voice:', error);
        }
    }

    updateBackground(backgroundId) {
        try {
            this.currentBackground = backgroundId;
        } catch (error) {
            console.error('Error updating background:', error);
        }
    }

    previewVoice() {
        try {
            if (!this.currentVoice) return;
            
            // Stop any current speech
            speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance("Hello! This is how I'll narrate your story. I hope you like my voice!");
            utterance.pitch = this.currentVoice.pitch;
            utterance.rate = this.speechRate;
            
            speechSynthesis.speak(utterance);
        } catch (error) {
            console.error('Error previewing voice:', error);
            alert('Voice preview not available in this browser.');
        }
    }

    generateStory() {
        if (!this.currentStoryType) {
            alert('Please select a story type first.');
            return;
        }

        this.showLoading();
        
        // Simulate AI processing time
        setTimeout(() => {
            try {
                const story = this.createAIStory(this.currentStoryType, this.duration);
                this.displayStory(story);
                this.hideLoading();
                
                const createVideoBtn = document.getElementById('create-video-btn');
                if (createVideoBtn) {
                    createVideoBtn.disabled = false;
                }
            } catch (error) {
                console.error('Error generating story:', error);
                this.hideLoading();
                alert('Error generating story. Please try again.');
            }
        }, 1500);
    }

    createAIStory(type, durationMinutes) {
        const targetWords = Math.floor(durationMinutes * 140); // ~140 words per minute for speech
        
        const templates = {
            aita: {
                titles: [
                    "AITA for refusing to attend my sister's wedding after what she did?",
                    "AITA for not letting my roommate use my car anymore?",
                    "AITA for telling my coworker the truth about their performance?",
                    "AITA for keeping my inheritance instead of sharing it?",
                    "AITA for not inviting my brother to my graduation party?"
                ],
                openings: [
                    "So this happened last week and I'm still not sure if I handled it right.",
                    "I never thought I'd be posting here, but my family is divided on this.",
                    "This situation has been eating at me and I need outside perspective.",
                    "My friends are split on whether I was justified, so here I am."
                ],
                conflicts: [
                    "Long story short, they completely betrayed my trust by sharing my personal information with everyone.",
                    "They borrowed something important without asking and ended up breaking it completely.",
                    "They made a scene at a family gathering and embarrassed me in front of everyone.",
                    "They went behind my back and tried to sabotage something really important to me.",
                    "They broke a promise that meant everything to me and acted like it was no big deal."
                ]
            },
            tifu: {
                titles: [
                    "TIFU by accidentally sending a text meant for my friend to my boss",
                    "TIFU by trying to impress someone and making a complete fool of myself",
                    "TIFU by misunderstanding instructions and causing chaos at work",
                    "TIFU by thinking I was being clever but actually being incredibly stupid",
                    "TIFU by not checking something properly and paying the consequences"
                ],
                openings: [
                    "This literally just happened and I'm still cringing about it.",
                    "So I thought I was being smart, but boy was I wrong.",
                    "I should have known better, but hindsight is 20/20.",
                    "What started as a normal day quickly turned into a disaster."
                ],
                mistakes: [
                    "I completely misread the situation and did something incredibly embarrassing.",
                    "I tried to take a shortcut and ended up making everything ten times worse.",
                    "I assumed something that was completely wrong and acted on it.",
                    "I got overconfident and made a rookie mistake that everyone noticed."
                ]
            },
            relationship: {
                titles: [
                    "My partner keeps doing something that bothers me - how do I address it?",
                    "Found out something about my relationship that changes everything",
                    "My friend is dating someone I think is wrong for them",
                    "Having trust issues in my relationship and don't know what to do",
                    "Caught in the middle of drama between my partner and my family"
                ],
                openings: [
                    "I've been with my partner for two years and this issue keeps coming up.",
                    "This situation is really testing our relationship and I need advice.",
                    "I love them but this behavior is becoming a real problem.",
                    "We've been together for a while but this is new territory for us."
                ],
                dilemmas: [
                    "They don't seem to understand how their actions affect me emotionally.",
                    "There's a communication gap that we can't seem to bridge despite trying.",
                    "They have habits that clash with my values and it's causing tension.",
                    "I'm not sure if I'm being unreasonable or if my concerns are valid."
                ]
            }
        };

        const template = templates[type];
        const title = this.randomChoice(template.titles);
        const opening = this.randomChoice(template.openings);
        
        let content = opening + " " + title + "\n\n";
        
        // Generate main content based on type
        if (type === 'aita') {
            content += this.randomChoice(template.conflicts);
            content += "\n\nI told them exactly how I felt and said I wouldn't be part of this anymore. ";
            content += "They called me selfish and said I was overreacting. ";
            content += "Now half my family thinks I'm being petty and the other half supports my decision. ";
            content += "I'm starting to wonder if I went too far, but I also feel like I had to stand up for myself. ";
        } else if (type === 'tifu') {
            content += this.randomChoice(template.mistakes);
            content += "\n\nEveryone saw what happened and I wanted to disappear into the floor. ";
            content += "The worst part is that I kept trying to fix it but only made things more awkward. ";
            content += "Now it's become this whole thing that people keep bringing up. ";
            content += "I learned my lesson the hard way - always double-check everything. ";
        } else if (type === 'relationship') {
            content += this.randomChoice(template.dilemmas);
            content += "\n\nI've tried talking to them about it but conversations go nowhere. ";
            content += "They either get defensive or promise to change but nothing actually happens. ";
            content += "I'm at the point where I don't know if this is something we can work through. ";
            content += "Part of me wonders if I'm expecting too much or if my standards are reasonable. ";
        }

        // Add padding content to reach target word count
        const currentWords = content.split(' ').length;
        if (currentWords < targetWords) {
            const additionalContent = this.generatePaddingContent(type, targetWords - currentWords);
            content += additionalContent;
        }

        content += "\n\nUpdate: Thanks for all the comments. Really helps to get outside perspective on this.";

        return {
            title: title,
            content: content,
            type: type,
            wordCount: content.split(' ').length,
            estimatedDuration: Math.ceil(content.split(' ').length / 140)
        };
    }

    generatePaddingContent(type, wordsNeeded) {
        const paddingPhrases = {
            aita: [
                "I keep going over this in my head wondering if I could have handled it differently. ",
                "My friends say I did the right thing but my family is making me second-guess myself. ",
                "The whole situation has been really stressful and I just want it resolved. ",
                "I never expected things to escalate this far over something that seemed straightforward. ",
                "Everyone has opinions but I'm the one who has to live with the consequences. "
            ],
            tifu: [
                "I'm usually pretty careful about these things so I don't know what got into me. ",
                "The embarrassment is real and I keep replaying it in my head. ",
                "I should have trusted my instincts instead of trying to be clever. ",
                "Now I have to face these people every day knowing they remember what happened. ",
                "At least it's a good story now, even if it was mortifying at the time. "
            ],
            relationship: [
                "I really want this to work out but I'm running out of patience. ",
                "Communication is supposed to be key but we're clearly not on the same page. ",
                "I don't want to give ultimatums but I also can't keep feeling this way. ",
                "Maybe couples therapy could help but they're not enthusiastic about the idea. ",
                "I love them but I'm starting to wonder if love is enough to fix this. "
            ]
        };

        let padding = "";
        const phrases = paddingPhrases[type];
        
        while (padding.split(' ').length < wordsNeeded) {
            padding += this.randomChoice(phrases);
        }

        return "\n\n" + padding.trim();
    }

    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    displayStory(story) {
        try {
            this.currentStory = story;
            const storyPreview = document.getElementById('story-preview');
            if (!storyPreview) return;
            
            storyPreview.innerHTML = `
                <div class="story-content">
                    <h3>${story.title}</h3>
                    <div class="story-body">${story.content.replace(/\n/g, '<br>')}</div>
                    <div class="story-meta">
                        <span>📝 ${story.wordCount} words</span>
                        <span>⏱️ ~${story.estimatedDuration} min read</span>
                        <span>🏷️ ${story.type.toUpperCase()}</span>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error displaying story:', error);
        }
    }

    async createVideo() {
        if (!this.currentStory || this.isGenerating) return;
        
        try {
            this.isGenerating = true;
            this.showVideoProgress();
            
            const canvas = document.getElementById('video-canvas');
            if (!canvas) {
                throw new Error('Canvas element not found');
            }
            
            const ctx = canvas.getContext('2d');
            
            // Setup canvas for TikTok dimensions
            canvas.width = 1080;
            canvas.height = 1920;
            
            // Simulate video creation process
            await this.simulateVideoCreation();
            
        } catch (error) {
            console.error('Error creating video:', error);
            this.hideVideoProgress();
            this.isGenerating = false;
            alert('Error creating video. Please try again.');
        }
    }

    async simulateVideoCreation() {
        return new Promise((resolve) => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 10;
                this.updateProgress(Math.min(progress, 100));
                
                if (progress >= 100) {
                    clearInterval(interval);
                    this.finishVideoSimulation();
                    resolve();
                }
            }, 300);
        });
    }

    finishVideoSimulation() {
        try {
            this.hideVideoProgress();
            
            // Create a dummy blob for demonstration
            this.videoBlob = new Blob(['fake video data'], { type: 'video/webm' });
            
            const downloadBtn = document.getElementById('download-video-btn');
            if (downloadBtn) {
                downloadBtn.classList.remove('hidden');
            }
            
            this.isGenerating = false;
            
            // Show completion message
            const progressText = document.getElementById('progress-text');
            if (progressText) {
                progressText.textContent = 'Video generated successfully!';
            }
        } catch (error) {
            console.error('Error finishing video simulation:', error);
        }
    }

    showVideoProgress() {
        try {
            const container = document.getElementById('video-preview-container');
            const indicator = document.getElementById('progress-indicator');
            
            if (container) container.classList.remove('hidden');
            if (indicator) indicator.classList.remove('hidden');
        } catch (error) {
            console.error('Error showing video progress:', error);
        }
    }

    hideVideoProgress() {
        try {
            const indicator = document.getElementById('progress-indicator');
            if (indicator) indicator.classList.add('hidden');
        } catch (error) {
            console.error('Error hiding video progress:', error);
        }
    }

    updateProgress(percent) {
        try {
            const fill = document.getElementById('progress-fill');
            const text = document.getElementById('progress-text');
            
            if (fill) fill.style.width = percent + '%';
            if (text) text.textContent = `Generating video... ${Math.round(percent)}%`;
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    }

    downloadVideo() {
        try {
            if (!this.videoBlob) return;
            
            // For demonstration, create a text file instead
            const content = `FacelessAI Video - ${this.currentStory?.title || 'Generated Story'}
            
Generated on: ${new Date().toLocaleString()}
Story Type: ${this.currentStory?.type || 'Unknown'}
Duration: ${this.duration} minutes
Voice: ${this.currentVoice?.name || 'Default'}
Background: ${this.currentBackground}

Story Content:
${this.currentStory?.content || 'No story content'}

Note: This is a demo file. In the full version, this would be a TikTok-compatible MP4 video.`;
            
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `faceless-ai-video-${Date.now()}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading video:', error);
            alert('Error downloading video. Please try again.');
        }
    }

    showLoading() {
        try {
            const overlay = document.getElementById('loading-overlay');
            if (overlay) overlay.classList.remove('hidden');
        } catch (error) {
            console.error('Error showing loading:', error);
        }
    }

    hideLoading() {
        try {
            const overlay = document.getElementById('loading-overlay');
            if (overlay) overlay.classList.add('hidden');
        } catch (error) {
            console.error('Error hiding loading:', error);
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Ensure any loading states are cleared
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
        }
        
        // Initialize the app
        window.facelessAI = new FacelessAI();
        console.log('FacelessAI application initialized successfully');
    } catch (error) {
        console.error('Failed to start FacelessAI application:', error);
        
        // Hide loading overlay even if there's an error
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
        }
    }
});