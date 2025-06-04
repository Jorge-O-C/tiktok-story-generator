// Application data
const appData = {
  "platforms": [
    {
      "name": "iPhone Messages",
      "id": "iphone",
      "colors": {
        "sent": "#007AFF",
        "received": "#E5E5EA",
        "background": "#FFFFFF"
      },
      "features": ["read_receipts", "typing_indicators", "reactions", "effects"]
    },
    {
      "name": "WhatsApp",
      "id": "whatsapp",
      "colors": {
        "sent": "#DCF8C6",
        "received": "#FFFFFF",
        "background": "#E5DDD5"
      },
      "features": ["check_marks", "voice_messages", "status_indicators"]
    },
    {
      "name": "Instagram DM",
      "id": "instagram",
      "colors": {
        "sent": "linear-gradient(45deg, #833AB4, #FD1D1D, #FCB045)",
        "received": "#EFEFEF",
        "background": "#FFFFFF"
      },
      "features": ["heart_reactions", "story_rings", "gradient_messages"]
    },
    {
      "name": "Android Messages",
      "id": "android",
      "colors": {
        "sent": "#1976D2",
        "received": "#F1F3F4",
        "background": "#FFFFFF"
      },
      "features": ["material_design", "rcs_features", "smart_replies"]
    }
  ],
  "aiPrompts": [
    {
      "category": "drama",
      "themes": ["cheating_discovery", "family_secrets", "revenge_plot", "workplace_betrayal", "friend_betrayal"],
      "characters": ["suspicious_partner", "best_friend", "family_member", "coworker", "ex_relationship"],
      "emotions": ["anger", "betrayal", "shock", "revenge", "heartbreak"]
    },
    {
      "category": "relationships",
      "themes": ["breakup_text", "love_confession", "jealousy", "misunderstanding", "reunion"],
      "characters": ["boyfriend", "girlfriend", "crush", "ex", "dating_app_match"],
      "emotions": ["love", "hurt", "confusion", "hope", "passion"]
    },
    {
      "category": "horror",
      "themes": ["unknown_number", "stalker_messages", "mysterious_threats", "creepy_encounters"],
      "characters": ["unknown_person", "stalker", "mysterious_figure", "deleted_contact"],
      "emotions": ["fear", "paranoia", "dread", "confusion", "terror"]
    },
    {
      "category": "comedy",
      "themes": ["autocorrect_fails", "wrong_number", "parent_confusion", "funny_misunderstandings"],
      "characters": ["confused_parent", "wrong_recipient", "autocorrect_victim", "tech_challenged_relative"],
      "emotions": ["embarrassment", "laughter", "confusion", "awkwardness"]
    },
    {
      "category": "family",
      "themes": ["parent_discovery", "sibling_rivalry", "family_secrets", "inheritance_drama"],
      "characters": ["mom", "dad", "sibling", "grandparent", "cousin"],
      "emotions": ["disappointment", "pride", "concern", "love", "frustration"]
    }
  ],
  "voiceOptions": [
    {"name": "Emma", "gender": "female", "accent": "american", "tone": "friendly"},
    {"name": "Ryan", "gender": "male", "accent": "american", "tone": "confident"},
    {"name": "Sophia", "gender": "female", "accent": "british", "tone": "elegant"},
    {"name": "Marcus", "gender": "male", "accent": "british", "tone": "professional"},
    {"name": "Isabella", "gender": "female", "accent": "american", "tone": "energetic"},
    {"name": "Jake", "gender": "male", "accent": "american", "tone": "casual"}
  ],
  "backgroundVideos": [
    {"name": "Minecraft Parkour", "category": "gaming", "duration": "10min"},
    {"name": "GTA Driving", "category": "gaming", "duration": "10min"},
    {"name": "Subway Surfers", "category": "gaming", "duration": "10min"},
    {"name": "Abstract Patterns", "category": "abstract", "duration": "10min"},
    {"name": "ASMR Satisfying", "category": "asmr", "duration": "10min"}
  ],
  "testimonials": [
    {
      "name": "Alex M.",
      "avatar": "👨‍💻",
      "followers": "2.1M",
      "quote": "This tool helped me grow from 10K to 2M followers in 6 months!",
      "platform": "TikTok"
    },
    {
      "name": "Sarah K.",
      "avatar": "👩‍🎨",
      "followers": "850K",
      "quote": "The AI-generated messages are so realistic, my videos always go viral!",
      "platform": "TikTok"
    },
    {
      "name": "Mike D.",
      "avatar": "🎬",
      "followers": "1.5M",
      "quote": "Best content creation tool I've ever used. Professional quality every time.",
      "platform": "YouTube"
    }
  ],
  "features": [
    {
      "title": "AI Message Generator",
      "description": "Generate viral conversation storylines automatically",
      "icon": "🤖",
      "stat": "10M+ Generated Messages"
    },
    {
      "title": "Authentic Platforms",
      "description": "Perfect replicas of iPhone, WhatsApp, Instagram & Android",
      "icon": "📱",
      "stat": "4 Platform Styles"
    },
    {
      "title": "Split-Screen Videos",
      "description": "Combine multiple videos in TikTok-optimized format",
      "icon": "🎬",
      "stat": "HD Quality Output"
    },
    {
      "title": "AI Vocal Remover",
      "description": "Extract vocals from any audio or video file",
      "icon": "🎵",
      "stat": "5 Supported Formats"
    },
    {
      "title": "Video Downloader",
      "description": "Download from TikTok & YouTube in any quality",
      "icon": "⬇️",
      "stat": "Multiple Formats"
    },
    {
      "title": "Reddit Story Videos",
      "description": "Generate 3-10 minute story videos automatically",
      "icon": "📝",
      "stat": "50+ Story Templates"
    }
  ]
};

