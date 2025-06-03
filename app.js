// Application Data
const appData = {
  storyTemplates: {
    aita: [
      {
        title: "AITA for {action} when {situation}?",
        demographics: ["(25M)", "(30F)", "(22F)", "(28M)", "(35F)", "(26M)"],
        relationships: ["my girlfriend", "my boyfriend", "my best friend", "my roommate", "my sister", "my brother", "my mom", "my coworker"],
        situations: ["they didn't respect my boundaries", "they made unreasonable demands", "they betrayed my trust", "they embarrassed me publicly", "they broke something important"],
        actions: ["cutting contact", "setting firm boundaries", "refusing to help", "calling them out", "leaving the situation"],
        contexts: ["family dinner", "birthday party", "work event", "vacation", "wedding", "graduation"],
        conflicts: ["money dispute", "privacy invasion", "disrespectful behavior", "broken promise", "jealousy issue"]
      }
    ],
    tifu: [
      {
        title: "TIFU by {mistake} and {consequence}",
        timeframes: ["today", "yesterday", "last week", "this morning", "this afternoon"],
        mistakes: ["sending the wrong text", "forgetting an important meeting", "accidentally breaking something valuable", "misunderstanding instructions", "falling asleep at the wrong time"],
        consequences: ["embarrassing myself completely", "getting in trouble with my boss", "ruining someone's special day", "causing a huge misunderstanding", "creating an awkward situation"],
        settings: ["at work", "at home", "at a restaurant", "at school", "at a party", "on public transport"],
        reactions: ["everyone stared", "people started laughing", "silence filled the room", "chaos ensued", "I wanted to disappear"]
      }
    ],
    relationship: [
      {
        title: "Need advice: My {relationship} {behavior} and I don't know what to do",
        relationships: ["boyfriend (25M)", "girlfriend (23F)", "husband (30M)", "wife (28F)", "partner (26NB)"],
        behaviors: ["has been acting distant lately", "keeps lying about small things", "spends too much money without discussing", "doesn't help with household chores", "prioritizes friends over our relationship"],
        durations: ["We've been together for 2 years", "We've been dating for 6 months", "We've been married for 3 years", "We've been together for 1 year"],
        attempts: ["I've tried talking to them", "I've given them space", "I've suggested counseling", "I've addressed this before"],
        emotions: ["I feel confused and hurt", "I'm starting to lose trust", "I feel taken for granted", "I'm questioning our future"]
      }
    ]
  },
  backgroundAnimations: {
    minecraft: {
      name: "Minecraft Parkour",
      description: "Green geometric patterns with block-like movements",
      colors: ["#4CAF50", "#8BC34A", "#2E7D32"]
    },
    nature: {
      name: "Peaceful Nature", 
      description: "Soft green and blue gradients with flowing animations",
      colors: ["#81C784", "#4FC3F7", "#66BB6A"]
    },
    urban: {
      name: "Urban Landscape",
      description: "Dark cityscape with neon accent colors",
      colors: ["#37474F", "#FF6B35", "#5E35B1"]
    },
    abstract: {
      name: "Abstract Geometry",
      description: "Colorful geometric shapes with smooth transitions",
      colors: ["#E91E63", "#9C27B0", "#3F51B5"]
    },
    ocean: {
      name: "Ocean Waves",
      description: "Blue wave patterns with flowing motion",
      colors: ["#0288D1", "#00ACC1", "#0097A7"]
    }
  },
  videoSpecs: {
    width: 1080,
    height: 1920,
    aspectRatio: "9:16",
    frameRate: 30,
    wordsPeMinute: 140,
    maxDuration: 600,
    minDuration: 120
  }
};

// Global state
let currentStoryType = null;
let currentStory = null;
let currentSettings = {
  duration: 5,
  voice: null,
  speechRate: 1.0,
  background: 'minecraft',
  font: 'Arial',
  fontSize: 36,
  captionColor: '#FFFFFF'
};

let isPlaying = false;
let currentTime = 0;
let totalDuration = 0;
let animationId = null;
let mediaRecorder = null;
let recordedChunks = [];
let canvas = null;
let ctx = null;
let audioContext = null;
let currentUtterance = null;

// Theme management
function initializeTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-color-scheme', savedTheme);
  updateThemeToggle(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-color-scheme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-color-scheme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeToggle(newTheme);
}

