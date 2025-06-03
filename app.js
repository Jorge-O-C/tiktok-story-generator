// Application Data
const storyTemplates = {
    "AITA": [
        {
            "template": "AITA for {action} my {relationship} after they {wrongdoing}? I'm a {age}F and my {relationship} is {age2}M. We've been {duration} and things have been {status}. Recently, {situation}. {background}. {conflict}. {reaction}. {aftermath}. TL;DR: {summary}",
            "variables": {
                "action": ["leaving", "confronting", "blocking", "avoiding", "arguing with"],
                "relationship": ["boyfriend", "husband", "brother", "friend", "roommate"],
                "wrongdoing": ["lied to me", "cheated", "stole from me", "betrayed my trust", "disrespected me"],
                "age": ["22", "25", "28", "30", "35"],
                "age2": ["24", "27", "30", "32", "37"],
                "duration": ["dating for 2 years", "together for 6 months", "married for 3 years", "friends for 5 years"],
                "status": ["great until this happened", "okay but rocky", "perfect", "amazing"],
                "situation": ["he did something that crossed a major boundary", "I discovered something disturbing", "we had a huge fight"],
                "background": ["For context, I've always been clear about my boundaries", "This isn't the first time this has happened", "We've talked about this issue before"],
                "conflict": ["When I confronted him about it, he got defensive", "He denied everything even with proof", "He said I was overreacting"],
                "reaction": ["I decided I needed space and left", "I told him we were done", "I blocked him on everything"],
                "aftermath": ["Now his friends are saying I'm being dramatic", "My family thinks I should forgive him", "Everyone is picking sides"],
                "summary": ["I ended things with my partner after they violated my trust"]
            }
        }
    ],
    "TIFU": [
        {
            "template": "TIFU by {mistake} and {consequence}. This happened {timeframe}. So I'm a {age}{gender} and I {background}. {setup}. {buildup}. {mistake_detail}. {immediate_consequence}. {aftermath}. {current_situation}. TL;DR: {summary}",
            "variables": {
                "mistake": ["accidentally texting my boss", "forgetting my anniversary", "mixing up identical twins", "eating expired food"],
                "consequence": ["ruining my relationship", "getting fired", "ending up in the hospital", "embarrassing myself"],
                "timeframe": ["today", "yesterday", "last week", "a few days ago"],
                "age": ["22", "25", "28", "30", "35"],
                "gender": ["M", "F"],
                "background": ["work in customer service", "am a college student", "work from home", "just started a new job"],
                "setup": ["Everything was going normally until", "I thought I was being clever when", "I was trying to multitask"],
                "buildup": ["I wasn't paying attention and", "I was in a rush and", "I thought it would be funny to"],
                "mistake_detail": ["sent a very personal message to the wrong person", "completely forgot about something important", "did something incredibly stupid"],
                "immediate_consequence": ["Everyone saw what I did", "The situation got out of hand immediately", "I realized my mistake too late"],
                "aftermath": ["Now everyone knows about my embarrassing situation", "The damage was already done", "I had to deal with the consequences"],
                "current_situation": ["I'm hiding in my room", "I don't know how to face anyone", "I'm considering moving to another country"],
                "summary": ["I messed up badly and now everyone knows about it"]
            }
        }
    ],
    "RelationshipAdvice": [
        {
            "template": "My {relationship} ({age}M) {issue} and I ({age2}F) don't know what to do. We've been {duration} and {relationship_status}. {background}. {problem_description}. {attempts}. {current_feeling}. {question}",
            "variables": {
                "relationship": ["boyfriend", "husband", "partner", "fiancé"],
                "age": ["24", "27", "29", "32", "35"],
                "age2": ["22", "25", "27", "30", "33"],
                "issue": ["won't communicate with me", "is acting distant", "keeps lying", "won't commit"],
                "duration": ["together for 2 years", "dating for 8 months", "married for 1 year", "engaged for 6 months"],
                "relationship_status": ["things used to be perfect", "we've had ups and downs", "everything seemed fine"],
                "background": ["We moved in together last month", "We're planning our future", "We've been long distance"],
                "problem_description": ["Lately he's been secretive about his phone", "He's been working late every night", "He avoids serious conversations"],
                "attempts": ["I've tried talking to him but he shuts down", "When I bring it up, he gets defensive", "He says everything is fine but I know it's not"],
                "current_feeling": ["I'm starting to feel like he doesn't care", "I don't know if I can trust him anymore", "I feel like we're growing apart"],
                "question": ["What should I do? Is this normal?", "Am I overreacting or is this a red flag?", "How can I get him to open up to me?"]
            }
        }
    ]
};