// Global state
let currentPlatform = 'iphone';
let messages = [];
let currentTab = 'messages';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  // Make sure the loading overlay is hidden on page load
  hideLoading();
  
  initializeLandingPage();
  initializeApp();
  setupEventListeners();
});

function initializeLandingPage() {
  // Populate features grid
  const featuresGrid = document.getElementById('features-grid');
  if (featuresGrid) {
    featuresGrid.innerHTML = appData.features.map(feature => `
      <div class="feature-card">
        <div class="feature-icon">${feature.icon}</div>
        <h3 class="feature-title">${feature.title}</h3>
        <p class="feature-description">${feature.description}</p>
        <div class="feature-stat">${feature.stat}</div>
      </div>
    `).join('');
  }

  // Populate testimonials
  const testimonialsGrid = document.getElementById('testimonials-grid');
  if (testimonialsGrid) {
    testimonialsGrid.innerHTML = appData.testimonials.map(testimonial => `
      <div class="testimonial-card">
        <div class="testimonial-avatar">${testimonial.avatar}</div>
        <div class="testimonial-quote">"${testimonial.quote}"</div>
        <div class="testimonial-author">${testimonial.name}</div>
        <div class="testimonial-followers">${testimonial.followers} followers on ${testimonial.platform}</div>
      </div>
    `).join('');
  }
}

function initializeApp() {
  // Initialize platform selector
  const platformSelector = document.getElementById('platform-selector');
  if (platformSelector) {
    platformSelector.innerHTML = appData.platforms.map(platform => `
      <div class="platform-option ${platform.id === currentPlatform ? 'active' : ''}" 
           data-platform="${platform.id}">
        ${platform.name}
      </div>
    `).join('');
  }

  // Initialize voice options
  const voiceSelect = document.getElementById('voice-select');
  if (voiceSelect) {
    voiceSelect.innerHTML = appData.voiceOptions.map(voice => `
      <option value="${voice.name}">${voice.name} (${voice.gender}, ${voice.accent})</option>
    `).join('');
  }

  // Initialize background videos
  const backgroundSelect = document.getElementById('background-select');
  if (backgroundSelect) {
    backgroundSelect.innerHTML = appData.backgroundVideos.map(bg => `
      <option value="${bg.name}">${bg.name} (${bg.duration})</option>
    `).join('');
  }

  // Set initial platform
  selectPlatform(currentPlatform);
}