function updateThemeToggle(theme) {
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.textContent = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
}

// Utility functions
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function calculateWordCount(text) {
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function showError(message) {
  const errorToast = document.getElementById('error-toast');
  const errorMessage = errorToast.querySelector('.error-message');
  errorMessage.textContent = message;
  errorToast.classList.remove('hidden');
  
  setTimeout(() => {
    errorToast.classList.add('hidden');
  }, 5000);
}

// Story generation
function generateStory(type, targetWords) {
  const templates = appData.storyTemplates[type];
  if (!templates || templates.length === 0) {
    throw new Error(`No templates found for story type: ${type}`);
  }
  
  const template = getRandomElement(templates);
  let story = '';
  
  try {
    switch (type) {
      case 'aita':
        story = generateAitaStory(template, targetWords);
        break;
      case 'tifu':
        story = generateTifuStory(template, targetWords);
        break;
      case 'relationship':
        story = generateRelationshipStory(template, targetWords);
        break;
      default:
        throw new Error(`Unknown story type: ${type}`);
    }
    
    const wordCount = calculateWordCount(story);
    if (wordCount < targetWords * 0.8 || wordCount > targetWords * 1.2) {
      // Pad or trim the story to better match target
      story = adjustStoryLength(story, targetWords, type);
    }
    
    return story;
  } catch (error) {
    console.error('Error generating story:', error);
    throw new Error('Failed to generate story. Please try again.');
  }
}

function generateAitaStory(template, targetWords) {
  const demographic = getRandomElement(template.demographics);
  const relationship = getRandomElement(template.relationships);
  const situation = getRandomElement(template.situations);
  const action = getRandomElement(template.actions);
  const context = getRandomElement(template.contexts);
  const conflict = getRandomElement(template.conflicts);
  
  const title = template.title
    .replace('{action}', action)
    .replace('{situation}', situation);
  
  const scenarios = [
    `So this happened at a ${context} and I'm still processing it.`,
    `I ${demographic} need some perspective on what happened.`,
    `This involves ${relationship} and a major ${conflict}.`,
    `${relationship} and I have been dealing with this ${conflict} for weeks.`
  ];
  
  const developments = [
    `The situation escalated when ${situation}.`,
    `I tried to be reasonable, but ${relationship} kept pushing boundaries.`,
    `After ${situation}, I decided I had enough.`,
    `The final straw was when they completely ignored my feelings about this.`,
    `I've been dealing with their ${conflict} behavior for too long.`
  ];
  
  const reactions = [
    `My family thinks I overreacted, but I feel justified.`,
    `Some friends say I was harsh, others support my decision.`,
    `${relationship} is now giving me the silent treatment.`,
    `The whole situation has caused tension in our social circle.`,
    `I'm questioning if I handled this the right way.`
  ];
  
  let story = `${title}\n\n`;
  story += `${getRandomElement(scenarios)} `;
  
  // Add multiple development paragraphs based on target length
  const numDevelopments = Math.max(2, Math.floor(targetWords / 150));
  for (let i = 0; i < numDevelopments; i++) {
    story += `${getRandomElement(developments)} `;
    if (i < numDevelopments - 1) {
      story += `\n\n`;
    }
  }
  
  story += `\n\n${getRandomElement(reactions)}`;
  story += `\n\nSo Reddit, AITA for ${action} when ${situation}?`;
  story += `\n\nTL;DR: ${relationship} ${situation}, so I ${action}. Everyone has opinions.`;
  
  return story;
}

function generateTifuStory(template, targetWords) {
  const timeframe = getRandomElement(template.timeframes);
  const mistake = getRandomElement(template.mistakes);
  const consequence = getRandomElement(template.consequences);
  const setting = getRandomElement(template.settings);
  const reaction = getRandomElement(template.reactions);
  
  const title = template.title
    .replace('{mistake}', mistake)
    .replace('{consequence}', consequence);
  
  const openings = [
    `So this happened ${timeframe} and I'm still cringing.`,
    `${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} I managed to completely humiliate myself.`,
    `I thought I'd share my epic fail from ${timeframe}.`,
    `${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}'s disaster story incoming.`
  ];
  
  const buildups = [
    `I was ${setting} minding my own business when everything went wrong.`,
    `The day started normally enough ${setting}.`,
    `I should have known something would go wrong when I woke up late.`,
    `Everything seemed fine until I made the worst possible decision.`
  ];
  
  const climaxes = [
    `That's when I made the brilliant decision to ${mistake}.`,
    `In my infinite wisdom, I decided ${mistake} was a good idea.`,
    `My brain completely shut off and I ended up ${mistake}.`,
    `Without thinking, I ${mistake} right in front of everyone.`
  ];
  
  const aftermath = [
    `The result? ${consequence} while ${reaction}.`,
    `Naturally, this led to ${consequence} and ${reaction}.`,
    `Of course, I ended up ${consequence} as ${reaction}.`,
    `Predictably, ${consequence} happened and ${reaction}.`
  ];
  
  let story = `${title}\n\n`;
  story += `${getRandomElement(openings)} `;
  story += `${getRandomElement(buildups)} `;
  
  // Add buildup based on target length
  const numBuildups = Math.max(1, Math.floor(targetWords / 200));
  for (let i = 0; i < numBuildups; i++) {
    story += `${getRandomElement(climaxes)} `;
    story += `${getRandomElement(aftermath)} `;
    if (i < numBuildups - 1) {
      story += `\n\n`;
    }
  }
  
  story += `\n\nI wanted to disappear into the ground. The embarrassment was real.`;
  story += `\n\nTL;DR: ${mistake} ${setting}, ${consequence}, learned my lesson the hard way.`;
  
  return story;
}

function generateRelationshipStory(template, targetWords) {
  const relationship = getRandomElement(template.relationships);
  const behavior = getRandomElement(template.behaviors);
  const duration = getRandomElement(template.durations);
  const attempt = getRandomElement(template.attempts);
  const emotion = getRandomElement(template.emotions);
  
  const title = template.title
    .replace('{relationship}', relationship)
    .replace('{behavior}', behavior);
  
  const contexts = [
    `${duration} and things have been mostly good until recently.`,
    `Our relationship started great but lately there have been issues.`,
    `${duration} and I thought we had good communication.`,
    `We've always been solid together, but something has changed.`
  ];
  
  const problems = [
    `The main issue is that they ${behavior}.`,
    `I've noticed they ${behavior} and it's becoming a pattern.`,
    `They keep ${behavior} despite our previous conversations.`,
    `What bothers me most is how they ${behavior}.`
  ];
  
  const attempts_made = [
    `${attempt} multiple times but nothing changes.`,
    `${attempt} but they don't seem to take it seriously.`,
    `${attempt} and they promise to change but it never lasts.`,
    `${attempt} but we end up arguing instead of resolving anything.`
  ];
  
  const current_state = [
    `Right now ${emotion} and I don't know what to do next.`,
    `${emotion} and I'm starting to wonder if this is worth it.`,
    `${emotion} but I still love them and want this to work.`,
    `${emotion} and I'm considering taking a break.`
  ];
  
  let story = `${title}\n\n`;
  story += `${getRandomElement(contexts)} `;
  story += `${getRandomElement(problems)} `;
  
  // Add complexity based on target length
  const numCycles = Math.max(1, Math.floor(targetWords / 180));
  for (let i = 0; i < numCycles; i++) {
    story += `${getRandomElement(attempts_made)} `;
    if (i < numCycles - 1) {
      story += `\n\n`;
    }
  }
  
  story += `\n\n${getRandomElement(current_state)}`;
  story += `\n\nI love them but I need advice. Is this something we can work through?`;
  story += `\n\nTL;DR: ${relationship} ${behavior}, ${attempt}, ${emotion}. Need guidance.`;
  
  return story;
}

function adjustStoryLength(story, targetWords, type) {
  const currentWords = calculateWordCount(story);
  
  if (currentWords < targetWords * 0.9) {
    // Add filler content
    const fillers = [
      "\n\nI've been thinking about this situation a lot and wanted to get outside perspective.",
      "\n\nThe more I reflect on it, the more confused I become about whether I handled it right.",
      "\n\nI know this might seem like a small thing, but it's been weighing on my mind.",
      "\n\nUpdate: I talked to a few friends and got mixed reactions to my story.",
      "\n\nI realize there might be details I missed that could change how people see this."
    ];
    
    while (calculateWordCount(story) < targetWords * 0.95) {
      story += getRandomElement(fillers);
    }
  }
  
  return story;
}

// Canvas and animation
function initializeCanvas() {
  canvas = document.getElementById('video-canvas');
  ctx = canvas.getContext('2d');
  
  // Set high DPI rendering
  const devicePixelRatio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  
  canvas.width = appData.videoSpecs.width;
  canvas.height = appData.videoSpecs.height;
  
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
}

function drawBackground(timestamp) {
  const background = currentSettings.background;
  const colors = appData.backgroundAnimations[background].colors;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  switch (background) {
    case 'minecraft':
      drawMinecraftBackground(timestamp, colors);
      break;
    case 'nature':
      drawNatureBackground(timestamp, colors);
      break;
    case 'urban':
      drawUrbanBackground(timestamp, colors);
      break;
    case 'abstract':
      drawAbstractBackground(timestamp, colors);
      break;
    case 'ocean':
      drawOceanBackground(timestamp, colors);
      break;
  }
}

function drawMinecraftBackground(timestamp, colors) {
  const time = timestamp * 0.001;
  const blockSize = 120;
  
  // Create moving block pattern
  for (let x = -blockSize; x < canvas.width + blockSize; x += blockSize) {
    for (let y = -blockSize; y < canvas.height + blockSize; y += blockSize) {
      const offsetX = (time * 50) % blockSize;
      const offsetY = (time * 30) % blockSize;
      
      const finalX = x + offsetX;
      const finalY = y + offsetY;
      
      const colorIndex = Math.floor((finalX + finalY) / blockSize) % colors.length;
      ctx.fillStyle = colors[colorIndex];
      
      // Add some transparency
      ctx.globalAlpha = 0.8;
      ctx.fillRect(finalX, finalY, blockSize - 2, blockSize - 2);
      
      // Add highlight
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(finalX, finalY, blockSize - 2, 20);
    }
  }
  ctx.globalAlpha = 1.0;
}

function drawNatureBackground(timestamp, colors) {
  const time = timestamp * 0.001;
  
  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, colors[1]);
  gradient.addColorStop(0.6, colors[0]);
  gradient.addColorStop(1, colors[2]);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Floating particles
  for (let i = 0; i < 20; i++) {
    const x = (i * 100 + time * 20) % (canvas.width + 100);
    const y = canvas.height * 0.3 + Math.sin(time + i) * 50;
    
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;
}

function drawUrbanBackground(timestamp, colors) {
  const time = timestamp * 0.001;
  
  // Dark base
  ctx.fillStyle = colors[0];
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Moving neon lines
  for (let i = 0; i < 5; i++) {
    const x = (time * 100 + i * 200) % (canvas.width + 200);
    const gradient = ctx.createLinearGradient(x, 0, x + 100, 0);
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(0.5, colors[1]);
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x, 0, 100, canvas.height);
  }
  
  // Glitch effects
  if (Math.random() < 0.1) {
    ctx.fillStyle = colors[2];
    ctx.globalAlpha = 0.3;
    const y = Math.random() * canvas.height;
    ctx.fillRect(0, y, canvas.width, 20);
    ctx.globalAlpha = 1.0;
  }
}