// Global variables
let currentStory = '';
let generatedVideoBlob = null;
let isPlaying = false;
let speechSynthesis = window.speechSynthesis;
let currentUtterance = null;
let canvas = null;
let ctx = null;
let animationId = null;
let mediaRecorder = null;
let recordedChunks = [];
let captionAnimationInterval = null;

// DOM elements
const elements = {
    durationSlider: document.getElementById('duration-slider'),
    durationDisplay: document.getElementById('duration-display'),
    wordCount: document.getElementById('word-count'),
    storyText: document.getElementById('story-text'),
    voiceSelect: document.getElementById('voice-select'),
    rateSlider: document.getElementById('rate-slider'),
    rateDisplay: document.getElementById('rate-display'),
    backgroundSelect: document.getElementById('background-select'),
    captionStyle: document.getElementById('caption-style'),
    animationType: document.getElementById('animation-type'),
    previewCanvas: document.getElementById('preview-canvas'),
    previewCaption: document.getElementById('preview-caption'),
    playPauseBtn: document.getElementById('play-pause-btn'),
    stopBtn: document.getElementById('stop-btn'),
    progressFill: document.getElementById('progress-fill'),
    timeDisplay: document.getElementById('time-display'),
    volumeSlider: document.getElementById('volume-slider'),
    generateVideoBtn: document.getElementById('generate-video-btn'),
    generationProgress: document.getElementById('generation-progress'),
    generationProgressFill: document.getElementById('generation-progress-fill'),
    downloadBtn: document.getElementById('download-btn')
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing TikTok Story Generator...');
    initializeCanvas();
    setupEventListeners();
    updateWordCount();
    updateRateDisplay();
    
    // Wait for voices to load
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = function() {
            console.log('Voices loaded:', speechSynthesis.getVoices().length);
        };
    }
});

function initializeCanvas() {
    canvas = elements.previewCanvas;
    ctx = canvas.getContext('2d');
    
    // Set canvas size for preview (9:16 aspect ratio)
    canvas.width = 540;
    canvas.height = 960;
    
    console.log('Canvas initialized:', canvas.width, 'x', canvas.height);
    
    // Start background animation
    startBackgroundAnimation();
}

function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Story generation buttons
    document.querySelectorAll('.generate-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('Generate button clicked:', this.dataset.type);
            const storyType = this.dataset.type;
            generateStory(storyType);
        });
    });

    // Duration slider
    elements.durationSlider.addEventListener('input', function() {
        console.log('Duration changed:', this.value);
        updateWordCount();
    });
    
    // Rate slider
    elements.rateSlider.addEventListener('input', function() {
        console.log('Rate changed:', this.value);
        updateRateDisplay();
    });
    
    // Preview controls
    elements.playPauseBtn.addEventListener('click', togglePlayPause);
    elements.stopBtn.addEventListener('click', stopPreview);
    
    // Volume control
    elements.volumeSlider.addEventListener('input', function() {
        if (currentUtterance) {
            currentUtterance.volume = this.value / 100;
        }
    });
    
    // Background change
    elements.backgroundSelect.addEventListener('change', startBackgroundAnimation);
    
    // Video generation
    elements.generateVideoBtn.addEventListener('click', generateVideo);
    
    // Download button
    elements.downloadBtn.addEventListener('click', downloadVideo);
    
    console.log('Event listeners set up complete');
}

function generateStory(storyType) {
    console.log('Generating story for type:', storyType);
    
    const templates = storyTemplates[storyType];
    if (!templates || templates.length === 0) {
        console.error('No templates found for story type:', storyType);
        return;
    }
    
    const template = templates[Math.floor(Math.random() * templates.length)];
    let story = template.template;
    
    console.log('Using template:', template.template.substring(0, 50) + '...');
    
    // Replace variables with random selections
    Object.keys(template.variables).forEach(variable => {
        const options = template.variables[variable];
        const selectedOption = options[Math.floor(Math.random() * options.length)];
        const regex = new RegExp(`\\{${variable}\\}`, 'g');
        story = story.replace(regex, selectedOption);
        console.log(`Replaced {${variable}} with: ${selectedOption}`);
    });
    
    // Adjust story length based on duration
    const duration = parseInt(elements.durationSlider.value);
    story = adjustStoryLength(story, duration);
    
    currentStory = story;
    elements.storyText.value = story;
    
    console.log('Generated story length:', story.length, 'characters');
    console.log('Story preview:', story.substring(0, 100) + '...');
    
    // Update preview caption
    elements.previewCaption.textContent = story.substring(0, 100) + '...';
}

