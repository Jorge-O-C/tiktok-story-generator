// TikTok Story Generator Application
class TikTokStoryGenerator {
    constructor() {
        this.currentCategory = null;
        this.currentStory = null;
        this.currentConfig = {
            duration: 5,
            voice: 'default',
            background: 'minecraft'
        };
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.canvas = null;
        this.ctx = null;
        this.isRecording = false;
        this.animationFrame = null;
        this.recordingStartTime = null;
        this.speechUtterance = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupCanvas();
        this.loadData();
    }

    loadData() {
        // Story generation data
        this.storyData = {
            categories: [
                { id: "aita", name: "AITA", fullName: "Am I The Asshole", subreddit: "r/AmItheAsshole" },
                { id: "tifu", name: "TIFU", fullName: "Today I F***ed Up", subreddit: "r/tifu" },
                { id: "relationship", name: "Relationship Advice", fullName: "Relationship Advice", subreddit: "r/relationship_advice" }
            ],
            characters: ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Avery", "Drew", "Blake", "Sage"],
            ages: ["19", "22", "25", "28", "31", "24", "26", "29", "23", "27"],
            locations: ["coffee shop", "workplace", "apartment", "university", "gym", "restaurant", "park", "mall", "library", "grocery store"],
            relationships: ["girlfriend", "boyfriend", "best friend", "roommate", "coworker", "family member", "neighbor", "classmate"],
            conflicts: ["betrayed trust", "financial dispute", "boundary violation", "communication breakdown", "jealousy issue", "privacy breach"],
            emotions: ["furious", "devastated", "confused", "hurt", "frustrated", "disappointed", "shocked", "angry"]
        };

        this.voiceSettings = {
            default: { rate: 1.0, pitch: 1.0 },
            slow: { rate: 0.8, pitch: 1.1 },
            fast: { rate: 1.3, pitch: 1.2 },
            deep: { rate: 0.9, pitch: 0.8 }
        };
    }