function drawAbstractBackground(timestamp, colors) {
  const time = timestamp * 0.001;
  
  // Base gradient
  const gradient = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, 0,
    canvas.width / 2, canvas.height / 2, canvas.height
  );
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(1, colors[2]);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Rotating shapes
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  
  for (let i = 0; i < 3; i++) {
    ctx.save();
    ctx.rotate(time + i * Math.PI / 1.5);
    ctx.fillStyle = colors[i];
    ctx.globalAlpha = 0.4;
    
    ctx.beginPath();
    ctx.moveTo(0, -200);
    ctx.lineTo(100, 0);
    ctx.lineTo(0, 200);
    ctx.lineTo(-100, 0);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  }
  
  ctx.restore();
  ctx.globalAlpha = 1.0;
}

function drawOceanBackground(timestamp, colors) {
  const time = timestamp * 0.001;
  
  // Ocean gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(0.5, colors[1]);
  gradient.addColorStop(1, colors[2]);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Wave patterns
  for (let layer = 0; layer < 3; layer++) {
    ctx.beginPath();
    ctx.globalAlpha = 0.3 - layer * 0.1;
    
    const waveHeight = 60 + layer * 20;
    const frequency = 0.01 + layer * 0.005;
    const speed = 0.5 + layer * 0.3;
    
    for (let x = 0; x <= canvas.width; x += 10) {
      const y = canvas.height * 0.7 + Math.sin(x * frequency + time * speed) * waveHeight;
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    
    ctx.fillStyle = colors[layer];
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;
}

// Text-to-Speech
function initializeVoices() {
  const voiceSelect = document.getElementById('voice-select');
  
  function populateVoices() {
    const voices = speechSynthesis.getVoices();
    voiceSelect.innerHTML = '<option value="">Default Voice</option>';
    
    voices.forEach((voice, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = `${voice.name} (${voice.lang})`;
      if (voice.default) {
        option.textContent += ' - Default';
      }
      voiceSelect.appendChild(option);
    });
  }
  
  populateVoices();
  speechSynthesis.addEventListener('voiceschanged', populateVoices);
}

function speakText(text, onEnd, onBoundary) {
  return new Promise((resolve, reject) => {
    if (currentUtterance) {
      speechSynthesis.cancel();
    }
    
    currentUtterance = new SpeechSynthesisUtterance(text);
    
    // Set voice
    const voices = speechSynthesis.getVoices();
    const voiceSelect = document.getElementById('voice-select');
    if (voiceSelect.value && voices[voiceSelect.value]) {
      currentUtterance.voice = voices[voiceSelect.value];
    }
    
    // Set rate and other properties
    currentUtterance.rate = currentSettings.speechRate;
    currentUtterance.pitch = 1.0;
    currentUtterance.volume = 1.0;
    
    currentUtterance.onend = () => {
      if (onEnd) onEnd();
      resolve();
    };
    
    currentUtterance.onerror = (error) => {
      console.error('Speech synthesis error:', error);
      reject(error);
    };
    
    if (onBoundary) {
      currentUtterance.onboundary = onBoundary;
    }
    
    speechSynthesis.speak(currentUtterance);
  });
}

// Video generation with enhanced MediaRecorder
function setupMediaRecorder(stream) {
  recordedChunks = [];
  
  // Try different MIME types for better compatibility
  const mimeTypes = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm;codecs=h264,opus',
    'video/webm',
    'video/mp4;codecs=h264,aac',
    'video/mp4'
  ];
  
  let selectedMimeType = null;
  for (const mimeType of mimeTypes) {
    if (MediaRecorder.isTypeSupported(mimeType)) {
      selectedMimeType = mimeType;
      break;
    }
  }
  
  if (!selectedMimeType) {
    throw new Error('No supported video format found');
  }
  
  console.log('Using MIME type:', selectedMimeType);
  
  // Create new MediaRecorder instance (never reuse)
  mediaRecorder = new MediaRecorder(stream, {
    mimeType: selectedMimeType,
    videoBitsPerSecond: 2500000,
    audioBitsPerSecond: 128000
  });
  
  mediaRecorder.ondataavailable = (event) => {
    // Validate chunk before adding
    if (event.data && event.data.size > 0) {
      console.log('Recording chunk:', event.data.size, 'bytes');
      recordedChunks.push(event.data);
    } else {
      console.warn('Received empty or invalid chunk');
    }
  };
  
  mediaRecorder.onstop = () => {
    console.log('MediaRecorder stopped. Total chunks:', recordedChunks.length);
    
    if (recordedChunks.length === 0) {
      showError('No video data was recorded. Please try again.');
      return;
    }
    
    try {
      // Create blob with proper MIME type
      const blob = new Blob(recordedChunks, { 
        type: selectedMimeType.includes('webm') ? 'video/webm' : 'video/mp4'
      });
      
      if (blob.size === 0) {
        throw new Error('Generated video file is empty');
      }
      
      console.log('Video blob created:', blob.size, 'bytes');
      handleVideoComplete(blob);
    } catch (error) {
      console.error('Error creating video blob:', error);
      showError('Failed to create video file. Please try again.');
    }
  };
  
  mediaRecorder.onerror = (error) => {
    console.error('MediaRecorder error:', error);
    showError('Recording failed: ' + error.message);
  };
  
  return mediaRecorder;
}

async function generateVideo() {
  if (!currentStory) {
    showError('Please generate a story first');
    return;
  }
  
  try {
    showLoading('Preparing video generation...');
    
    // Initialize audio context for synchronization
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // Setup canvas stream
    const stream = canvas.captureStream(30);
    
    // Validate stream
    if (!stream || stream.getTracks().length === 0) {
      throw new Error('Failed to capture canvas stream');
    }
    
    console.log('Canvas stream created with', stream.getTracks().length, 'tracks');
    
    // Create audio stream for speech synthesis
    const audioDestination = audioContext.createMediaStreamDestination();
    const gainNode = audioContext.createGain();
    gainNode.connect(audioDestination);
    
    // Combine video and audio streams
    const combinedStream = new MediaStream([
      ...stream.getVideoTracks(),
      ...audioDestination.stream.getAudioTracks()
    ]);
    
    // Setup MediaRecorder
    const recorder = setupMediaRecorder(combinedStream);
    
    showLoading('Generating video...');
    
    // Start recording
    recorder.start(1000); // Capture data every second
    
    // Force data capture immediately
    setTimeout(() => {
      if (recorder.state === 'recording') {
        recorder.requestData();
      }
    }, 100);
    
    // Generate video content
    await generateVideoContent();
    
    // Ensure final data capture
    if (recorder.state === 'recording') {
      recorder.requestData();
      
      // Stop recording after a brief delay
      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
        }
      }, 500);
    }
    
  } catch (error) {
    console.error('Video generation error:', error);
    showError('Failed to generate video: ' + error.message);
    hideLoading();
  }
}