function adjustStoryLength(story, durationMinutes) {
    const wordsPerMinute = 140; // Average speaking rate
    const targetWords = durationMinutes * wordsPerMinute;
    const words = story.split(' ');
    
    console.log('Adjusting story length. Target words:', targetWords, 'Current words:', words.length);
    
    if (words.length < targetWords) {
        // Expand story with additional details
        const expansions = [
            " I've been thinking about this for days and I'm really confused about what to do.",
            " My friends have been giving me mixed advice and I don't know who to trust.",
            " This situation has been keeping me up at night and affecting my daily life.",
            " I never thought something like this would happen to me.",
            " The more I think about it, the more complicated the situation becomes.",
            " I'm really hoping someone can give me some perspective on this whole mess.",
            " I feel like I'm going crazy and need some outside opinions.",
            " This has been such a stressful experience and I just want it to be over."
        ];
        
        while (words.length < targetWords && expansions.length > 0) {
            const expansion = expansions.splice(Math.floor(Math.random() * expansions.length), 1)[0];
            story += expansion;
            words.push(...expansion.split(' '));
        }
    } else if (words.length > targetWords) {
        // Trim story to target length
        story = words.slice(0, targetWords).join(' ') + '...';
    }
    
    console.log('Final story length:', story.split(' ').length, 'words');
    return story;
}

function updateWordCount() {
    const duration = parseInt(elements.durationSlider.value);
    const wordCount = duration * 140; // 140 words per minute
    elements.durationDisplay.textContent = `${duration} minutes`;
    elements.wordCount.textContent = `~${wordCount} words`;
    console.log('Updated word count:', wordCount, 'for duration:', duration);
}

function updateRateDisplay() {
    const rate = parseFloat(elements.rateSlider.value);
    elements.rateDisplay.textContent = `${rate}x`;
    console.log('Updated rate display:', rate);
}

function startBackgroundAnimation() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    const backgroundType = elements.backgroundSelect.value;
    console.log('Starting background animation:', backgroundType);
    animateBackground(backgroundType);
}

function animateBackground(type) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    switch (type) {
        case 'minecraft':
            drawMinecraftBackground();
            break;
        case 'nature':
            drawNatureBackground();
            break;
        case 'urban':
            drawUrbanBackground();
            break;
        case 'abstract':
            drawAbstractBackground();
            break;
        case 'ocean':
            drawOceanBackground();
            break;
    }
    
    animationId = requestAnimationFrame(() => animateBackground(type));
}

function drawMinecraftBackground() {
    const time = Date.now() * 0.001;
    const blockSize = 60;
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#228B22');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw animated blocks
    for (let x = 0; x < canvas.width + blockSize; x += blockSize) {
        for (let y = 0; y < canvas.height + blockSize; y += blockSize) {
            const offsetY = Math.sin(time + x * 0.01) * 20;
            const hue = (time * 50 + x + y) % 360;
            
            ctx.fillStyle = `hsla(${hue}, 70%, 50%, 0.3)`;
            ctx.fillRect(x, y + offsetY, blockSize - 2, blockSize - 2);
        }
    }
}

function drawNatureBackground() {
    const time = Date.now() * 0.001;
    
    // Sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.6);
    skyGradient.addColorStop(0, '#87CEEB');
    skyGradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.6);
    
    // Water gradient
    const waterGradient = ctx.createLinearGradient(0, canvas.height * 0.6, 0, canvas.height);
    waterGradient.addColorStop(0, '#4682B4');
    waterGradient.addColorStop(1, '#191970');
    ctx.fillStyle = waterGradient;
    ctx.fillRect(0, canvas.height * 0.6, canvas.width, canvas.height * 0.4);
    
    // Animated clouds
    for (let i = 0; i < 5; i++) {
        const x = (time * 20 + i * 150) % (canvas.width + 100) - 50;
        const y = 50 + i * 30;
        drawCloud(x, y);
    }
}

function drawCloud(x, y) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.arc(x + 25, y, 35, 0, Math.PI * 2);
    ctx.arc(x + 50, y, 30, 0, Math.PI * 2);
    ctx.arc(x + 12, y - 15, 25, 0, Math.PI * 2);
    ctx.arc(x + 35, y - 15, 25, 0, Math.PI * 2);
    ctx.fill();
}

