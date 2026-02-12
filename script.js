// ===== DREAM WEAVER - Interactive Love Story =====
// Version 1.0 - Complete Experience

class DreamWeaver {
    constructor() {
        // State management
        this.currentChapter = 1;
        this.totalChapters = 4;
        this.storyProgress = 0;
        this.journeyMoments = 0;
        this.startTime = null;
        this.timerInterval = null;
        this.choices = {};
        
        // DOM Elements
        this.chapters = document.querySelectorAll('.story-chapter');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.getElementById('prev-chapter');
        this.nextBtn = document.getElementById('next-chapter');
        this.progressFill = document.getElementById('story-progress');
        this.progressPercent = document.getElementById('progress-percent');
        this.finalChapter = document.getElementById('final-chapter');
        
        // Quotes library
        this.dreamQuotes = [
            "Dreams are the whispers of our hearts",
            "In your thoughts, I found my home",
            "Every moment with you feels like magic",
            "Our story is written in the stars",
            "You are the dream I never want to end",
            "Together we weave the most beautiful tapestry",
            "Your presence makes reality feel like a dream"
        ];
        
        this.init();
    }
    
    init() {
        this.createFloatingHearts();
        this.setupEventListeners();
        this.startJourneyTimer();
        this.updateDynamicQuote();
        
        // Set interval for changing quotes
        setInterval(() => this.updateDynamicQuote(), 8000);
        
        console.log('🌙 Dream Weaver initialized - Ready to begin journey');
    }
    