function setupEventListeners() {
  // Get Started buttons
  document.querySelectorAll('#get-started-btn, #hero-cta-btn, .get-started-btn').forEach(button => {
    button.addEventListener('click', function() {
      showApp();
    });
  });
  
  // Tab links
  document.querySelectorAll('.tab-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const tab = this.getAttribute('data-tab');
      showApp(tab);
    });
  });
  
  // Return to home
  const returnToHome = document.getElementById('return-to-home');
  if (returnToHome) {
    returnToHome.addEventListener('click', showLanding);
  }

  // Tab switching
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  // Platform selection
  document.querySelectorAll('.platform-option').forEach(option => {
    option.addEventListener('click', function() {
      const platformId = this.getAttribute('data-platform');
      selectPlatform(platformId);
    });
  });
  
  // AI Message generation
  const generateAiBtn = document.getElementById('generate-ai-btn');
  if (generateAiBtn) {
    generateAiBtn.addEventListener('click', generateAIMessages);
  }
  
  // Add Message
  const addMessageBtn = document.getElementById('add-message-btn');
  if (addMessageBtn) {
    addMessageBtn.addEventListener('click', addMessage);
  }
  
  // Generate Message Video
  const generateVideoBtn = document.getElementById('generate-video-btn');
  if (generateVideoBtn) {
    generateVideoBtn.addEventListener('click', generateMessageVideo);
  }
  
  // Generate Reddit Video
  const generateRedditBtn = document.getElementById('generate-reddit-btn');
  if (generateRedditBtn) {
    generateRedditBtn.addEventListener('click', generateRedditVideo);
  }
  
  // Create Split Video
  const createSplitBtn = document.getElementById('create-split-btn');
  if (createSplitBtn) {
    createSplitBtn.addEventListener('click', createSplitVideo);
  }
  
  // Remove Vocals
  const removeVocalsBtn = document.getElementById('remove-vocals-btn');
  if (removeVocalsBtn) {
    removeVocalsBtn.addEventListener('click', removeVocals);
  }
  
  // Download Video
  const downloadVideoBtn = document.getElementById('download-video-btn');
  if (downloadVideoBtn) {
    downloadVideoBtn.addEventListener('click', downloadVideo);
  }

  // File upload handlers
  setupFileUpload('upload-top', 'video1');
  setupFileUpload('upload-bottom', 'video2');
  setupFileUpload('upload-audio', 'audio-file');
}

function setupFileUpload(containerId, inputId) {
  const container = document.getElementById(containerId);
  const input = document.getElementById(inputId);
  
  if (container && input) {
    container.addEventListener('click', function() {
      input.click();
    });
    
    input.addEventListener('change', handleFileUpload);
  }
}

function showApp(tab = 'messages') {
  const landingPage = document.getElementById('landing-page');
  const mainApp = document.getElementById('main-app');
  
  if (landingPage && mainApp) {
    landingPage.classList.add('hidden');
    mainApp.classList.remove('hidden');
    
    if (tab) {
      switchTab(tab);
    }
  }
}

function showLanding() {
  const landingPage = document.getElementById('landing-page');
  const mainApp = document.getElementById('main-app');
  
  if (landingPage && mainApp) {
    landingPage.classList.remove('hidden');
    mainApp.classList.add('hidden');
  }
}

function switchTab(tabId) {
  // Update active tab
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  const activeTabButton = document.querySelector(`.nav-tab[data-tab="${tabId}"]`);
  if (activeTabButton) {
    activeTabButton.classList.add('active');
  }

  // Update active content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  
  const activeTabContent = document.getElementById(`${tabId}-tab`);
  if (activeTabContent) {
    activeTabContent.classList.add('active');
  }

  currentTab = tabId;
}

function selectPlatform(platformId) {
  currentPlatform = platformId;
  
  // Update platform selector
  document.querySelectorAll('.platform-option').forEach(option => {
    option.classList.remove('active');
  });
  
  const activePlatform = document.querySelector(`.platform-option[data-platform="${platformId}"]`);
  if (activePlatform) {
    activePlatform.classList.add('active');
  }

  // Update phone preview
  updatePhonePreview();
}

function updatePhonePreview() {
  const phoneScreen = document.getElementById('phone-screen');
  if (!phoneScreen) return;
  
  const platform = appData.platforms.find(p => p.id === currentPlatform);
  
  // Remove existing platform classes
  phoneScreen.className = 'phone-screen';
  phoneScreen.classList.add(currentPlatform);

  // Update contact name in preview
  const contactNameInput = document.getElementById('contact-name');
  const contactNameDisplay = document.getElementById('preview-contact-name');
  
  if (contactNameInput && contactNameDisplay) {
    const contactName = contactNameInput.value || 'Contact';
    contactNameDisplay.textContent = contactName;
  }

  // Re-render messages
  renderMessages();
}