async function generateVideoContent() {
  const words = currentStory.split(/\s+/);
  const wordsPerSecond = currentSettings.speechRate * (appData.videoSpecs.wordsPeMinute / 60);
  const totalDuration = words.length / wordsPerSecond;
  
  let currentWordIndex = 0;
  let startTime = performance.now();
  
  // Animation loop
  function animate() {
    const elapsed = (performance.now() - startTime) / 1000;
    const progress = elapsed / totalDuration;
    
    if (progress >= 1) {
      return; // Animation complete
    }
    
    // Draw background
    drawBackground(performance.now());
    
    // Calculate current words to display
    const wordsToShow = Math.floor(elapsed * wordsPerSecond);
    const currentWords = words.slice(Math.max(0, wordsToShow - 8), wordsToShow + 1);
    
    // Draw captions
    drawCaptions(currentWords.join(' '), wordsToShow);
    
    // Continue animation
    requestAnimationFrame(animate);
  }
  
  // Start animation
  animate();
  
  // Start speech synthesis
  try {
    await speakText(currentStory);
  } catch (error) {
    console.error('Speech synthesis failed:', error);
    // Continue without audio
  }
}

function drawCaptions(text, wordIndex) {
  if (!text.trim()) return;
  
  ctx.save();
  
  // Text styling
  ctx.font = `bold ${currentSettings.fontSize}px ${currentSettings.font}`;
  ctx.fillStyle = currentSettings.captionColor;
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Text shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  
  // Word wrapping
  const maxWidth = canvas.width - 80;
  const lines = wrapText(text, maxWidth);
  const lineHeight = currentSettings.fontSize * 1.2;
  const totalHeight = lines.length * lineHeight;
  
  // Position captions in lower third
  const startY = canvas.height - 200 - totalHeight / 2;
  
  lines.forEach((line, index) => {
    const y = startY + index * lineHeight;
    
    // Draw text stroke
    ctx.strokeText(line, canvas.width / 2, y);
    
    // Draw text fill
    ctx.fillText(line, canvas.width / 2, y);
  });
  
  ctx.restore();
}

