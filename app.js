document.addEventListener('DOMContentLoaded', function() {
    // Application data
    const appData = {
        storyTypes: [
            {
                id: "aita",
                name: "AITA",
                fullName: "Am I The Asshole",
                description: "Moral dilemmas seeking community judgment",
                icon: "⚖️",
                color: "#FF6B6B",
                templates: [
                    "I (${age}${gender}) have been ${relationship} with my ${partner} (${partnerAge}${partnerGender}) for ${duration}. Recently, ${situation} happened and now ${conflict}. My family thinks ${opinion1} but my friends say ${opinion2}. The situation escalated when ${escalation}. Now ${consequence} and I'm questioning everything. Some people are calling me ${judgment1} while others say I'm ${judgment2}. The worst part is ${impact} and it's affecting ${relationships}. I've tried ${attempts} but nothing seems to work. Everyone has an opinion but I just need to know - AITA?",
                    "So this happened ${timeframe} and I'm still thinking about it. I (${age}${gender}) work ${job} and live with ${livingWith}. The drama started when ${trigger} and ${initialReaction}. My ${relationshipPerson} got involved and said ${theirOpinion}, which made things worse. The situation is complicated because ${complication} and ${history}. I admit I probably shouldn't have ${mistake}, but ${justification}. Everyone is picking sides now - ${supporters} are supporting me while ${opposition} think I'm wrong. The tension is so thick you could cut it with a knife. ${currentSituation} and I don't know how to fix this mess. Reddit, please help me figure out if I'm the asshole here."
                ]
            },
            {
                id: "tifu",
                name: "TIFU",
                fullName: "Today I F***ed Up",
                description: "Embarrassing mistakes and consequences",
                icon: "🤦",
                color: "#4ECDC4",
                templates: [
                    "So this actually happened ${timeframe} but I'm just now getting the courage to share. I (${age}${gender}) was ${activity} when ${setup}. Everything was going fine until ${mistake}. I should have realized ${warning}, but like an idiot, I ${action}. The moment I ${realization}, I knew I was screwed. ${witness} was there and saw the whole thing. The immediate aftermath was ${consequence1}, but that was just the beginning. ${consequence2} happened next, followed by the worst part: ${consequence3}. I tried to ${fixAttempt} but that only made things worse because ${backfire}. The embarrassment was unbearable - ${embarrassment}. To make matters worse, ${additionalProblems}. My ${relationship} still brings it up and ${currentImpact}. I learned ${lesson} the hard way. TL;DR: ${tldr}",
                    "This is a story about how one simple decision ruined my ${period}. It started ${beginning} when I thought it would be a good idea to ${idea}. My ${person} warned me that ${warning} but I didn't listen. The plan was simple: ${plan}. What could go wrong, right? Well, everything. First, ${problem1} happened. Then ${problem2}. By the time ${problem3} occurred, I realized I was in deep trouble. The panic set in when ${panic}. I tried calling ${help} but ${helpResult}. The situation spiraled when ${spiral} and suddenly ${bigConsequence}. The aftermath involved ${aftermath} and lots of explaining to ${people}. The most embarrassing part was ${mostEmbarrassing}. Even now, ${currentStatus} and I'm reminded of my stupidity every time ${reminder}. Never again will I ${resolution}."
                ]
            },
            {
                id: "relationship",
                name: "Relationship Advice",
                fullName: "Relationship Advice",
                description: "Seeking guidance on interpersonal conflicts",
                icon: "💔",
                color: "#45B7D1",
                templates: [
                    "I (${age}${gender}) have been with my ${partner} (${partnerAge}${partnerGender}) for ${duration}. Our relationship started ${beginning} and things were amazing at first. We ${goodTimes} and I thought ${initialThoughts}. However, recently things have changed. The problems started ${problemStart} when ${trigger}. Now ${currentIssue} and it's happening ${frequency}. I've tried ${attempts} but ${attemptResults}. The situation is affecting ${effects} and I'm starting to feel ${feelings}. My friends say ${friendAdvice} while my family thinks ${familyAdvice}. The confusing part is ${confusion} and I don't know what to believe anymore. We've had ${previousIssues} before but this feels different because ${difference}. I love ${partnerName} but ${concerns}. Should I ${option1}, ${option2}, or ${option3}? Any advice would be appreciated because I'm lost.",
                    "Posting here because I need outside perspective on my relationship. My ${partner} (${partnerAge}) and I (${age}) have been together for ${duration}. The relationship has always had ${pattern} but lately ${recentChange}. The breaking point was ${breakingPoint} which led to ${aftermath}. I discovered ${discovery} and now I'm questioning ${questioning}. We've tried ${solutions} including ${attempts} but nothing seems to stick. The cycle keeps repeating: ${cycle}. I'm torn between ${option1} and ${option2}. Part of me thinks ${hope} while another part believes ${doubt}. Our ${mutualPeople} are getting involved and ${theirInvolvement}. The stress is affecting ${lifeAreas} and I can't focus on ${activities}. I need advice on ${specificAdvice}. Is this relationship worth saving or am I just prolonging the inevitable?"
                ]
            }
        ],
        durations: [
            {minutes: 2, words: 280},
            {minutes: 3, words: 420},
            {minutes: 4, words: 560},
            {minutes: 5, words: 700},
            {minutes: 6, words: 840},
            {minutes: 7, words: 980},
            {minutes: 8, words: 1120},
            {minutes: 9, words: 1260},
            {minutes: 10, words: 1400}
        ]
    };

    // State management
    let state = {
        selectedStoryType: null,
        duration: 5,
        generatedStory: "",
        wordCount: 0,
        voice: "default",
        speed: 1.0,
        background: "minecraft",
        captionColor: "#ffffff",
        isPlaying: false,
        currentWord: 0,
        utterance: null,
        synth: window.speechSynthesis
    };

    // DOM Elements
    const storyCards = document.querySelectorAll('.story-card');
    const durationSlider = document.getElementById('duration-slider');
    const durationValue = document.querySelector('.duration-value');
    const wordCount = document.querySelector('.word-count');
    const generateBtn = document.getElementById('generate-story');
    const storyDisplay = document.getElementById('story-display');
    const storyContent = document.getElementById('story-content');
    const wordCountDisplay = document.getElementById('word-count-display');
    const readingTime = document.getElementById('reading-time');
    const videoSettings = document.getElementById('video-settings');
    const voiceSelect = document.getElementById('voice-select');
    const speedSlider = document.getElementById('speed-slider');
    const speedValue = document.getElementById('speed-value');
    const backgroundSelect = document.getElementById('background-select');
    const captionColor = document.getElementById('caption-color');
    const videoPreviewSection = document.getElementById('video-preview-section');
    const videoBackground = document.getElementById('video-background');
    const captionText = document.getElementById('caption-text');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const progressFill = document.getElementById('progress-fill');
    const volumeBtn = document.getElementById('volume-btn');
    const exportSection = document.getElementById('export-section');
    const copyTextBtn = document.getElementById('copy-text-btn');
    const previewVideoBtn = document.getElementById('preview-video-btn');

    // Random content generators
    const randomContent = {
        ages: ["18", "22", "25", "28", "32", "35", "40", "45"],
        genders: ["M", "F", "NB"],
        partners: ["boyfriend", "girlfriend", "husband", "wife", "partner", "fiancé", "fiancée"],
        durations: ["6 months", "1 year", "2 years", "3 years", "5 years", "7 years"],
        situations: [
            "they forgot my birthday",
            "they invited their ex to our anniversary dinner",
            "they spent our savings on a gaming PC",
            "they criticized my cooking in front of their parents",
            "they made a scene at my sister's wedding",
            "they revealed a personal secret to their friends"
        ],
        conflicts: [
            "they're not speaking to me",
            "they want me to apologize",
            "I'm sleeping on the couch",
            "they're threatening to leave",
            "we're arguing constantly",
            "they're giving me the silent treatment"
        ],
        opinions: [
            "I'm overreacting",
            "I have every right to be upset",
            "we both need to compromise",
            "it's just a misunderstanding",
            "I should stand my ground",
            "we need couples therapy"
        ],
        escalations: [
            "they brought up past mistakes",
            "their mother got involved",
            "I threw their clothes out the window",
            "they blocked me on social media",
            "I threatened to move out",
            "they returned my anniversary gift"
        ],
        consequences: [
            "we're not on speaking terms",
            "I'm staying at a friend's place",
            "they've moved out temporarily",
            "our mutual friends are divided",
            "the wedding might be canceled",
            "I'm reconsidering the relationship"
        ],
        judgments: ["selfish", "inconsiderate", "controlling", "dramatic", "unreasonable", "jealous"],
        impacts: ["I can't sleep", "I've lost my appetite", "I can't focus at work", "I'm constantly anxious"],
        relationships: ["our friendship circle", "my mental health", "our shared living situation", "our future plans"],
        attempts: ["talking it out calmly", "suggesting couples therapy", "giving them space", "writing them a letter"],
        timeframes: ["yesterday", "last week", "a few days ago", "this morning", "last month", "last weekend"],
        jobs: ["as a teacher", "in tech", "in healthcare", "at a restaurant", "in finance"],
        livingWith: ["my partner", "roommates", "my parents", "alone", "my best friend"],
        triggers: [
            "they came home late without calling",
            "I found suspicious texts",
            "they made a big purchase without discussing it",
            "they forgot an important date"
        ],
        reactions: ["I confronted them immediately", "I silently stewed", "I called my mom crying"],
        relationshipPersons: ["mother", "best friend", "brother", "sister", "coworker"],
        complications: ["we live together", "we work at the same place", "we share finances", "we have a child"],
        histories: ["we've had trust issues before", "we've always communicated poorly", "we were high school sweethearts"],
        mistakes: ["yelled at them in public", "snooped through their phone", "talked behind their back"],
        justifications: ["I was really hurt", "I felt betrayed", "I was scared of losing them"],
        supporters: ["my close friends", "my family", "my therapist", "my coworkers"],
        opposition: ["their friends", "their family", "our mutual friends", "some people online"],
        currentSituations: ["we're barely speaking", "they're staying with friends", "I'm sleeping on the couch"],
        activities: ["at work", "on vacation", "at a party", "at the gym", "at home"],
        setups: ["I was trying to impress everyone", "I thought I was being clever", "I was showing off"],
        warnings: ["the signs were clear", "people tried to warn me", "I had a bad feeling"],
        actions: ["went ahead anyway", "ignored all advice", "decided to take a risk"],
        realizations: ["saw everyone staring", "heard the gasps", "felt the pain", "smelled smoke"],
        witnesses: ["My boss", "My crush", "My entire family", "Everyone at the party"],
        fixAttempts: ["apologize profusely", "pretend nothing happened", "blame someone else"],
        backfires: ["it made things worse", "I tripped and fell again", "I accidentally insulted someone"],
        embarrassments: [
            "my face was redder than a tomato",
            "I wanted the ground to swallow me",
            "I couldn't look anyone in the eye"
        ],
        additionalProblems: ["someone recorded it all", "it went viral online", "I got a nickname from the incident"],
        currentImpacts: ["still teases me about it", "won't let me forget", "brings it up at every gathering"],
        lessons: ["to always check before acting", "that showing off isn't worth it", "to listen to warnings"],
        tldrs: [
            "I tried to show off and ended up embarrassing myself",
            "One stupid decision led to public humiliation",
            "Ignored warnings and paid the price"
        ],
        periods: ["weekend", "vacation", "relationship", "career", "reputation"],
        beginnings: ["on a dating app", "through mutual friends", "at college", "at work"],
        ideas: ["to surprise them", "to be spontaneous", "to try something new", "to prove myself"],
        people: ["friend", "coworker", "family member", "neighbor"],
        plans: ["simple and foolproof", "well thought out", "spontaneous", "carefully planned"],
        problems: ["everything went wrong", "it backfired", "I made a mistake", "someone interfered"],
        panics: ["I realized I was in trouble", "everything fell apart", "I couldn't fix it"],
        helps: ["a friend", "family", "a professional", "customer service"],
        helpResults: ["they couldn't help", "they made it worse", "they laughed at me"],
        spirals: ["I made another mistake", "panic set in", "I couldn't think straight"],
        bigConsequences: ["I lost my job", "I ruined the relationship", "I embarrassed my family"],
        aftermaths: ["lots of apologizing", "damage control", "awkward explanations"],
        peoples: ["my friends", "my family", "my coworkers", "strangers"],
        mostEmbarrassing: ["everyone saw me fail", "it was caught on camera", "I became a meme"],
        currentStatuses: ["I'm still dealing with it", "people still remember", "it haunts me"],
        reminders: ["I see the place", "someone mentions it", "I think about it"],
        resolutions: ["try that again", "be so reckless", "ignore good advice"],
        goodTimes: ["traveled together", "spent every weekend together", "shared the same hobbies"],
        initialThoughts: ["they were the one", "we had a perfect relationship", "I'd found my soulmate"],
        problemStarts: ["a month ago", "after we moved in together", "when they got a new job"],
        currentIssues: [
            "they're constantly on their phone",
            "they don't make time for me",
            "they criticize everything I do"
        ],
        frequencies: ["every day", "whenever we're together", "multiple times a week"],
        attemptResults: ["nothing changed", "they got defensive", "it made things worse"],
        effects: ["my work", "my sleep", "my friendships", "my mental health"],
        feelings: ["hopeless", "confused", "angry", "sad"],
        friendAdvices: ["break up with them", "give them another chance", "set boundaries"],
        familyAdvices: ["work it out", "they're not right for you", "relationships take work"],
        confusions: ["they say one thing but do another", "I don't know what's real anymore"],
        previousIssues: ["communication problems", "trust issues", "different goals"],
        differences: ["this feels permanent", "they seem checked out", "I'm losing hope"],
        names: ["Alex", "Sam", "Jamie", "Jordan", "Taylor"],
        concerns: ["I don't trust them anymore", "we're growing apart", "we want different things"],
        options: ["break up", "try counseling", "take a break", "move out", "set an ultimatum"],
        patterns: ["ups and downs", "good weeks and bad weeks", "cycles of fighting"],
        recentChanges: ["they've become distant", "they're always busy", "they seem unhappy"],
        breakingPoints: ["they lied to me", "they chose friends over me", "they forgot our anniversary"],
        discoveries: ["texts from their ex", "they've been hiding money", "they're unhappy"],
        questionings: ["everything", "their feelings", "our future", "my own judgment"],
        solutions: ["talking more", "spending quality time", "couples therapy"],
        cycles: ["fight, makeup, repeat", "good days followed by bad ones", "hope then disappointment"],
        hopes: ["we can work through this", "they still love me", "it's just a rough patch"],
        doubts: ["we're incompatible", "they've checked out", "I'm wasting my time"],
        mutualPeoples: ["friends", "family members", "coworkers"],
        theirInvolvements: ["they're taking sides", "they're giving advice", "they're staying neutral"],
        lifeAreas: ["work", "family relationships", "my health", "my hobbies"],
        activities: ["work", "hobbies", "time with friends", "self-care"],
        specificAdvices: ["whether to stay or go", "how to communicate better", "if this is normal"]
    };

    // Helper function to get random item from array
    function getRandomFromArray(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // Initialize event listeners
    function initializeEvents() {
        // Story type selection
        storyCards.forEach(card => {
            card.addEventListener('click', function() {
                selectStoryType(this.dataset.type);
            });
        });

        // Duration slider
        durationSlider.addEventListener('input', updateDurationUI);
        
        // Generate button
        generateBtn.addEventListener('click', generateStory);

        // Voice settings
        voiceSelect.addEventListener('change', function() {
            state.voice = this.value;
        });

        // Speed slider
        speedSlider.addEventListener('input', function() {
            state.speed = parseFloat(this.value);
            speedValue.textContent = `${state.speed.toFixed(1)}x`;
        });

        // Background settings
        backgroundSelect.addEventListener('change', function() {
            state.background = this.value;
            updateBackgroundPreview();
        });

        // Caption color
        captionColor.addEventListener('input', function() {
            state.captionColor = this.value;
            captionText.style.color = state.captionColor;
        });

        // Video controls
        playPauseBtn.addEventListener('click', togglePlayPause);
        volumeBtn.addEventListener('click', toggleMute);

        // Export buttons
        copyTextBtn.addEventListener('click', copyTextToClipboard);
        previewVideoBtn.addEventListener('click', previewFullVideo);
    }

    // Select a story type
    function selectStoryType(type) {
        state.selectedStoryType = type;
        
        // Update UI to reflect selection
        storyCards.forEach(card => {
            if (card.dataset.type === type) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });
    }

    // Update duration UI
    function updateDurationUI() {
        const minutes = parseInt(durationSlider.value);
        state.duration = minutes;
        
        // Find the corresponding word count
        const durationData = appData.durations.find(d => d.minutes === minutes);
        const wordCountValue = durationData ? durationData.words : 700;
        
        // Update UI
        durationValue.textContent = `${minutes} minutes`;
        wordCount.textContent = `(~${wordCountValue} words)`;
    }

    // Generate a story based on selected type and duration
    function generateStory() {
        if (!state.selectedStoryType) {
            alert("Please select a story type first!");
            return;
        }
        
        // Show loading state
        generateBtn.classList.add('loading');
        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';

        setTimeout(() => {
            // Find the selected story type data
            const storyType = appData.storyTypes.find(type => type.id === state.selectedStoryType);
            
            // Find the word count for selected duration
            const durationData = appData.durations.find(d => d.minutes === state.duration);
            const targetWordCount = durationData ? durationData.words : 700;
            
            // Select a random template
            const template = storyType.templates[Math.floor(Math.random() * storyType.templates.length)];
            
            // Generate the story with filled placeholders
            const story = generateStoryFromTemplate(template, storyType.id, targetWordCount);
            
            // Update state and UI
            state.generatedStory = story;
            state.wordCount = countWords(story);
            
            displayGeneratedStory();
            
            // Reset loading state
            generateBtn.classList.remove('loading');
            generateBtn.disabled = false;
            generateBtn.textContent = '✨ Generate Story';
            
            // Show additional sections
            videoSettings.style.display = 'block';
            videoPreviewSection.style.display = 'block';
            exportSection.style.display = 'block';
            
            // Add fade-in animation
            storyDisplay.classList.add('fade-in');
            videoSettings.classList.add('fade-in');
            videoPreviewSection.classList.add('fade-in');
            exportSection.classList.add('fade-in');
            
            // Update video preview
            updateBackgroundPreview();
            captionText.style.color = state.captionColor;
        }, 1500);
    }

    // Generate a story from template with proper substitutions
    function generateStoryFromTemplate(template, storyType, targetWordCount) {
        let story = template;
        
        // Replace all placeholders with random content
        story = story.replace(/\${(\w+)}/g, (match, placeholder) => {
            // Map placeholder to random content
            switch(placeholder) {
                case 'age': return getRandomFromArray(randomContent.ages);
                case 'gender': return getRandomFromArray(randomContent.genders);
                case 'partner': return getRandomFromArray(randomContent.partners);
                case 'partnerAge': return getRandomFromArray(randomContent.ages);
                case 'partnerGender': return getRandomFromArray(randomContent.genders);
                case 'duration': return getRandomFromArray(randomContent.durations);
                case 'relationship': return 'dating';
                case 'situation': return getRandomFromArray(randomContent.situations);
                case 'conflict': return getRandomFromArray(randomContent.conflicts);
                case 'opinion1': return getRandomFromArray(randomContent.opinions);
                case 'opinion2': return getRandomFromArray(randomContent.opinions);
                case 'escalation': return getRandomFromArray(randomContent.escalations);
                case 'consequence': return getRandomFromArray(randomContent.consequences);
                case 'judgment1': return getRandomFromArray(randomContent.judgments);
                case 'judgment2': return getRandomFromArray(randomContent.judgments);
                case 'impact': return getRandomFromArray(randomContent.impacts);
                case 'relationships': return getRandomFromArray(randomContent.relationships);
                case 'attempts': return getRandomFromArray(randomContent.attempts);
                case 'timeframe': return getRandomFromArray(randomContent.timeframes);
                case 'job': return getRandomFromArray(randomContent.jobs);
                case 'livingWith': return getRandomFromArray(randomContent.livingWith);
                case 'trigger': return getRandomFromArray(randomContent.triggers);
                case 'initialReaction': return getRandomFromArray(randomContent.reactions);
                case 'relationshipPerson': return getRandomFromArray(randomContent.relationshipPersons);
                case 'theirOpinion': return getRandomFromArray(randomContent.opinions);
                case 'complication': return getRandomFromArray(randomContent.complications);
                case 'history': return getRandomFromArray(randomContent.histories);
                case 'mistake': return getRandomFromArray(randomContent.mistakes);
                case 'justification': return getRandomFromArray(randomContent.justifications);
                case 'supporters': return getRandomFromArray(randomContent.supporters);
                case 'opposition': return getRandomFromArray(randomContent.opposition);
                case 'currentSituation': return getRandomFromArray(randomContent.currentSituations);
                case 'activity': return getRandomFromArray(randomContent.activities);
                case 'setup': return getRandomFromArray(randomContent.setups);
                case 'warning': return getRandomFromArray(randomContent.warnings);
                case 'action': return getRandomFromArray(randomContent.actions);
                case 'realization': return getRandomFromArray(randomContent.realizations);
                case 'witness': return getRandomFromArray(randomContent.witnesses);
                case 'consequence1': return getRandomFromArray(randomContent.consequences);
                case 'consequence2': return getRandomFromArray(randomContent.consequences);
                case 'consequence3': return getRandomFromArray(randomContent.consequences);
                case 'fixAttempt': return getRandomFromArray(randomContent.fixAttempts);
                case 'backfire': return getRandomFromArray(randomContent.backfires);
                case 'embarrassment': return getRandomFromArray(randomContent.embarrassments);
                case 'additionalProblems': return getRandomFromArray(randomContent.additionalProblems);
                case 'currentImpact': return getRandomFromArray(randomContent.currentImpacts);
                case 'lesson': return getRandomFromArray(randomContent.lessons);
                case 'tldr': return getRandomFromArray(randomContent.tldrs);
                case 'period': return getRandomFromArray(randomContent.periods);
                case 'beginning': return getRandomFromArray(randomContent.beginnings);
                case 'idea': return getRandomFromArray(randomContent.ideas);
                case 'person': return getRandomFromArray(randomContent.people);
                case 'plan': return getRandomFromArray(randomContent.plans);
                case 'problem1': return getRandomFromArray(randomContent.problems);
                case 'problem2': return getRandomFromArray(randomContent.problems);
                case 'problem3': return getRandomFromArray(randomContent.problems);
                case 'panic': return getRandomFromArray(randomContent.panics);
                case 'help': return getRandomFromArray(randomContent.helps);
                case 'helpResult': return getRandomFromArray(randomContent.helpResults);
                case 'spiral': return getRandomFromArray(randomContent.spirals);
                case 'bigConsequence': return getRandomFromArray(randomContent.bigConsequences);
                case 'aftermath': return getRandomFromArray(randomContent.aftermaths);
                case 'people': return getRandomFromArray(randomContent.peoples);
                case 'mostEmbarrassing': return getRandomFromArray(randomContent.mostEmbarrassing);
                case 'currentStatus': return getRandomFromArray(randomContent.currentStatuses);
                case 'reminder': return getRandomFromArray(randomContent.reminders);
                case 'resolution': return getRandomFromArray(randomContent.resolutions);
                case 'goodTimes': return getRandomFromArray(randomContent.goodTimes);
                case 'initialThoughts': return getRandomFromArray(randomContent.initialThoughts);
                case 'problemStart': return getRandomFromArray(randomContent.problemStarts);
                case 'currentIssue': return getRandomFromArray(randomContent.currentIssues);
                case 'frequency': return getRandomFromArray(randomContent.frequencies);
                case 'attemptResults': return getRandomFromArray(randomContent.attemptResults);
                case 'effects': return getRandomFromArray(randomContent.effects);
                case 'feelings': return getRandomFromArray(randomContent.feelings);
                case 'friendAdvice': return getRandomFromArray(randomContent.friendAdvices);
                case 'familyAdvice': return getRandomFromArray(randomContent.familyAdvices);
                case 'confusion': return getRandomFromArray(randomContent.confusions);
                case 'previousIssues': return getRandomFromArray(randomContent.previousIssues);
                case 'difference': return getRandomFromArray(randomContent.differences);
                case 'partnerName': return getRandomFromArray(randomContent.names);
                case 'concerns': return getRandomFromArray(randomContent.concerns);
                case 'option1': return getRandomFromArray(randomContent.options);
                case 'option2': return getRandomFromArray(randomContent.options);
                case 'option3': return getRandomFromArray(randomContent.options);
                case 'pattern': return getRandomFromArray(randomContent.patterns);
                case 'recentChange': return getRandomFromArray(randomContent.recentChanges);
                case 'breakingPoint': return getRandomFromArray(randomContent.breakingPoints);
                case 'discovery': return getRandomFromArray(randomContent.discoveries);
                case 'questioning': return getRandomFromArray(randomContent.questionings);
                case 'solutions': return getRandomFromArray(randomContent.solutions);
                case 'cycle': return getRandomFromArray(randomContent.cycles);
                case 'hope': return getRandomFromArray(randomContent.hopes);
                case 'doubt': return getRandomFromArray(randomContent.doubts);
                case 'mutualPeople': return getRandomFromArray(randomContent.mutualPeoples);
                case 'theirInvolvement': return getRandomFromArray(randomContent.theirInvolvements);
                case 'lifeAreas': return getRandomFromArray(randomContent.lifeAreas);
                case 'activities': return getRandomFromArray(randomContent.activities);
                case 'specificAdvice': return getRandomFromArray(randomContent.specificAdvices);
                default: return placeholder; // fallback
            }
        });
        
        // Format story based on type
        switch (storyType) {
            case "aita":
                story = `AITA: ${story}`;
                break;
            case "tifu":
                story = `TIFU: ${story}`;
                break;
            case "relationship":
                story = `Relationship Advice: ${story}`;
                break;
        }
        
        // Adjust length to match target word count
        const currentWordCount = countWords(story);
        if (currentWordCount < targetWordCount * 0.8) {
            // Add more context for shorter stories
            story += "\n\nI should probably add some additional context here. This situation has been building up for a while and there are definitely more details that are relevant. The whole thing has been really stressful and I'm not sure how to handle it. I've been losing sleep over this and it's affecting other areas of my life too. I just want to know if I'm handling this the right way or if I should be approaching it differently.";
        }
        
        return story;
    }

    // Display the generated story
    function displayGeneratedStory() {
        // Update the story display
        storyContent.textContent = state.generatedStory;
        storyDisplay.style.display = 'block';
        
        // Update stats
        wordCountDisplay.textContent = `${state.wordCount} words`;
        readingTime.textContent = `${state.duration} min read`;
        
        // Scroll to the story section
        storyDisplay.scrollIntoView({ behavior: 'smooth' });
    }

    // Update the background preview based on selected background
    function updateBackgroundPreview() {
        // Remove all background classes first
        videoBackground.className = 'video-background';
        
        // Add the selected background class
        videoBackground.classList.add(state.background);
        
        // Initialize the video preview with the first few words
        if (state.generatedStory) {
            const words = state.generatedStory.split(' ');
            captionText.textContent = words.slice(0, 10).join(' ') + '...';
        }
    }

    // Play/Pause the video preview
    function togglePlayPause() {
        if (!state.generatedStory) {
            alert("Please generate a story first!");
            return;
        }
        
        if (state.isPlaying) {
            // Pause speech
            if (state.synth.speaking) {
                state.synth.cancel();
                playPauseBtn.textContent = '▶️';
            }
            state.isPlaying = false;
        } else {
            // Start speech
            playPreview();
            playPauseBtn.textContent = '⏸️';
            state.isPlaying = true;
        }
    }

    // Play the preview with speech synthesis
    function playPreview() {
        if (state.synth.speaking) {
            state.synth.cancel();
        }
        
        // Get the first 50 words to preview
        const words = state.generatedStory.split(' ');
        const previewText = words.slice(0, 50).join(' ') + "...";
        
        // Create utterance
        const utterance = new SpeechSynthesisUtterance(previewText);
        state.utterance = utterance;
        
        // Configure voice
        utterance.rate = state.speed;
        utterance.volume = 1;
        
        // Try to set a voice based on selection
        const voices = state.synth.getVoices();
        if (voices.length) {
            let selectedVoice;
            
            switch(state.voice) {
                case 'female':
                    selectedVoice = voices.find(voice => voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('samantha'));
                    break;
                case 'male':
                    selectedVoice = voices.find(voice => voice.name.toLowerCase().includes('male') || voice.name.toLowerCase().includes('alex'));
                    break;
                case 'uk':
                    selectedVoice = voices.find(voice => voice.lang.includes('GB'));
                    break;
                case 'us':
                    selectedVoice = voices.find(voice => voice.lang.includes('US'));
                    break;
                default:
                    selectedVoice = voices[0];
            }
            
            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }
        }
        
        // Word highlighting and progress
        let wordIndex = 0;
        let startTime = Date.now();
        const estimatedDuration = (previewText.split(' ').length / (utterance.rate * 3)) * 1000; // rough estimate
        
        const progressInterval = setInterval(() => {
            if (!state.isPlaying) {
                clearInterval(progressInterval);
                return;
            }
            
            const elapsed = Date.now() - startTime;
            const progress = Math.min((elapsed / estimatedDuration) * 100, 100);
            progressFill.style.width = `${progress}%`;
            
            // Update caption text periodically
            const wordsPerSecond = utterance.rate * 3;
            const currentWordIndex = Math.floor((elapsed / 1000) * wordsPerSecond);
            if (currentWordIndex !== wordIndex && currentWordIndex < words.length) {
                wordIndex = currentWordIndex;
                captionText.textContent = words.slice(wordIndex, wordIndex + 8).join(' ');
            }
        }, 100);
        
        // When speech ends
        utterance.onend = function() {
            state.isPlaying = false;
            playPauseBtn.textContent = '▶️';
            progressFill.style.width = '0%';
            clearInterval(progressInterval);
            
            // Reset caption text
            const words = state.generatedStory.split(' ');
            captionText.textContent = words.slice(0, 10).join(' ') + '...';
        };
        
        // Start speech
        state.synth.speak(utterance);
    }

    // Toggle mute/unmute
    function toggleMute() {
        if (state.synth.speaking) {
            state.synth.cancel();
            volumeBtn.textContent = '🔇';
            state.isPlaying = false;
            playPauseBtn.textContent = '▶️';
        } else {
            volumeBtn.textContent = '🔊';
        }
    }

    // Copy text to clipboard
    function copyTextToClipboard() {
        if (!state.generatedStory) {
            alert("Please generate a story first!");
            return;
        }
        
        navigator.clipboard.writeText(state.generatedStory)
            .then(() => {
                alert('Story copied to clipboard!');
            })
            .catch(err => {
                console.error('Could not copy text: ', err);
                alert('Failed to copy text. Please try again.');
            });
    }

    // Preview full video (simulated)
    function previewFullVideo() {
        if (!state.generatedStory) {
            alert("Please generate a story first!");
            return;
        }
        
        // In a real app, this would initiate a full video preview/creation
        // For demo, we'll just play the existing preview
        if (state.isPlaying) {
            state.synth.cancel();
        }
        
        playPreview();
        playPauseBtn.textContent = '⏸️';
        state.isPlaying = true;
        
        alert("Full video preview started! This is a demo of the TikTok-style video generation.");
    }

    // Utility Functions

    // Count words in a string
    function countWords(text) {
        return text.split(/\s+/).filter(word => word.length > 0).length;
    }

    // Initialize the application
    function init() {
        // Set initial UI state
        updateDurationUI();
        updateBackgroundPreview();
        
        // Set up event listeners
        initializeEvents();
        
        // Load voices if available
        if (state.synth.onvoiceschanged !== undefined) {
            state.synth.onvoiceschanged = function() {
                // Voices loaded, can now use them
            };
        }
    }

    // Start the app
    init();
});