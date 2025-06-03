// TikTok Story Generator JavaScript

class TikTokStoryGenerator {
    constructor() {
        this.currentTheme = 'light';
        this.selectedStoryType = 'aita';
        this.selectedBackground = 'minecraft';
        this.selectedVoice = 'female-warm';
        this.selectedCaptionStyle = 'classic';
        this.videoLength = 60;
        this.isPlaying = false;
        this.currentTime = 0;
        this.generatedVideo = null;
        
        this.storyTemplates = {
            aita: "AITA for [situation]? So I'm [age][gender] and my [relationship] is [age][gender]. [Context setup]. [Incident description]. [Consequences]. [Asking for judgment]. Edit: [Update].",
            tifu: "TIFU by [action]. This happened [timeframe]. [Background context]. [The mistake]. [Immediate consequences]. [Aftermath]. TL;DR: [Summary].",
            relationship: "Need advice about [situation] with my [relationship type]. [Background]. [Current problem]. [What I've tried]. [Specific questions]. Update: [Resolution]."
        };
        
        this.voices = {
            'male-deep': 'Male - Deep',
            'female-warm': 'Female - Warm',
            'male-young': 'Male - Young',
            'female-professional': 'Female - Professional',
            'neutral-clear': 'Neutral - Clear'
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updatePreview();
        this.detectSystemTheme();
    }
    
    bindEvents() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
        
        // Story type selection
        document.querySelectorAll('.story-type').forEach(element => {
            element.addEventListener('click', (e) => this.selectStoryType(e.currentTarget.dataset.type));
        });
        
        // Use template button
        document.getElementById('useTemplate').addEventListener('click', () => this.useTemplate());
        
        // Story text changes
        document.getElementById('storyText').addEventListener('input', () => this.updatePreview());
        
        // Length slider
        const lengthSlider = document.getElementById('lengthSlider');
        lengthSlider.addEventListener('input', (e) => this.updateLength(e.target.value));
        
        // Background selection
        document.querySelectorAll('.background-option').forEach(element => {
            element.addEventListener('click', (e) => this.selectBackground(e.currentTarget.dataset.bg));
        });
        
        // Voice selection
        document.getElementById('voiceSelect').addEventListener('change', (e) => this.selectVoice(e.target.value));
        document.getElementById('previewVoice').addEventListener('click', () => this.previewVoice());
        
        // Caption style selection
        document.querySelectorAll('.caption-style').forEach(element => {
            element.addEventListener('click', (e) => this.selectCaptionStyle(e.currentTarget.dataset.style));
        });
        
        // Video controls
        document.getElementById('playPause').addEventListener('click', () => this.togglePlayback());
        document.getElementById('timelineSlider').addEventListener('input', (e) => this.seekTo(e.target.value));
        
        // Action buttons
        document.getElementById('generateVideo').addEventListener('click', () => this.generateVideo());
        document.getElementById('resetAll').addEventListener('click', () => this.resetAll());
        document.getElementById('downloadVideo').addEventListener('click', () => this.downloadVideo());
        document.getElementById('shareVideo').addEventListener('click', () => this.shareVideo());
    }
    
    detectSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.currentTheme = 'dark';
            this.updateThemeUI();
        }
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            this.currentTheme = e.matches ? 'dark' : 'light';
            this.updateThemeUI();
        });
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.updateThemeUI();
    }
    
    updateThemeUI() {
        document.documentElement.setAttribute('data-color-scheme', this.currentTheme);
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = themeToggle.querySelector('.theme-icon');
        const themeText = themeToggle.querySelector('.theme-text');
        
        if (this.currentTheme === 'dark') {
            themeIcon.textContent = '☀️';
            themeText.textContent = 'Light';
        } else {
            themeIcon.textContent = '🌙';
            themeText.textContent = 'Dark';
        }
    }
    
    selectStoryType(type) {
        this.selectedStoryType = type;
        
        // Update UI
        document.querySelectorAll('.story-type').forEach(el => el.classList.remove('active'));
        document.querySelector(`.story-type[data-type="${type}"]`).classList.add('active');
        
        this.updatePreview();
    }
    
    useTemplate() {
        const template = this.storyTemplates[this.selectedStoryType];
        document.getElementById('storyText').value = template;
        this.updatePreview();
        
        // Add a subtle animation to show the template was loaded
        const textarea = document.getElementById('storyText');
        textarea.style.transform = 'scale(1.02)';
        setTimeout(() => {
            textarea.style.transform = 'scale(1)';
        }, 200);
    }
    
    updateLength(value) {
        this.videoLength = parseInt(value);
        document.getElementById('lengthValue').textContent = value;
    }
    
    selectBackground(background) {
        this.selectedBackground = background;
        
        // Update UI
        document.querySelectorAll('.background-option').forEach(el => el.classList.remove('active'));
        document.querySelector(`.background-option[data-bg="${background}"]`).classList.add('active');
        
        // Update preview background
        const previewBg = document.getElementById('previewBackground');
        previewBg.className = `preview-background ${background}-bg`;
        
        this.updatePreview();
    }
    
    selectVoice(voice) {
        this.selectedVoice = voice;
        this.updatePreview();
    }
    
    previewVoice() {
        const voiceName = this.voices[this.selectedVoice];
        
        // Create a simple text-to-speech preview
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance("Hello! This is how your story will sound with this voice.");
            
            // Try to match voice characteristics
            const voices = speechSynthesis.getVoices();
            if (voices.length > 0) {
                if (this.selectedVoice.includes('female')) {
                    const femaleVoice = voices.find(voice => voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('woman'));
                    if (femaleVoice) utterance.voice = femaleVoice;
                } else if (this.selectedVoice.includes('male')) {
                    const maleVoice = voices.find(voice => voice.name.toLowerCase().includes('male') || voice.name.toLowerCase().includes('man'));
                    if (maleVoice) utterance.voice = maleVoice;
                }
            }
            
            if (this.selectedVoice.includes('deep')) {
                utterance.pitch = 0.7;
            } else if (this.selectedVoice.includes('young')) {
                utterance.pitch = 1.3;
            }
            
            speechSynthesis.speak(utterance);
        } else {
            this.showNotification('Voice preview not supported in this browser', 'info');
        }
    }
    
    selectCaptionStyle(style) {
        this.selectedCaptionStyle = style;
        
        // Update UI
        document.querySelectorAll('.caption-style').forEach(el => el.classList.remove('active'));
        document.querySelector(`.caption-style[data-style="${style}"]`).classList.add('active');
        
        this.updatePreview();
    }
    
    updatePreview() {
        const storyText = document.getElementById('storyText').value;
        const previewText = document.getElementById('previewText');
        
        if (storyText.trim()) {
            // Show first few words of the story
            const words = storyText.split(' ').slice(0, 8).join(' ');
            previewText.textContent = words + (storyText.split(' ').length > 8 ? '...' : '');
        } else {
            previewText.textContent = 'Your story will appear here...';
        }
        
        // Apply caption style
        previewText.className = `preview-text ${this.selectedCaptionStyle === 'classic' ? 'tiktok-classic' : 
                                                this.selectedCaptionStyle === 'modern' ? 'modern-clean' : 'bold-impact'}`;
    }
    
    togglePlayback() {
        this.isPlaying = !this.isPlaying;
        const playPauseBtn = document.getElementById('playPause');
        
        if (this.isPlaying) {
            playPauseBtn.textContent = '⏸️';
            this.startPlayback();
        } else {
            playPauseBtn.textContent = '▶️';
            this.stopPlayback();
        }
    }
    
    startPlayback() {
        if (!this.playbackInterval) {
            this.playbackInterval = setInterval(() => {
                this.currentTime += 1;
                if (this.currentTime >= this.videoLength) {
                    this.currentTime = this.videoLength;
                    this.stopPlayback();
                }
                this.updateTimeDisplay();
            }, 1000);
        }
    }
    
    stopPlayback() {
        if (this.playbackInterval) {
            clearInterval(this.playbackInterval);
            this.playbackInterval = null;
        }
        this.isPlaying = false;
        document.getElementById('playPause').textContent = '▶️';
    }
    
    seekTo(percentage) {
        this.currentTime = Math.floor((percentage / 100) * this.videoLength);
        this.updateTimeDisplay();
    }
    
    updateTimeDisplay() {
        const timelineSlider = document.getElementById('timelineSlider');
        const currentTimeDisplay = document.getElementById('currentTime');
        
        const percentage = (this.currentTime / this.videoLength) * 100;
        timelineSlider.value = percentage;
        
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = this.currentTime % 60;
        currentTimeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    async generateVideo() {
        const storyText = document.getElementById('storyText').value.trim();
        
        if (!storyText) {
            this.showNotification('Please enter a story before generating the video', 'error');
            return;
        }
        
        const generateBtn = document.getElementById('generateVideo');
        generateBtn.classList.add('loading');
        generateBtn.disabled = true;
        
        try {
            // Simulate video generation process
            await this.simulateVideoGeneration();
            
            // Show success and enable export options
            this.generatedVideo = {
                story: storyText,
                type: this.selectedStoryType,
                background: this.selectedBackground,
                voice: this.selectedVoice,
                captionStyle: this.selectedCaptionStyle,
                length: this.videoLength,
                timestamp: new Date().toISOString()
            };
            
            this.showExportOptions();
            this.showNotification('Video generated successfully! 🎉', 'success');
            
        } catch (error) {
            this.showNotification('Failed to generate video. Please try again.', 'error');
        } finally {
            generateBtn.classList.remove('loading');
            generateBtn.disabled = false;
        }
    }
    
    async simulateVideoGeneration() {
        // Simulate different stages of video generation
        const stages = [
            'Processing story text...',
            'Generating speech audio...',
            'Creating video background...',
            'Adding captions...',
            'Finalizing video...'
        ];
        
        for (let i = 0; i < stages.length; i++) {
            this.updateGenerationStatus(stages[i]);
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
    }
    
    updateGenerationStatus(status) {
        // You could show this status in a modal or status bar
        console.log('Generation Status:', status);
    }
    
    showExportOptions() {
        document.querySelector('.export-options').classList.remove('hidden');
    }
    
    downloadVideo() {
        if (!this.generatedVideo) {
            this.showNotification('No video to download. Please generate a video first.', 'error');
            return;
        }
        
        // Create a JSON file with the video configuration for demonstration
        const videoData = JSON.stringify(this.generatedVideo, null, 2);
        const blob = new Blob([videoData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `tiktok-story-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Video configuration downloaded! 📥', 'success');
    }
    
    shareVideo() {
        if (!this.generatedVideo) {
            this.showNotification('No video to share. Please generate a video first.', 'error');
            return;
        }
        
        if (navigator.share) {
            navigator.share({
                title: 'My TikTok Story Video',
                text: `Check out this ${this.selectedStoryType.toUpperCase()} story I created!`,
                url: window.location.href
            });
        } else {
            // Fallback to copying link
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.showNotification('Link copied to clipboard! 🔗', 'success');
            });
        }
    }
    
    resetAll() {
        if (confirm('Are you sure you want to reset all settings? This will clear your story and reset all options.')) {
            // Reset form values
            document.getElementById('storyText').value = '';
            document.getElementById('lengthSlider').value = 60;
            document.getElementById('lengthValue').textContent = '60';
            document.getElementById('voiceSelect').value = 'female-warm';
            
            // Reset selections
            this.selectedStoryType = 'aita';
            this.selectedBackground = 'minecraft';
            this.selectedVoice = 'female-warm';
            this.selectedCaptionStyle = 'classic';
            this.videoLength = 60;
            this.currentTime = 0;
            this.generatedVideo = null;
            
            // Reset UI
            document.querySelectorAll('.story-type').forEach(el => el.classList.remove('active'));
            document.querySelector('.story-type[data-type="aita"]').classList.add('active');
            
            document.querySelectorAll('.background-option').forEach(el => el.classList.remove('active'));
            document.querySelector('.background-option[data-bg="minecraft"]').classList.add('active');
            
            document.querySelectorAll('.caption-style').forEach(el => el.classList.remove('active'));
            document.querySelector('.caption-style[data-style="classic"]').classList.add('active');
            
            // Hide export options
            document.querySelector('.export-options').classList.add('hidden');
            
            // Stop playback
            this.stopPlayback();
            
            // Update preview
            this.updatePreview();
            this.updateTimeDisplay();
            
            this.showNotification('All settings have been reset', 'info');
        }
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        // Add styles for notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-lg);
            padding: var(--space-16);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            max-width: 400px;
            transform: translateX(100%);
            transition: transform var(--duration-normal) var(--ease-standard);
        `;
        
        const content = notification.querySelector('.notification-content');
        content.style.cssText = `
            display: flex;
            align-items: center;
            gap: var(--space-12);
        `;
        
        const icon = notification.querySelector('.notification-icon');
        icon.style.fontSize = 'var(--font-size-lg)';
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
    
    getNotificationIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TikTokStoryGenerator();
});

// Add some fun easter eggs and interactions
document.addEventListener('keydown', (e) => {
    // Konami code easter egg
    if (e.code === 'Space' && e.ctrlKey) {
        e.preventDefault();
        document.querySelector('.logo-icon').style.animation = 'spin 1s linear';
        setTimeout(() => {
            document.querySelector('.logo-icon').style.animation = '';
        }, 1000);
    }
});

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add intersection observer for animations
if ('IntersectionObserver' in window) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.card').forEach(card => {
        card.style.animationPlayState = 'paused';
        observer.observe(card);
    });
}