function wrapText(text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}

function handleVideoComplete(blob) {
  hideLoading();
  
  try {
    // Create download link
    const url = URL.createObjectURL(blob);
    const downloadLink = document.getElementById('download-link');
    const downloadSection = document.getElementById('download-section');
    const fileSize = document.getElementById('file-size');
    const videoDuration = document.getElementById('video-duration');
    
    downloadLink.href = url;
    downloadLink.download = `tiktok-video-${Date.now()}.webm`;
    
    // Update file info
    const sizeInMB = (blob.size / (1024 * 1024)).toFixed(2);
    fileSize.textContent = `File size: ${sizeInMB} MB`;
    
    const durationMinutes = Math.floor(totalDuration / 60);
    const durationSeconds = Math.floor(totalDuration % 60);
    videoDuration.textContent = `Duration: ${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`;
    
    downloadSection.classList.remove('hidden');
    
    // Clean up URL after download
    downloadLink.addEventListener('click', () => {
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
    
  } catch (error) {
    console.error('Error handling video completion:', error);
    showError('Failed to prepare video download');
  }
}

// UI Event Handlers
function showLoading(message = 'Loading...') {
  const overlay = document.getElementById('loading-overlay');
  const text = overlay.querySelector('.loading-text');
  text.textContent = message;
  overlay.classList.remove('hidden');
}

function hideLoading() {
  document.getElementById('loading-overlay').classList.add('hidden');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  initializeCanvas();
  initializeVoices();
  
  // Theme toggle
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
  
  // Story type selection
  document.querySelectorAll('.story-type-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.story-type-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      currentStoryType = card.dataset.type;
    });
  });
  
  // Duration slider
  const durationSlider = document.getElementById('duration');
  const durationDisplay = document.getElementById('duration-display');
  
  durationSlider.addEventListener('input', (e) => {
    currentSettings.duration = parseInt(e.target.value);
    durationDisplay.textContent = `${currentSettings.duration} minutes`;
  });
  
  // Speech rate slider
  const speechRateSlider = document.getElementById('speech-rate');
  const speechRateDisplay = document.getElementById('speech-rate-display');
  
  speechRateSlider.addEventListener('input', (e) => {
    currentSettings.speechRate = parseFloat(e.target.value);
    speechRateDisplay.textContent = `${currentSettings.speechRate}x`;
  });
  
  // Font size slider
  const fontSizeSlider = document.getElementById('font-size');
  const fontSizeDisplay = document.getElementById('font-size-display');
  
  fontSizeSlider.addEventListener('input', (e) => {
    currentSettings.fontSize = parseInt(e.target.value);
    fontSizeDisplay.textContent = `${currentSettings.fontSize}px`;
  });
  
  // Settings change handlers
  document.getElementById('voice-select').addEventListener('change', (e) => {
    currentSettings.voice = e.target.value;
  });
  
  document.getElementById('background-select').addEventListener('change', (e) => {
    currentSettings.background = e.target.value;
  });
  
  document.getElementById('font-select').addEventListener('change', (e) => {
    currentSettings.font = e.target.value;
  });
  
  document.getElementById('caption-color').addEventListener('change', (e) => {
    currentSettings.captionColor = e.target.value;
  });
  
  // Generate story button
  document.getElementById('generate-story').addEventListener('click', () => {
    if (!currentStoryType) {
      showError('Please select a story type first');
      return;
    }
    
    try {
      showLoading('Generating story...');
      
      const targetWords = currentSettings.duration * (appData.videoSpecs.wordsPeMinute / 60) * 60;
      currentStory = generateStory(currentStoryType, targetWords);
      
      // Display story
      const storyPreview = document.getElementById('story-preview');
      const storyText = document.getElementById('story-text');
      const wordCount = document.getElementById('word-count');
      const estimatedDuration = document.getElementById('estimated-duration');
      
      storyText.textContent = currentStory;
      
      const words = calculateWordCount(currentStory);
      const duration = words / (appData.videoSpecs.wordsPeMinute / 60);
      
      wordCount.textContent = `${words} words`;
      estimatedDuration.textContent = formatTime(duration);
      
      storyPreview.classList.remove('hidden');
      hideLoading();
      
    } catch (error) {
      hideLoading();
      showError(error.message);
    }
  });
  
  // Preview video button
  document.getElementById('preview-video').addEventListener('click', () => {
    if (!currentStory) {
      showError('Please generate a story first');
      return;
    }
    
    // Start preview animation
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    
    function animate() {
      drawBackground(performance.now());
      drawCaptions('Preview: ' + currentStory.substring(0, 100) + '...', 0);
      animationId = requestAnimationFrame(animate);
    }
    
    animate();
  });
  
  // Generate video button
  document.getElementById('generate-video').addEventListener('click', generateVideo);
  
  // Error toast close
  document.querySelector('.error-close').addEventListener('click', () => {
    document.getElementById('error-toast').classList.add('hidden');
  });
  
  // Initial canvas render
  drawBackground(0);
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop();
  }
  
  if (currentUtterance) {
    speechSynthesis.cancel();
  }
  
  if (audioContext) {
    audioContext.close();
  }
});