    setupEventListeners() {
        // Category selection
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => this.selectCategory(card.dataset.category));
        });

        // Navigation buttons
        document.getElementById('back-to-categories').addEventListener('click', () => this.showSection('category-section'));
        document.getElementById('back-to-config').addEventListener('click', () => this.showSection('config-section'));
        document.getElementById('back-to-story').addEventListener('click', () => this.showSection('story-section'));

        // Duration slider
        document.getElementById('duration-slider').addEventListener('input', (e) => this.updateDuration(e.target.value));

        // Configuration controls
        document.getElementById('voice-select').addEventListener('change', (e) => this.currentConfig.voice = e.target.value);
        document.getElementById('background-select').addEventListener('change', (e) => this.currentConfig.background = e.target.value);

        // Action buttons
        document.getElementById('generate-story').addEventListener('click', () => this.generateStory());
        document.getElementById('regenerate-story').addEventListener('click', () => this.generateStory());
        document.getElementById('create-video').addEventListener('click', () => this.showVideoSection());
        
        // Video controls
        document.getElementById('start-recording').addEventListener('click', () => this.startRecording());
        document.getElementById('stop-recording').addEventListener('click', () => this.stopRecording());
        
        // Download and reset
        document.getElementById('download-video').addEventListener('click', () => this.downloadVideo());
        document.getElementById('create-another').addEventListener('click', () => this.resetApplication());
    }

    setupCanvas() {
        this.canvas = document.getElementById('video-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set actual canvas size for recording (TikTok specs)
        this.canvas.width = 1080;
        this.canvas.height = 1920;
        
        // Initialize canvas
        this.clearCanvas();
    }

    selectCategory(categoryId) {
        this.currentCategory = categoryId;
        
        // Update UI
        document.querySelectorAll('.category-card').forEach(card => {
            card.classList.remove('category-card--selected');
        });
        document.querySelector(`[data-category="${categoryId}"]`).classList.add('category-card--selected');
        
        // Show configuration section
        setTimeout(() => this.showSection('config-section'), 300);
    }

    updateDuration(value) {
        this.currentConfig.duration = parseInt(value);
        document.getElementById('duration-value').textContent = value;
        document.getElementById('word-count').textContent = value * 140; // 140 words per minute
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('section--active');
        });
        
        // Show target section
        document.getElementById(sectionId).classList.add('section--active');
    }

    generateStory() {
        const category = this.storyData.categories.find(cat => cat.id === this.currentCategory);
        const targetWords = this.currentConfig.duration * 140;
        
        // Generate story components
        const character = this.getRandomElement(this.storyData.characters);
        const age = this.getRandomElement(this.storyData.ages);
        const location = this.getRandomElement(this.storyData.locations);
        const relationship = this.getRandomElement(this.storyData.relationships);
        const conflict = this.getRandomElement(this.storyData.conflicts);
        const emotion = this.getRandomElement(this.storyData.emotions);
        
        // Generate story based on category
        let story;
        switch (this.currentCategory) {
            case 'aita':
                story = this.generateAITAStory(character, age, location, relationship, conflict, emotion, targetWords);
                break;
            case 'tifu':
                story = this.generateTIFUStory(character, age, location, relationship, conflict, emotion, targetWords);
                break;
            case 'relationship':
                story = this.generateRelationshipStory(character, age, location, relationship, conflict, emotion, targetWords);
                break;
        }
        
        this.currentStory = story;
        this.displayStory(story, category);
        this.showSection('story-section');
    }

    generateAITAStory(character, age, location, relationship, conflict, emotion, targetWords) {
        const title = `AITA for confronting my ${relationship} about ${conflict}?`;
        
        const content = `I (${age}M/F) have been with my ${relationship} ${character} for about 2 years now. We usually get along great, but something happened recently at ${location} that has me questioning everything.

So last week, I discovered that ${character} had ${conflict}. When I found out, I was absolutely ${emotion}. I mean, who does that to someone they supposedly care about?

I tried to talk to them about it calmly at first, but they kept deflecting and making excuses. They said I was overreacting and that it "wasn't that big of a deal." But to me, this felt like a huge violation of trust.

The situation escalated when I brought it up again yesterday. ${character} got defensive and started turning it around on me, saying I was being controlling and paranoid. They even brought up some completely unrelated stuff from months ago to try to deflect.

I ended up raising my voice (which I rarely do) and told them exactly how their actions made me feel. I said that if they couldn't understand why this was wrong, then maybe we needed to reconsider our relationship.

Now they're giving me the silent treatment and some of our mutual friends are saying I went too far. They think I should just "let it go" and move on. But I feel like I have every right to be upset about this.

My family is split - my sister thinks I'm completely justified, but my mom says relationships require compromise and I should try to work it out.

I'm starting to doubt myself. Maybe I did overreact? But at the same time, I feel like if I just let this slide, it sets a precedent that they can get away with anything.

So Reddit, AITA for confronting my ${relationship} about this? Should I have handled it differently?`;

        const tldr = `Confronted my ${relationship} about ${conflict}, they got defensive and now friends think I overreacted.`;
        
        return { title, content, tldr };
    }

    generateTIFUStory(character, age, location, relationship, conflict, emotion, targetWords) {
        const title = `TIFU by accidentally causing ${conflict} with my ${relationship}`;
        
        const content = `This happened yesterday and I'm still ${emotion} about it.

So I (${age}M/F) was at ${location} with my ${relationship} ${character}. Everything was going perfectly fine until I made what I thought was a harmless decision that turned into a complete disaster.

For context, ${character} and I have been close for about 2 years, and they've always been understanding about my occasional lapses in judgment. But this time, I really crossed a line without realizing it.

It started when I noticed something that seemed off. Instead of asking ${character} about it directly, I decided to investigate on my own. I thought I was being helpful and looking out for them. Big mistake.

What I didn't know was that my "investigation" would lead to ${conflict}. I accidentally uncovered some private information that I definitely wasn't supposed to see. And being the brilliant person I am, I panicked and made it so much worse.

Instead of coming clean immediately, I tried to cover my tracks. I thought I could fix everything before ${character} found out. Spoiler alert: I could not.

${character} discovered what happened when they came home early from work. The look of betrayal on their face will haunt me forever. They weren't just angry - they were deeply hurt that I had violated their privacy and then tried to hide it.

The worst part? They had a perfectly reasonable explanation for everything I was suspicious about. If I had just asked them directly, none of this would have happened.

Now they won't talk to me, and I don't blame them. I completely ${conflict} and destroyed their trust. Our mutual friends are disappointed in me too, and I feel like I've ruined one of the most important relationships in my life.

I've tried apologizing, but ${character} says they need time to think about whether they can forgive me. I'm worried I've permanently damaged our friendship.`;

        const tldr = `Tried to secretly investigate something about my ${relationship}, accidentally caused ${conflict} and destroyed their trust.`;
        
        return { title, content, tldr };
    }

    generateRelationshipStory(character, age, location, relationship, conflict, emotion, targetWords) {
        const title = `My ${relationship} (${age}M/F) and I are having issues with ${conflict} - need advice`;
        
        const content = `I (${age}M/F) have been with my ${relationship} ${character} for about 18 months now. Overall, our relationship has been amazing, but we've hit a major roadblock that's making me question our future together.

The issue started about a month ago when we had a disagreement about ${conflict}. At first, I thought it was just a minor bump that we could work through with some communication. But it's become clear that this runs much deeper than I initially realized.

${character} and I have very different perspectives on this situation. They think I'm being unreasonable and overly sensitive, while I feel like they're dismissing my legitimate concerns. Every time we try to discuss it, the conversation turns into an argument.

Last week, things came to a head when we were at ${location}. ${character} made a comment that really hurt me, and I ended up feeling ${emotion} and walking away from the conversation. They followed me and said I was being dramatic, which just made everything worse.

The problem is that we can't seem to find a middle ground. ${character} wants me to just accept their point of view and move on, but I feel like my feelings aren't being validated. When I try to explain why this matters to me, they get frustrated and say I'm overthinking everything.

I love ${character}, and I can see a future with them, but this issue is creating a lot of tension between us. It's affecting other areas of our relationship too - we're not as affectionate as we used to be, and there's this underlying tension whenever we're together.

I've suggested couples counseling, but ${character} thinks that's "too much" for a relationship that's not even two years old. They think we should be able to work this out on our own.

My friends are divided on the advice they're giving me. Some say that if we can't resolve this, maybe we're not compatible long-term. Others think every relationship has challenges and this is just something we need to push through.

I'm really torn because I don't want to throw away something good over one issue, but I also can't ignore how this is making me feel.`;

        const tldr = `${relationship} and I can't agree on ${conflict}, causing ongoing tension and making me question our compatibility.`;
        
        return { title, content, tldr };
    }

    displayStory(story, category) {
        document.getElementById('story-subreddit').textContent = category.subreddit;
        document.getElementById('story-title').textContent = story.title;
        document.getElementById('story-content').textContent = story.content;
        document.getElementById('story-tldr').textContent = story.tldr;
    }

    showVideoSection() {
        this.showSection('video-section');
        this.setupVideoGeneration();
    }

    setupVideoGeneration() {
        // Clear any previous recordings
        this.recordedChunks = [];
        this.clearCanvas();
        this.updateStatus('Ready to record');
        this.updateProgress(0);
        
        // Reset UI
        document.getElementById('start-recording').disabled = false;
        document.getElementById('stop-recording').disabled = true;
        document.getElementById('download-section').style.display = 'none';
    }

    async startRecording() {
        try {
            // Validate story exists
            if (!this.currentStory) {
                this.updateStatus('Error: No story generated');
                return;
            }

            // Reset recording state
            this.recordedChunks = [];
            this.isRecording = false;
            
            // Setup canvas stream
            const stream = this.canvas.captureStream(30);
            
            // Create audio context for TTS
            await this.setupAudioRecording(stream);
            
            // Setup MediaRecorder with proper error handling
            const options = this.getRecorderOptions();
            this.mediaRecorder = new MediaRecorder(stream, options);
            
            // Setup event handlers
            this.setupRecorderEvents();
            
            // Start recording
            this.mediaRecorder.start(1000); // Collect data every second
            this.isRecording = true;
            this.recordingStartTime = Date.now();
            
            // Update UI
            document.getElementById('start-recording').disabled = true;
            document.getElementById('stop-recording').disabled = false;
            this.updateStatus('Recording...');
            
            // Start video generation
            this.startVideoGeneration();
            
        } catch (error) {
            console.error('Failed to start recording:', error);
            this.updateStatus('Error: Failed to start recording');
            this.resetRecording();
        }
    }

    async setupAudioRecording(videoStream) {
        try {
            // Create audio context
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const destination = audioContext.createMediaStreamDestination();
            
            // Add audio track to video stream
            destination.stream.getAudioTracks().forEach(track => {
                videoStream.addTrack(track);
            });
            
            // Setup TTS
            this.setupTextToSpeech(audioContext, destination);
            
        } catch (error) {
            console.warn('Audio setup failed, continuing with video only:', error);
        }
    }

    setupTextToSpeech(audioContext, destination) {
        if ('speechSynthesis' in window) {
            const fullText = `${this.currentStory.title}. ${this.currentStory.content}. TL;DR: ${this.currentStory.tldr}`;
            
            this.speechUtterance = new SpeechSynthesisUtterance(fullText);
            const voiceSettings = this.voiceSettings[this.currentConfig.voice];
            
            this.speechUtterance.rate = voiceSettings.rate;
            this.speechUtterance.pitch = voiceSettings.pitch;
            this.speechUtterance.volume = 1.0;
            
            // Start TTS after a short delay
            setTimeout(() => {
                if (this.isRecording) {
                    window.speechSynthesis.speak(this.speechUtterance);
                }
            }, 500);
        }
    }

    getRecorderOptions() {
        // Try different MIME types for best compatibility
        const mimeTypes = [
            'video/webm;codecs=vp9,opus',
            'video/webm;codecs=vp8,opus',
            'video/webm;codecs=h264,opus',
            'video/webm',
            'video/mp4'
        ];
        
        for (const mimeType of mimeTypes) {
            if (MediaRecorder.isTypeSupported(mimeType)) {
                return { mimeType, videoBitsPerSecond: 8000000 };
            }
        }
        
        return {}; // Use default
    }

    setupRecorderEvents() {
        this.mediaRecorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
                this.recordedChunks.push(event.data);
            }
        };
        
        this.mediaRecorder.onstop = () => {
            this.handleRecordingComplete();
        };
        
        this.mediaRecorder.onerror = (event) => {
            console.error('MediaRecorder error:', event.error);
            this.updateStatus('Recording error occurred');
            this.resetRecording();
        };
    }

    startVideoGeneration() {
        this.renderVideoFrame();
        this.startTimer();
    }

    renderVideoFrame() {
        if (!this.isRecording) return;
        
        // Clear canvas
        this.clearCanvas();
        
        // Render background
        this.renderBackground();
        
        // Render text content
        this.renderTextContent();
        
        // Continue animation
        this.animationFrame = requestAnimationFrame(() => this.renderVideoFrame());
    }

    clearCanvas() {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderBackground() {
        const time = Date.now() * 0.001;
        
        switch (this.currentConfig.background) {
            case 'minecraft':
                this.renderMinecraftBackground(time);
                break;
            case 'nature':
                this.renderNatureBackground(time);
                break;
            case 'urban':
                this.renderUrbanBackground(time);
                break;
            case 'abstract':
                this.renderAbstractBackground(time);
                break;
            case 'ocean':
                this.renderOceanBackground(time);
                break;
        }
    }

    renderMinecraftBackground(time) {
        const blockSize = 80;
        const colors = ['#8B4513', '#228B22', '#A0522D', '#556B2F'];
        
        for (let x = 0; x < this.canvas.width; x += blockSize) {
            for (let y = 0; y < this.canvas.height; y += blockSize) {
                const colorIndex = Math.floor(Math.sin(time + x * 0.01 + y * 0.01) * 2 + 2) % colors.length;
                this.ctx.fillStyle = colors[colorIndex];
                this.ctx.fillRect(x, y, blockSize, blockSize);
                
                // Add border
                this.ctx.strokeStyle = '#000000';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(x, y, blockSize, blockSize);
            }
        }
    }

    renderNatureBackground(time) {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, `hsl(${120 + Math.sin(time * 0.5) * 20}, 70%, 40%)`);
        gradient.addColorStop(0.5, `hsl(${100 + Math.sin(time * 0.3) * 15}, 60%, 50%)`);
        gradient.addColorStop(1, `hsl(${80 + Math.sin(time * 0.2) * 10}, 50%, 30%)`);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderUrbanBackground(time) {
        // Dark cityscape base
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Neon accents
        const neonColors = ['#ff0080', '#00ff80', '#8000ff', '#ff8000'];
        neonColors.forEach((color, i) => {
            this.ctx.fillStyle = color;
            this.ctx.globalAlpha = 0.3 + Math.sin(time * 2 + i) * 0.2;
            this.ctx.fillRect(i * (this.canvas.width / 4), 0, this.canvas.width / 4, this.canvas.height);
        });
        this.ctx.globalAlpha = 1;
    }

    renderAbstractBackground(time) {
        const colors = ['#FF0050', '#25F4EE', '#8000ff', '#ff8000'];
        
        for (let i = 0; i < 5; i++) {
            const x = Math.sin(time * 0.5 + i) * this.canvas.width * 0.3 + this.canvas.width * 0.5;
            const y = Math.cos(time * 0.3 + i) * this.canvas.height * 0.3 + this.canvas.height * 0.5;
            const radius = 200 + Math.sin(time + i) * 100;
            
            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, colors[i % colors.length] + '80');
            gradient.addColorStop(1, colors[i % colors.length] + '00');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    renderOceanBackground(time) {
        // Ocean gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#4169e1');
        gradient.addColorStop(1, '#000080');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Wave pattern
        this.ctx.strokeStyle = '#ffffff40';
        this.ctx.lineWidth = 3;
        for (let y = 100; y < this.canvas.height; y += 100) {
            this.ctx.beginPath();
            for (let x = 0; x <= this.canvas.width; x += 10) {
                const waveY = y + Math.sin((x + time * 100) * 0.01) * 30;
                if (x === 0) {
                    this.ctx.moveTo(x, waveY);
                } else {
                    this.ctx.lineTo(x, waveY);
                }
            }
            this.ctx.stroke();
        }
    }

    renderTextContent() {
        if (!this.currentStory) return;
        
        const padding = 60;
        const maxWidth = this.canvas.width - (padding * 2);
        
        // Setup text style
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 48px Arial, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';
        
        // Add text shadow
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = 2;
        
        // Render title
        const titleY = 200;
        this.wrapText(this.currentStory.title, this.canvas.width / 2, titleY, maxWidth, 60);
        
        // Render content (first few lines)
        this.ctx.font = '36px Arial, sans-serif';
        const contentY = titleY + 200;
        const contentLines = this.currentStory.content.substring(0, 200) + '...';
        this.wrapText(contentLines, this.canvas.width / 2, contentY, maxWidth, 50);
        
        // Reset shadow
        this.ctx.shadowColor = 'transparent';
    }

    wrapText(text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = this.ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && n > 0) {
                this.ctx.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        this.ctx.fillText(line, x, y);
    }

    startTimer() {
        const updateTimer = () => {
            if (!this.isRecording) return;
            
            const elapsed = Date.now() - this.recordingStartTime;
            const seconds = Math.floor(elapsed / 1000);
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            
            document.getElementById('recording-timer').textContent = 
                `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            
            // Update progress (estimate based on duration)
            const targetDuration = this.currentConfig.duration * 60 * 1000;
            const progress = Math.min((elapsed / targetDuration) * 100, 100);
            this.updateProgress(progress);
            
            // Auto-stop after target duration
            if (elapsed >= targetDuration) {
                this.stopRecording();
                return;
            }
            
            setTimeout(updateTimer, 1000);
        };
        
        updateTimer();
    }

    stopRecording() {
        if (!this.isRecording || !this.mediaRecorder) return;
        
        this.isRecording = false;
        
        // Stop animation
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        // Stop TTS
        if (this.speechUtterance) {
            window.speechSynthesis.cancel();
        }
        
        // Stop MediaRecorder
        this.mediaRecorder.stop();
        
        // Update UI
        document.getElementById('start-recording').disabled = false;
        document.getElementById('stop-recording').disabled = true;
        this.updateStatus('Processing video...');
    }

    handleRecordingComplete() {
        if (this.recordedChunks.length === 0) {
            this.updateStatus('Error: No video data recorded');
            this.resetRecording();
            return;
        }
        
        try {
            // Create blob from recorded chunks
            const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
            
            if (blob.size === 0) {
                throw new Error('Empty video blob');
            }
            
            // Create download URL
            this.videoBlob = blob;
            this.updateStatus('Video ready for download!');
            this.updateProgress(100);
            
            // Show download section
            document.getElementById('download-section').style.display = 'block';
            
        } catch (error) {
            console.error('Failed to process recording:', error);
            this.updateStatus('Error: Failed to process video');
            this.resetRecording();
        }
    }

    downloadVideo() {
        if (!this.videoBlob) {
            this.updateStatus('Error: No video available');
            return;
        }
        
        try {
            const url = URL.createObjectURL(this.videoBlob);
            const a = document.createElement('a');
            const timestamp = new Date().toISOString().slice(0, 19).replace(/[:\-T]/g, '');
            
            a.href = url;
            a.download = `tiktok-story-${this.currentCategory}-${timestamp}.webm`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            // Clean up URL
            setTimeout(() => URL.revokeObjectURL(url), 1000);
            
            this.updateStatus('Video downloaded successfully!');
            
        } catch (error) {
            console.error('Download failed:', error);
            this.updateStatus('Error: Download failed');
        }
    }

    resetRecording() {
        this.isRecording = false;
        this.recordedChunks = [];
        this.mediaRecorder = null;
        this.videoBlob = null;
        
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        document.getElementById('start-recording').disabled = false;
        document.getElementById('stop-recording').disabled = true;
        document.getElementById('download-section').style.display = 'none';
    }

    resetApplication() {
        this.resetRecording();
        this.currentCategory = null;
        this.currentStory = null;
        this.clearCanvas();
        
        // Reset UI
        document.querySelectorAll('.category-card').forEach(card => {
            card.classList.remove('category-card--selected');
        });
        
        this.showSection('category-section');
    }

    updateStatus(message) {
        document.getElementById('status-text').textContent = message;
    }

    updateProgress(percentage) {
        document.getElementById('progress-fill').style.width = `${percentage}%`;
    }

    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TikTokStoryGenerator();
});