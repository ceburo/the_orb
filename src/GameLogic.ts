export class GameLogic {
    public static readonly MAX_XP_PER_EVENT = 5;

    public static isComment(line: string): boolean {
        const trimmed = line.trim();
        return (
            trimmed.startsWith('//') ||
            trimmed.startsWith('/*') ||
            trimmed.startsWith('*') ||
            trimmed.startsWith('#') ||
            trimmed.startsWith('--') ||
            trimmed.startsWith('<!--')
        );
    }

    public static calculateXpGain(textLength: number): number {
        if (textLength <= 0) {
            return 0;
        }
        return Math.min(textLength, this.MAX_XP_PER_EVENT);
    }

    public static getLevelInfo(level: number): { xpToNextLevel: number, currentLevelXpRequired: number } {
        let threshold = 0;
        let increment = 10;
        for (let i = 1; i < level; i++) {
            threshold += increment;
            increment = Math.floor(increment * 1.5);
        }
        return {
            xpToNextLevel: threshold + increment,
            currentLevelXpRequired: increment
        };
    }

    public static readonly MITOSIS_THRESHOLD = 5;
    public static readonly MULTIPLIER_INCREMENT = 0.2;

    public static shouldTriggerMitosis(currentMultiplier: number): boolean {
        return currentMultiplier >= this.MITOSIS_THRESHOLD;
    }

    public static incrementMultiplier(currentMultiplier: number): number {
        const next = currentMultiplier + this.MULTIPLIER_INCREMENT;
        return Math.round(next * 10) / 10;
    }
}