function renderMessages() {
  const messagesContainer = document.getElementById('messages-container');
  if (!messagesContainer) return;
  
  if (messages.length === 0) {
    messagesContainer.innerHTML = '<div class="welcome-message">Select a platform and start creating your conversation!</div>';
    return;
  }

  messagesContainer.innerHTML = messages.map((message, index) => {
    const timeStamp = new Date(Date.now() - (messages.length - index) * 60000).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
    
    return `
      <div class="message-bubble ${message.type}">
        ${message.text}
      </div>
      ${index === messages.length - 1 ? `<div class="message-time">${timeStamp}</div>` : ''}
    `;
  }).join('');
  
  // Scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function addMessage() {
  const messageText = document.getElementById('message-text');
  const messageType = document.getElementById('message-type');
  const contactName = document.getElementById('contact-name');
  const previewContactName = document.getElementById('preview-contact-name');
  
  if (!messageText || !messageType) return;
  
  const text = messageText.value.trim();
  const type = messageType.value;
  
  if (!text) {
    alert('Please enter a message');
    return;
  }

  if (contactName && previewContactName && contactName.value.trim()) {
    previewContactName.textContent = contactName.value.trim();
  }

  messages.push({
    text: text,
    type: type,
    timestamp: Date.now()
  });

  // Clear form
  messageText.value = '';
  
  // Re-render messages
  renderMessages();
}

function generateAIMessages() {
  const categorySelect = document.getElementById('ai-category');
  if (!categorySelect) return;
  
  const category = categorySelect.value;
  if (!category) {
    alert('Please select a category first');
    return;
  }

  showLoading('Generating AI conversation...');

  // Find the selected category data
  const categoryData = appData.aiPrompts.find(prompt => 
    prompt.category.toLowerCase() === category.toLowerCase()
  );

  // Generate realistic conversation based on category
  setTimeout(() => {
    messages = generateConversationForCategory(category);
    renderMessages();
    hideLoading();
    
    // Update contact name based on category
    const contactName = getContactNameForCategory(category);
    document.getElementById('contact-name').value = contactName;
    document.getElementById('preview-contact-name').textContent = contactName;
  }, 2000);
}

function generateConversationForCategory(category) {
  const conversations = {
    drama: [
      { text: "We need to talk", type: "received" },
      { text: "About what?", type: "sent" },
      { text: "I saw you with Sarah last night", type: "received" },
      { text: "It's not what you think", type: "sent" },
      { text: "Really? Because it looked pretty clear to me", type: "received" },
      { text: "She was just helping me pick out a gift for YOU", type: "sent" },
      { text: "Don't lie to me anymore", type: "received" },
      { text: "I'm not lying! Check my phone if you want", type: "sent" },
      { text: "I already did. I saw the texts.", type: "received" },
      { text: "What texts? There's nothing there", type: "sent" },
      { text: "The ones you deleted. I recovered them.", type: "received" }
    ],
    relationships: [
      { text: "Hey", type: "sent" },
      { text: "Hi", type: "received" },
      { text: "I've been thinking about us", type: "sent" },
      { text: "What about us?", type: "received" },
      { text: "I think I'm falling for you", type: "sent" },
      { text: "...", type: "received" },
      { text: "Say something", type: "sent" },
      { text: "I don't know what to say", type: "received" },
      { text: "Do you feel the same way?", type: "sent" },
      { text: "It's complicated", type: "received" },
      { text: "What's complicated about it?", type: "sent" },
      { text: "I'm still getting over my ex", type: "received" }
    ],
    horror: [
      { text: "Who is this?", type: "sent" },
      { text: "You know who this is", type: "received" },
      { text: "No I don't. How did you get this number?", type: "sent" },
      { text: "I've been watching you", type: "received" },
      { text: "What? This isn't funny", type: "sent" },
      { text: "I know you're alone right now", type: "received" },
      { text: "I'm calling the police", type: "sent" },
      { text: "They can't help you", type: "received" },
      { text: "Leave me alone!", type: "sent" },
      { text: "Look outside your window", type: "received" },
      { text: "There's no one there", type: "sent" },
      { text: "Check again", type: "received" }
    ],
    comedy: [
      { text: "Hey mom", type: "sent" },
      { text: "Hi sweety how are you", type: "received" },
      { text: "Good, just wanted to check in", type: "sent" },
      { text: "That's nice deer", type: "received" },
      { text: "*dear", type: "received" },
      { text: "Mom you know you can edit messages right?", type: "sent" },
      { text: "How do I do that", type: "received" },
      { text: "Hold down on the message", type: "sent" },
      { text: "I'm holding it but nothing is happening", type: "received" },
      { text: "Are you actually holding your phone against the message?", type: "sent" },
      { text: "Yes should I hold harder", type: "received" },
      { text: "Mom no 😂", type: "sent" }
    ],
    family: [
      { text: "Dad we need to talk", type: "sent" },
      { text: "What's wrong?", type: "received" },
      { text: "I got my report card today", type: "sent" },
      { text: "And?", type: "received" },
      { text: "I failed math", type: "sent" },
      { text: "What do you mean you failed?", type: "received" },
      { text: "I got an F", type: "sent" },
      { text: "How is that possible? You had a tutor!", type: "received" },
      { text: "I know, I'm sorry", type: "sent" },
      { text: "We're going to have a serious conversation when I get home", type: "received" },
      { text: "Am I grounded?", type: "sent" },
      { text: "We'll discuss it tonight", type: "received" }
    ]
  };

  return conversations[category] || conversations.drama;
}