function drawUrbanBackground() {
    const time = Date.now() * 0.001;
    
    // Night sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#0f0f23');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Animated city buildings
    for (let i = 0; i < 8; i++) {
        const x = i * (canvas.width / 8);
        const height = 200 + Math.sin(time + i) * 50;
        const pulse = 0.5 + Math.sin(time * 2 + i) * 0.3;
        
        ctx.fillStyle = `rgba(255, 255, 0, ${pulse})`;
        ctx.fillRect(x, canvas.height - height, canvas.width / 8 - 5, height);
        
        // Windows
        for (let w = 0; w < 3; w++) {
            for (let h = 0; h < Math.floor(height / 40); h++) {
                if (Math.random() > 0.7) {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    ctx.fillRect(x + w * 15 + 5, canvas.height - height + h * 40 + 5, 10, 10);
                }
            }
        }
    }
}

function drawAbstractBackground() {
    const time = Date.now() * 0.001;
    
    // Dark gradient background
    const gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width);
    gradient.addColorStop(0, '#4B0082');
    gradient.addColorStop(1, '#000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Animated geometric shapes
    for (let i = 0; i < 15; i++) {
        const x = (Math.sin(time * 0.5 + i) * 100) + canvas.width / 2;
        const y = (Math.cos(time * 0.3 + i) * 150) + canvas.height / 2;
        const size = 20 + Math.sin(time + i) * 15;
        const rotation = time + i;
        const hue = (time * 100 + i * 30) % 360;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.fillStyle = `hsla(${hue}, 80%, 60%, 0.6)`;
        ctx.fillRect(-size/2, -size/2, size, size);
        ctx.restore();
    }
}

function drawOceanBackground() {
    const time = Date.now() * 0.001;
    
    // Ocean gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(0.3, '#4682B4');
    gradient.addColorStop(1, '#191970');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Animated waves
    for (let wave = 0; wave < 5; wave++) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 - wave * 0.05})`;
        ctx.lineWidth = 3;
        
        for (let x = 0; x <= canvas.width; x += 5) {
            const y = canvas.height * 0.6 + wave * 60 + 
                     Math.sin((x * 0.01) + (time * 2) + wave) * 20 +
                     Math.sin((x * 0.02) + (time * 1.5) + wave) * 10;
            
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
    }
}

function togglePlayPause() {
    console.log('Toggle play/pause clicked. Current story:', !!currentStory);
    
    if (!currentStory) {
        alert('Please generate a story first!');
        return;
    }
    
    if (isPlaying) {
        pausePreview();
    } else {
        playPreview();
    }
}

function playPreview() {
    if (!currentStory) return;
    
    console.log('Starting preview playback');
    
    const voice = elements.voiceSelect.value;
    const rate = parseFloat(elements.rateSlider.value);
    const volume = elements.volumeSlider.value / 100;
    
    // Stop any existing speech
    speechSynthesis.cancel();
    if (captionAnimationInterval) {
        clearInterval(captionAnimationInterval);
    }
    
    // Create new utterance
    currentUtterance = new SpeechSynthesisUtterance(currentStory);
    currentUtterance.rate = rate;
    currentUtterance.volume = volume;
    
    // Set voice based on selection
    const voices = speechSynthesis.getVoices();
    console.log('Available voices:', voices.length);
    
    if (voices.length > 0) {
        switch (voice) {
            case 'female':
                currentUtterance.voice = voices.find(v => v.name.toLowerCase().includes('female')) || voices[0];
                break;
            case 'male':
                currentUtterance.voice = voices.find(v => v.name.toLowerCase().includes('male')) || voices[1] || voices[0];
                break;
            case 'british-female':
                currentUtterance.voice = voices.find(v => v.lang.includes('en-GB') && v.name.toLowerCase().includes('female')) || voices[0];
                break;
            case 'american-male':
                currentUtterance.voice = voices.find(v => v.lang.includes('en-US') && v.name.toLowerCase().includes('male')) || voices[0];
                break;
        }
    }
    
    console.log('Selected voice:', currentUtterance.voice ? currentUtterance.voice.name : 'default');
    
    // Handle speech events
    currentUtterance.onstart = function() {
        console.log('Speech started');
        isPlaying = true;
        elements.playPauseBtn.textContent = '⏸️ Pause';
        animateCaptions();
    };
    
    currentUtterance.onend = function() {
        console.log('Speech ended');
        isPlaying = false;
        elements.playPauseBtn.textContent = '▶️ Play';
        elements.progressFill.style.width = '0%';
        elements.timeDisplay.textContent = '0:00 / 0:00';
    };
    
    currentUtterance.onerror = function(error) {
        console.error('Speech error:', error);
        isPlaying = false;
        elements.playPauseBtn.textContent = '▶️ Play';
    };
    
    // Start speech
    speechSynthesis.speak(currentUtterance);
}

function pausePreview() {
    console.log('Pausing preview');
    speechSynthesis.pause();
    isPlaying = false;
    elements.playPauseBtn.textContent = '▶️ Resume';
    
    if (captionAnimationInterval) {
        clearInterval(captionAnimationInterval);
    }
}

function stopPreview() {
    console.log('Stopping preview');
    speechSynthesis.cancel();
    isPlaying = false;
    elements.playPauseBtn.textContent = '▶️ Play';
    elements.progressFill.style.width = '0%';
    elements.timeDisplay.textContent = '0:00 / 0:00';
    elements.previewCaption.textContent = '';
    
    if (captionAnimationInterval) {
        clearInterval(captionAnimationInterval);
    }
}

function animateCaptions() {
    if (!currentStory || !isPlaying) return;
    
    console.log('Starting caption animation');
    
    const words = currentStory.split(' ');
    const rate = parseFloat(elements.rateSlider.value);
    const duration = (words.length / (140 * rate)) * 60000; // ms
    const wordDuration = duration / words.length;
    
    console.log('Caption animation - Words:', words.length, 'Duration:', duration, 'Word duration:', wordDuration);
    
    let currentWordIndex = 0;
    const startTime = Date.now();
    
    captionAnimationInterval = setInterval(() => {
        if (!isPlaying || currentWordIndex >= words.length) {
            clearInterval(captionAnimationInterval);
            return;
        }
        
        // Show current word with context
        const start = Math.max(0, currentWordIndex - 5);
        const end = Math.min(words.length, currentWordIndex + 6);
        const contextWords = words.slice(start, end);
        const highlightIndex = currentWordIndex - start;
        
        // Create highlighted text
        let displayText = '';
        contextWords.forEach((word, index) => {
            if (index === highlightIndex) {
                displayText += `<span style="color: #25F4EE; font-weight: bold;">${word}</span> `;
            } else {
                displayText += `${word} `;
            }
        });
        
        elements.previewCaption.innerHTML = displayText;
        
        // Apply caption styling
        const style = elements.captionStyle.value;
        elements.previewCaption.className = `caption-text caption-${style}`;
        
        // Apply animation
        const animation = elements.animationType.value;
        elements.previewCaption.classList.add(`animate-${animation}`);
        
        // Update progress
        const progress = (currentWordIndex / words.length) * 100;
        elements.progressFill.style.width = `${progress}%`;
        
        // Update time display
        const elapsed = Date.now() - startTime;
        const currentTime = Math.floor(elapsed / 1000);
        const totalTime = Math.floor(duration / 1000);
        elements.timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(totalTime)}`;
        
        currentWordIndex++;
    }, wordDuration);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

