import * as assert from 'assert';
import { GameLogic } from '../GameLogic';

suite('GameLogic Test Suite', () => {
    suite('isComment', () => {
        test('should identify single-line comments', () => {
            assert.strictEqual(GameLogic.isComment('// logic'), true);
            assert.strictEqual(GameLogic.isComment('# logic'), true);
            assert.strictEqual(GameLogic.isComment('-- logic'), true);
        });

        test('should identify multi-line start/continuation comments', () => {
            assert.strictEqual(GameLogic.isComment('/* logic'), true);
            assert.strictEqual(GameLogic.isComment(' * logic'), true);
        });

        test('should identify HTML/XML comments', () => {
            assert.strictEqual(GameLogic.isComment('<!-- logic -->'), true);
        });

        test('should not identify non-comments', () => {
            assert.strictEqual(GameLogic.isComment('const x = 5;'), false);
            assert.strictEqual(GameLogic.isComment('console.log("hello");'), false);
            assert.strictEqual(GameLogic.isComment('  let x = 1;'), false);
        });

        test('should handle whitespace before comments', () => {
            assert.strictEqual(GameLogic.isComment('   // indented'), true);
            assert.strictEqual(GameLogic.isComment(' \t # indented'), true);
        });
    });

    suite('calculateXpGain', () => {
        test('should return 0 for non-positive lengths', () => {
            assert.strictEqual(GameLogic.calculateXpGain(0), 0);
            assert.strictEqual(GameLogic.calculateXpGain(-1), 0);
        });

        test('should return exact lengths for small strings', () => {
            assert.strictEqual(GameLogic.calculateXpGain(1), 1);
            assert.strictEqual(GameLogic.calculateXpGain(3), 3);
            assert.strictEqual(GameLogic.calculateXpGain(5), 5);
        });

        test('should cap gain at MAX_XP_PER_EVENT', () => {
            assert.strictEqual(GameLogic.calculateXpGain(10), 5);
            assert.strictEqual(GameLogic.calculateXpGain(100), 5);
        });
    });

    suite('getLevelInfo', () => {
        test('level 1 threshold should be base increment of 10', () => {
            const info = GameLogic.getLevelInfo(1);
            assert.strictEqual(info.xpToNextLevel, 10);
            assert.strictEqual(info.currentLevelXpRequired, 10);
        });

        test('level 2 threshold should be 10 + Math.floor(10 * 1.5) = 25', () => {
            const info = GameLogic.getLevelInfo(2);
            assert.strictEqual(info.xpToNextLevel, 25);
            assert.strictEqual(info.currentLevelXpRequired, 15);
        });

        test('level 3 threshold', () => {
            const info = GameLogic.getLevelInfo(3);
            assert.strictEqual(info.xpToNextLevel, 47);
            assert.strictEqual(info.currentLevelXpRequired, 22);
        });
    });

    suite('multiplier and mitosis', () => {
        test('should trigger mitosis at threshold (5.0)', () => {
            assert.strictEqual(GameLogic.shouldTriggerMitosis(1.0), false);
            assert.strictEqual(GameLogic.shouldTriggerMitosis(4.8), false);
            assert.strictEqual(GameLogic.shouldTriggerMitosis(5.0), true);
            assert.strictEqual(GameLogic.shouldTriggerMitosis(5.2), true);
        });

        test('incrementMultiplier should add 0.2 and handle precision', () => {
            assert.strictEqual(GameLogic.incrementMultiplier(1.0), 1.2);
            assert.strictEqual(GameLogic.incrementMultiplier(1.2), 1.4);
            assert.strictEqual(GameLogic.incrementMultiplier(1.4), 1.6);
            assert.strictEqual(GameLogic.incrementMultiplier(4.8), 5.0);
        });
    });
});
