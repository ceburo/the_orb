---
title: Presentation
---

<div class="mia-presentation">

<div class="orb-demo"></div>

# Mia - The Orb

Make every keystroke count. Turn your daily coding routine into a visual RPG.

<a href="https://marketplace.visualstudio.com/items?itemName=NicolasBrouillet.mia" class="cta-button">Download for VS Code</a>

<div class="features-grid">
    <div class="feature-card">
        <span class="feature-icon">⌨️</span>
        <h3>Code to Grow</h3>
        <p>Every character you type feeds the orb. Watch it grow, evolve, and pulse with energy right in your activity bar.</p>
    </div>
    <div class="feature-card">
        <span class="feature-icon">🚀</span>
        <h3>Git Multiplier</h3>
        <p>Consistency is rewarded. Every Git commit boosts your XP multiplier by +0.2x. Chain your commits to reach maximum velocity!</p>
    </div>
    <div class="feature-card">
        <span class="feature-icon">⚡</span>
        <h3>Level Up</h3>
        <p>Gain logic-based XP (comments are ignored!). Reach new levels and unlock visual upgrades as your skills improve.</p>
    </div>
</div>

<div class="mitosis-section">
    <h2>🧬 Endgame: Mitosis</h2>
    <p style="max-width: 600px; margin: 20px auto;">
        Reach the legendary <strong>x5.0 multiplier</strong> and trigger the unstable energy event.
        Split your orb into multiple entities and accelerate your progression exponentially. How many orbs can you handle?
    </p>
</div>

</div>

<style scoped>
    .mia-presentation {
        --orb-color-1: #8e44ad;
        --orb-color-2: #3498db;
        --accent-color: #58a6ff;
        text-align: center;
        padding: 40px 0;
    }

    .orb-demo {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0) 20%),
            linear-gradient(135deg, var(--orb-color-1), var(--orb-color-2));
        box-shadow: 0 0 40px rgba(142, 68, 173, 0.6);
        margin: 40px auto;
        animation: float 6s ease-in-out infinite, pulse 3s ease-in-out infinite;
    }

    .mia-presentation h1 {
        font-size: 3.5rem;
        margin-bottom: 10px;
        background: linear-gradient(to right, var(--orb-color-1), var(--orb-color-2));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        border: none !important;
    }

    .cta-button {
        display: inline-block;
        background-color: var(--accent-color);
        color: #fff !important;
        padding: 12px 30px;
        font-size: 1.2rem;
        border-radius: 6px;
        text-decoration: none !important;
        font-weight: bold;
        transition: transform 0.2s, background-color 0.2s;
    }

    .cta-button:hover {
        transform: translateY(-2px);
        background-color: #0366d6;
    }

    .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 30px;
        margin: 60px 0;
        text-align: left;
    }

    .feature-card {
        background-color: var(--vp-c-bg-soft);
        padding: 30px;
        border-radius: 12px;
        border: 1px solid var(--vp-c-border);
    }

    .feature-icon {
        font-size: 2.5rem;
        margin-bottom: 20px;
        display: block;
    }

    .mitosis-section {
        background-color: var(--vp-c-bg-soft);
        padding: 60px 20px;
        border-radius: 12px;
        margin: 40px 0;
    }

    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
    }

    @keyframes pulse {
        0%, 100% { 
            box-shadow: 0 0 40px rgba(142, 68, 173, 0.6);
            transform: scale(1);
        }
        50% { 
            box-shadow: 0 0 60px rgba(142, 68, 173, 0.8);
            transform: scale(1.05);
        }
    }
</style>