function getContactNameForCategory(category) {
  const names = {
    drama: "Alex",
    relationships: "Sam",
    horror: "Unknown",
    comedy: "Mom",
    family: "Dad"
  };
  return names[category] || "Contact";
}

function generateMessageVideo() {
  if (messages.length === 0) {
    alert('Please add some messages first');
    return;
  }

  showLoading('Generating message video...');

  // Simulate video generation
  setTimeout(() => {
    hideLoading();
    alert('Message video generated successfully! In a real app, this would download the video file.');
  }, 3000);
}

function generateRedditVideo() {
  const categorySelect = document.getElementById('reddit-category');
  const voiceSelect = document.getElementById('voice-select');
  const backgroundSelect = document.getElementById('background-select');
  
  if (!categorySelect || !voiceSelect || !backgroundSelect) return;

  const category = categorySelect.value;
  const voice = voiceSelect.value;
  const background = backgroundSelect.value;

  showLoading('Generating Reddit story video...');

  setTimeout(() => {
    hideLoading();
    alert(`Reddit ${category} video generated with ${voice} voice over ${background} background!`);
  }, 4000);
}

function createSplitVideo() {
  const video1 = document.getElementById('video1');
  const video2 = document.getElementById('video2');
  
  if (!video1 || !video2) return;
  
  const file1 = video1.files[0];
  const file2 = video2.files[0];

  if (!file1 || !file2) {
    alert('Please upload both videos');
    return;
  }

  showLoading('Creating split-screen video...');

  setTimeout(() => {
    hideLoading();
    alert('Split-screen video created successfully!');
  }, 3000);
}

function removeVocals() {
  const audioFile = document.getElementById('audio-file');
  if (!audioFile) return;
  
  const file = audioFile.files[0];

  if (!file) {
    alert('Please upload an audio or video file');
    return;
  }

  showLoading('Removing vocals using AI...');

  setTimeout(() => {
    hideLoading();
    alert('Vocals removed successfully! Instrumental track ready for download.');
  }, 5000);
}

function downloadVideo() {
  const urlInput = document.getElementById('video-url');
  const qualitySelect = document.getElementById('quality-select');
  
  if (!urlInput || !qualitySelect) return;
  
  const url = urlInput.value.trim();
  const quality = qualitySelect.value;

  if (!url) {
    alert('Please enter a video URL');
    return;
  }

  if (!url.includes('tiktok.com') && !url.includes('youtube.com') && !url.includes('youtu.be')) {
    alert('Please enter a valid TikTok or YouTube URL');
    return;
  }

  showLoading('Downloading video...');

  setTimeout(() => {
    hideLoading();
    alert(`Video downloaded in ${quality} quality!`);
  }, 3000);
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const fileName = file.name;
    const uploadArea = event.target.parentElement;
    uploadArea.innerHTML = `
      <i class="fas fa-check-circle" style="color: var(--color-success);"></i>
      <p>${fileName}</p>
      <input type="file" id="${event.target.id}" accept="${event.target.accept}" hidden>
    `;
  }
}

function showLoading(text = 'Processing...') {
  const loadingText = document.getElementById('loading-text');
  const loadingOverlay = document.getElementById('loading-overlay');
  
  if (loadingText) {
    loadingText.textContent = text;
  }
  
  if (loadingOverlay) {
    loadingOverlay.classList.remove('hidden');
  }
}

function hideLoading() {
  const loadingOverlay = document.getElementById('loading-overlay');
  if (loadingOverlay) {
    loadingOverlay.classList.add('hidden');
  }
}

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
  // Add floating animation to feature cards
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });

  // Add scroll reveal effect
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe sections for scroll reveal
  document.querySelectorAll('.features, .testimonials, .pricing').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });
});