    createFloatingHearts() {
        const container = document.querySelector('.floating-hearts');
        const emojis = ['💫', '✨', '🌠', '💝', '💕', '💖', '🌟', '⭐'];
        
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const heart = document.createElement('span');
                heart.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
                heart.style.cssText = `
                    position: absolute;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    font-size: ${15 + Math.random() * 25}px;
                    opacity: ${0.1 + Math.random() * 0.3};
                    pointer-events: none;
                    z-index: 0;
                    animation: float ${15 + Math.random() * 20}s linear infinite;
                    animation-delay: ${Math.random() * 5}s;
                `;
                container.appendChild(heart);
            }, i * 100);
        }
    }
    
    setupEventListeners() {
        // Choice buttons
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleChoice(e));
        });
        
        // Navigation buttons
        this.prevBtn?.addEventListener('click', () => this.navigateChapter('prev'));
        this.nextBtn?.addEventListener('click', () => this.navigateChapter('next'));
        
        // Chapter dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.navigateToChapter(index + 1));
        });
        
        // Completion buttons
        document.getElementById('create-memory')?.addEventListener('click', () => this.createMemory());
        document.getElementById('share-story')?.addEventListener('click', () => this.shareStory());
        document.getElementById('replay-journey')?.addEventListener('click', () => this.replayJourney());
        document.getElementById('save-journey')?.addEventListener('click', () => this.saveJourney());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.navigateChapter('prev');
            if (e.key === 'ArrowRight') this.navigateChapter('next');
        });
    }
    
    handleChoice(event) {
        const button = event.currentTarget;
        const choiceId = button.dataset.choice;
        const nextChapter = button.dataset.next;
        
        // Record the choice
        this.choices[choiceId] = {
            timestamp: new Date().toISOString(),
            chapter: this.currentChapter
        };
        
        // Increment journey moments
        this.journeyMoments++;
        this.updateStats();
        
        // Animate the choice
        this.animateChoice(button);
        
        // Navigate to next chapter
        setTimeout(() => {
            this.navigateToChapter(this.extractChapterNumber(nextChapter));
        }, 500);
    }
    
    animateChoice(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => button.style.transform = '', 200);
        
        // Create sparkle effect
        this.createSparkles(button);
    }
    
    createSparkles(element) {
        const rect = element.getBoundingClientRect();
        const container = document.querySelector('.story-container');
        
        for (let i = 0; i < 8; i++) {
            const sparkle = document.createElement('span');
            sparkle.innerHTML = '✨';
            sparkle.style.cssText = `
                position: fixed;
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top + rect.height / 2}px;
                font-size: 20px;
                pointer-events: none;
                z-index: 9999;
                animation: sparkleOut 1s ease-out forwards;
            `;
            
            container.appendChild(sparkle);
            
            const angle = (i / 8) * Math.PI * 2;
            const distance = 50 + Math.random() * 50;
            
            sparkle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { 
                    transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
                    opacity: 0 
                }
            ], {
                duration: 800 + Math.random() * 400,
                easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
            });
            
            setTimeout(() => sparkle.remove(), 1000);
        }
    }
    
    navigateChapter(direction) {
        if (direction === 'prev' && this.currentChapter > 1) {
            this.navigateToChapter(this.currentChapter - 1);
        } else if (direction === 'next' && this.currentChapter < this.totalChapters) {
            this.navigateToChapter(this.currentChapter + 1);
        }
    }
    
    navigateToChapter(chapterNumber) {
        if (chapterNumber < 1 || chapterNumber > this.totalChapters) return;
        
        // Update current chapter
        this.currentChapter = chapterNumber;
        
        // Update chapters visibility
        this.chapters.forEach(chapter => {
            chapter.classList.remove('active');
            if (parseInt(chapter.dataset.chapter) === chapterNumber) {
                chapter.classList.add('active');
            }
        });
        
        // Update dots
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index + 1 === chapterNumber);
        });
        
        // Update navigation buttons
        this.updateNavigation();
        
        // Update progress
        this.updateProgress();
        
        // Play chapter transition sound
        this.playChapterSound(chapterNumber);
        
        console.log(`📖 Navigated to Chapter ${chapterNumber}`);
    }
    
    updateNavigation() {
        this.prevBtn.disabled = this.currentChapter === 1;
        this.nextBtn.disabled = this.currentChapter === this.totalChapters;
    }
    
    updateProgress() {
        this.storyProgress = (this.currentChapter / this.totalChapters) * 100;
        this.progressFill.style.width = `${this.storyProgress}%`;
        this.progressPercent.textContent = `${Math.round(this.storyProgress)}%`;
    }
    
    updateStats() {
        document.getElementById('chapters-completed').textContent = this.currentChapter;
        document.getElementById('moments-created').textContent = this.journeyMoments;
    }
    
    startJourneyTimer() {
        this.startTime = new Date();
        
        this.timerInterval = setInterval(() => {
            if (this.startTime) {
                const now = new Date();
                const diff = Math.floor((now - this.startTime) / 1000);
                const minutes = Math.floor(diff / 60).toString().padStart(2, '0');
                const seconds = (diff % 60).toString().padStart(2, '0');
                
                document.getElementById('journey-time').textContent = `${minutes}:${seconds}`;
            }
        }, 1000);
    }
    
    updateDynamicQuote() {
        const quoteElement = document.getElementById('dynamic-quote');
        if (quoteElement) {
            const randomQuote = this.dreamQuotes[Math.floor(Math.random() * this.dreamQuotes.length)];
            quoteElement.style.opacity = '0';
            
            setTimeout(() => {
                quoteElement.textContent = randomQuote;
                quoteElement.style.opacity = '1';
                quoteElement.style.transition = 'opacity 0.5s ease';
            }, 300);
        }
    }
    
    extractChapterNumber(chapterId) {
        return parseInt(chapterId.split('-')[1]);
    }
    
    createMemory() {
        this.journeyMoments++;
        this.updateStats();
        
        // Show final chapter
        this.chapters.forEach(ch => ch.style.display = 'none');
        this.finalChapter.style.display = 'block';
        
        // Animate the message
        this.animateFinalRevelation();
        
        // Create memory sparkles
        for (let i = 0; i < 50; i++) {
            setTimeout(() => this.createMemorySparkle(), i * 50);
        }
    }
    
    animateFinalRevelation() {
        const message = document.querySelector('.eternal-message');
        message.style.opacity = '0';
        message.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            message.style.opacity = '1';
            message.style.transform = 'translateY(0)';
            message.style.transition = 'all 1s ease';
        }, 100);
    }
    
    createMemorySparkle() {
        const container = document.querySelector('.final-chapter');
        const sparkle = document.createElement('span');
        sparkle.innerHTML = '💫';
        sparkle.style.cssText = `
            position: absolute;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            font-size: ${20 + Math.random() * 30}px;
            opacity: 0.8;
            pointer-events: none;
            z-index: 9999;
            animation: floatOut ${1 + Math.random() * 2}s ease-out forwards;
        `;
        
        container.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 2000);
    }
    
    shareStory() {
        // Create a shareable message
        const message = `
            🌟 Dream Weaver Experience 🌟
            
            I completed the Dream Weaver journey and created 
            ${this.journeyMoments} beautiful moments.
            
            This experience touched my heart and made me feel 
            deeply connected to the magic of our connection.
            
            ✨ Every moment matters ✨
        `;
        
        // Try to use Web Share API if available
        if (navigator.share) {
            navigator.share({
                title: 'Dream Weaver - Our Journey',
                text: message,
                url: window.location.href,
            }).catch(() => {
                // Fallback to clipboard
                this.copyToClipboard(message);
            });
        } else {
            // Fallback to clipboard
            this.copyToClipboard(message);
        }
    }
    
    copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        // Show notification
        this.showNotification('✨ Memory copied to clipboard! ✨');
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(45deg, #7209b7, #4361ee);
            color: white;
            padding: 15px 30px;
            border-radius: 50px;
            font-size: 1rem;
            font-weight: 600;
            z-index: 9999;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            animation: slideUp 0.5s ease-out;
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
    
    replayJourney() {
        // Reset state
        this.currentChapter = 1;
        this.journeyMoments = 0;
        this.choices = {};
        this.startTime = new Date();
        
        // Update UI
        this.navigateToChapter(1);
        this.finalChapter.style.display = 'none';
        this.chapters.forEach(ch => ch.style.display = '');
        this.updateStats();
        
        // Show welcome message
        this.showNotification('✨ Beginning our journey again... ✨');
    }
    
    saveJourney() {
        const journey = {
            date: new Date().toISOString(),
            chaptersCompleted: this.currentChapter,
            momentsCreated: this.journeyMoments,
            choices: this.choices,
            timestamp: this.startTime
        };
        
        localStorage.setItem('dreamWeaverJourney', JSON.stringify(journey));
        this.showNotification('💫 Journey saved to your heart! 💫');
    }
    
    playChapterSound(chapterNumber) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Different tones for different chapters
            const frequencies = [329.63, 440.00, 523.25, 659.25];
            oscillator.frequency.setValueAtTime(frequencies[chapterNumber - 1], audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            // Silent fail if Web Audio not supported
        }
    }
    
    // Breathing exercise for Chapter 3
    startBreathingExercise() {
        const circles = document.querySelectorAll('.breath-circle');
        let state = 0;
        
        const breathingCycle = setInterval(() => {
            circles.forEach((circle, index) => {
                if (index === state) {
                    circle.style.transform = 'scale(1.3)';
                    circle.style.opacity = '1';
                } else {
                    circle.style.transform = 'scale(1)';
                    circle.style.opacity = '0.8';
                }
            });
            
            state = (state + 1) % 3;
        }, 4000);
        
        // Store interval ID to clear later
        this.breathingInterval = breathingCycle;
    }
}

// Initialize the Dream Weaver
const dreamWeaver = new DreamWeaver();

// Add CSS animations for sparkles
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkleOut {
        0% { opacity: 1; transform: translate(0, 0) scale(1); }
        100% { opacity: 0; transform: translate(var(--x), var(--y)) scale(0); }
    }
    
    @keyframes floatOut {
        0% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
        100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
    }
    
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translate(-50%, 20px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
`;

document.head.appendChild(style);

console.log('✨ Dream Weaver is ready. Your journey awaits... ✨')
