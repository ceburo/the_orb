# Step 4: Multiply the Fun with Game Logic

You have your view, but the XP isn't going up yet. We will now add the "game mechanic": how to define the rules of our universe?

## Why isolate the logic?
Before writing code, let's understand why we create a separate `GameLogic.ts` file:
- **Single Responsibility Principle (SRP)**: Your game code shouldn't know what a "Document" or a "Webview" is. It should only calculate numbers.
- **Testability**: It's much simpler to test if `2 + 2 = 4` than to test if "a webview displays 4 when you type into a document".
- **Multi-platform**: If tomorrow you want to use this same logic in a web application, you just have to copy this file!

## The Heart of the Game: `src/GameLogic.ts`
Create this file. Notice that it **imports nothing** from VS Code.

```typescript
export class GameLogic {
    // How much XP per character typed?
    public static calculateXpGain(textLength: number): number {
        // Suppose a max of 5 XP per event
        // Why? To prevent a large copy-paste (2000 characters) from breaking progression!
        return Math.min(textLength, 5);
    }

    // Is it a comment? Logic lives here.
    public static isComment(line: string): boolean {
        // We clean the line to remove invisible spaces at the beginning.
        const trimmed = line.trim();
        return (
            trimmed.startsWith('//') || 
            trimmed.startsWith('/*') || 
            trimmed.startsWith('#') ||
            trimmed.startsWith('<!--') // Let's support HTML too!
        );
    }

    // Next level threshold (50% growth)
    public static getNextLevelXp(currentLevel: number): number {
        // increment starts at 10, grows by 1.5x each level.
        return Math.floor(10 * Math.pow(1.5, currentLevel - 1));
    }
}
```

### Focus on comment detection
- **`trimmed.startsWith('//')`**: We detect if the line starts with comment symbols. This is where we distinguish between active coding and simple documentation. Our Orb is only interested in pure logic!

### Focus on levels
Progression thresholds are non-linear. If level 1 requires 10 XP, level 2 will require 15 XP, 3 will require 22 XP, etc.
- **Why?** This is the fundamental principle of any RPG. The further you progress, the greater the challenge. This creates a sense of satisfaction when you cross a threshold.

---
**Useful Resource:** [Introduction to Clean Code (SOLID)](https://en.wikipedia.org/wiki/SOLID)

---
**Next step: [Listen to keypresses (05-event-listeners.md)](05-event-listeners.md)**

