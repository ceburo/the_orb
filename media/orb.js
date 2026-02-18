(function () {
    const vscode = acquireVsCodeApi();

    let xp = 0;
    let level = 1;
    let xpToNextLevel = 10;
    let currentLevelXpRequired = 10;
    let multiplier = 1;
    let orbCount = 1;

    let orbSize = 1;
    let hue = 0;

    let isInitialized = false;

    const orbContainer = document.getElementById('orb-container');
    const xpDisplay = document.getElementById('xp-display');
    const nextLevelXpDisplay = document.getElementById('next-level-xp-display');
    const levelDisplay = document.getElementById('level-display');
    const messageDisplay = document.getElementById('message-display');
    const multiplierDisplay = document.getElementById('multiplier-display');
    const rewardIcon = document.getElementById('reward-icon');
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsPanel = document.getElementById('settings-panel');
    const resetButton = document.getElementById('reset-button');

    if (orbContainer && orbContainer.children.length === 0) {
        createOrbElement();
    }

    if (settingsToggle && settingsPanel) {
        settingsToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            settingsPanel.classList.toggle('hidden');
        });

        document.addEventListener('click', () => {
            settingsPanel.classList.add('hidden');
        });

        settingsPanel.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    if (resetButton) {
        resetButton.addEventListener('click', () => {
            vscode.postMessage({ type: 'reset' });
            settingsPanel.classList.add('hidden');
        });
    }

    window.addEventListener('message', event => {
        const message = event.data;
        console.log('Mia: Received message', message);
        switch (message.type) {
            case 'addXp':
                addXp(message.amount);
                break;
            case 'updateState':
                updateState(message.multiplier, message.orbCount, message.xp, message.level);
                break;
            case 'updateMultiplier':
                updateState(message.value, orbCount);
                break;
            case 'mitosisEffect':
                showMitosisAnimation();
                break;
        }
    });

    function createOrbElement() {
        const wrapper = document.createElement('div');
        wrapper.className = 'orb-wrapper';
        const orb = document.createElement('div');
        orb.className = 'orb';
        wrapper.appendChild(orb);
        orbContainer.appendChild(wrapper);
        return wrapper;
    }

    function renderOrbs() {
        if (!orbContainer) return;

        const currentOrbs = orbContainer.querySelectorAll('.orb-wrapper');
        const diff = orbCount - currentOrbs.length;

        if (diff > 0) {
            for (let i = 0; i < diff; i++) {
                createOrbElement();
            }
        } else if (diff < 0) {
            for (let i = 0; i < Math.abs(diff); i++) {
                if (orbContainer.lastChild) {
                    orbContainer.lastChild.remove();
                }
            }
        }

        const wrappers = orbContainer.querySelectorAll('.orb-wrapper');
        wrappers.forEach((wrapper, index) => {
            const shell = Math.floor(index / 8);
            const indexInShell = index % 8;
            const orbsInShell = (shell === Math.floor((orbCount - 1) / 8)) ? (orbCount - shell * 8) : 8;

            const radius = orbCount === 1 ? 0 : 50 + (shell * 40);
            const baseAngle = (360 / orbsInShell) * indexInShell;
            const angleOffset = shell * 22.5;
            const angle = baseAngle + angleOffset;

            const duration = 10 + (shell * 5) + (indexInShell * 1);

            wrapper.style.setProperty('--orbit-radius', `${radius}px`);
            wrapper.style.setProperty('--orbit-angle', `${angle}deg`);
            wrapper.style.setProperty('--orbit-duration', `${duration}s`);

            wrapper.style.animationDelay = `-${(index * 2)}s`;
        });
    }

    let saveTimeout;
    function saveState() {
        if (saveTimeout) clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            vscode.postMessage({
                type: 'stateUpdate',
                xp,
                level
            });
        }, 2000);
    }

    function getMaxAllowedSize() {
        const container = document.querySelector('.container');
        const minDim = container ? Math.min(container.clientWidth, container.clientHeight) : 400;

        if (orbCount === 1) {
            return Math.min(120, minDim * 0.6);
        }

        const radialMax = 35;
        const tangentialMax = 38;

        const maxShell = Math.floor((orbCount - 1) / 8);
        const maxRadius = 50 + (maxShell * 40);
        const viewportMax = Math.max(20, (minDim - (maxRadius * 2)) * 0.8);

        return Math.floor(Math.min(radialMax, tangentialMax, viewportMax));
    }

    function calculateOrbSize(currentXp) {
        const maxSize = getMaxAllowedSize();
        const baseSize = Math.min(30, maxSize * 0.8);
        const growthScale = (maxSize - baseSize) / 5;

        return Math.min(maxSize, baseSize + (Math.log(currentXp + 1) * growthScale));
    }

    function addXp(baseAmount) {
        if (!isInitialized) return;

        const gainedXp = Math.ceil(baseAmount * multiplier * orbCount);
        xp += gainedXp;

        orbSize = calculateOrbSize(xp);

        if (xp >= xpToNextLevel) {
            levelUp();
        }

        updateDisplay();
        pulseOrbs();
        saveState();
    }

    function updateState(newMultiplier, newOrbCount, newXp, newLevel) {
        isInitialized = true;
        if (typeof newMultiplier === 'number' && !isNaN(newMultiplier)) {
            multiplier = Math.round(newMultiplier * 10) / 10;
        }

        if (typeof newXp === 'number' && !isNaN(newXp)) {
            xp = newXp;
        }

        if (typeof newLevel === 'number' && !isNaN(newLevel)) {
            level = newLevel;
            hue = ((level - 1) * 45) % 360;

            let threshold = 0;
            let increment = 10;
            for (let i = 1; i < level; i++) {
                threshold += increment;
                increment = Math.floor(increment * 1.5);
            }
            xpToNextLevel = threshold + increment;
            currentLevelXpRequired = increment;
        }

        if (newOrbCount && !isNaN(newOrbCount) && newOrbCount !== orbCount) {
            orbCount = newOrbCount;
            renderOrbs();
        }

        orbSize = calculateOrbSize(xp);

        updateDisplay();
    }

    function showMitosisAnimation() {
        showMessage(`MITOSIS! Orbs Splitting...`, '#00FF00');
        const orbs = document.querySelectorAll('.orb');
        orbs.forEach(o => o.classList.add('mitosis-flash'));
        setTimeout(() => {
            orbs.forEach(o => o.classList.remove('mitosis-flash'));
        }, 1000);
    }

    function levelUp() {
        level++;
        currentLevelXpRequired = Math.floor(currentLevelXpRequired * 1.5);
        xpToNextLevel += currentLevelXpRequired;
        showMessage(`Level Up! Level ${level}`, '#FFD700');
        hue = (hue + 45) % 360;
    }

    function showMessage(text, color = 'inherit') {
        if (!messageDisplay) return;
        messageDisplay.innerText = text;
        messageDisplay.style.color = color;

        setTimeout(() => {
            messageDisplay.innerText = 'Type code to grow the orb!';
            messageDisplay.style.color = 'inherit';
        }, 3000);
    }

    function updateDisplay() {
        if (xpDisplay) xpDisplay.innerText = xp;
        if (nextLevelXpDisplay) nextLevelXpDisplay.innerText = xpToNextLevel;
        if (levelDisplay) levelDisplay.innerText = level;

        if (multiplierDisplay) {
            const totalMultiplier = (multiplier * orbCount).toFixed(1);
            multiplierDisplay.innerText = totalMultiplier;

            if (multiplier * orbCount >= 2) {
                multiplierDisplay.style.color = '#ffD700';
                multiplierDisplay.style.fontWeight = 'bold';
            } else {
                multiplierDisplay.style.color = 'inherit';
                multiplierDisplay.style.fontWeight = 'normal';
            }

            if (rewardIcon) {
                const scale = 1 + (multiplier * orbCount - 1) * 0.2;
                rewardIcon.style.transform = `scale(${Math.min(2, scale)})`;
            }

            if (orbCount > 1) {
                const details = document.createElement('span');
                details.style.fontSize = '0.7em';
                details.style.opacity = '0.8';
                details.style.marginLeft = '4px';
                details.innerText = `(x${orbCount} orbs)`;
                multiplierDisplay.appendChild(details);
            }
        }

        const orbs = document.querySelectorAll('.orb');
        orbs.forEach(orb => {
            orb.style.width = `${orbSize}px`;
            orb.style.height = `${orbSize}px`;
            orb.style.boxShadow = `0 0 ${orbSize * 1.5}px 0 hsl(${hue}, 100%, 50%)`;
            orb.style.backgroundColor = `hsl(${hue}, 100%, 80%)`;
        });
    }

    function pulseOrbs() {
        const orbs = document.querySelectorAll('.orb');
        orbs.forEach(orb => {
            orb.classList.remove('pulse');
            orb.getBoundingClientRect();
            orb.classList.add('pulse');
        });
    }

    renderOrbs();
    updateDisplay();

    window.addEventListener('resize', () => {
        orbSize = calculateOrbSize(xp);
        updateDisplay();
        renderOrbs();
    });

    vscode.postMessage({ type: 'gameReady' });
}());