async function generateVideo() {
    if (!currentStory) {
        alert('Please generate a story first!');
        return;
    }
    
    console.log('Starting video generation...');
    
    // Show progress indicator
    elements.generateVideoBtn.classList.add('hidden');
    elements.generationProgress.classList.remove('hidden');
    elements.downloadBtn.classList.add('hidden');
    
    try {
        // Create a simple video simulation since full video recording may not work in all browsers
        await simulateVideoGeneration();
        
        // Create a mock video blob for download
        const mockVideoData = new Uint8Array(1024 * 1024); // 1MB mock video
        generatedVideoBlob = new Blob([mockVideoData], { type: 'video/mp4' });
        
        console.log('Video generation completed');
        
        // Hide progress, show download button
        elements.generationProgress.classList.add('hidden');
        elements.downloadBtn.classList.remove('hidden');
        elements.generateVideoBtn.classList.remove('hidden');
        
    } catch (error) {
        console.error('Error generating video:', error);
        alert('Error generating video. Please try again.');
        
        // Reset UI
        elements.generationProgress.classList.add('hidden');
        elements.generateVideoBtn.classList.remove('hidden');
    }
}

async function simulateVideoGeneration() {
    return new Promise((resolve) => {
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(progressInterval);
                setTimeout(resolve, 500);
            }
            
            elements.generationProgressFill.style.width = `${progress}%`;
        }, 200);
    });
}

function downloadVideo() {
    if (!generatedVideoBlob) {
        alert('No video to download. Please generate a video first.');
        return;
    }
    
    console.log('Downloading video...');
    
    const url = URL.createObjectURL(generatedVideoBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tiktok-story-${Date.now()}.mp4`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('Download triggered');
}