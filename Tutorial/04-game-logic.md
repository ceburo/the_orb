# Étape 4 : Multiplier le plaisir avec la logique de jeu 🎮

Vous avez votre vue, mais l'XP ne monte pas encore. Nous allons maintenant ajouter la "mécanique de jeu" : comment définir les règles de notre univers ?

## Pourquoi isoler la logique ? 🧠
Avant d'écrire du code, comprenons pourquoi on crée un fichier `GameLogic.ts` séparé :
- **Principe de Responsabilité Unique (SRP)** : Votre code de jeu ne devrait pas savoir ce qu'est un "Document" ou une "Webview". Il ne devrait calculer que des nombres.
- **Testabilité** : C'est bien plus simple de tester si `2 + 2 = 4` que de tester si "une webview affiche 4 quand on tape dans un document".
- **Multi-plateforme** : Si demain vous voulez utiliser cette même logique dans une application web, vous n'aurez qu'à copier ce fichier !

## Le Cœur du Jeu : `src/GameLogic.ts` 🛠️
Créez ce fichier. Remarquez qu'il **n'importe rien** de VS Code.

```typescript
export class GameLogic {
    // Combien d'XP par caractère tapé ?
    public static calculateXpGain(textLength: number): number {
        // Supposons un max de 5 XP par événement
        // Pourquoi ? Pour éviter qu'un gros copier-coller (2000 caractères) ne casse la progression !
        return Math.min(textLength, 5);
    }

    // Est-ce un commentaire ? La logique vit ici.
    public static isComment(line: string): boolean {
        // On nettoie la ligne pour enlever les espaces invisibles au début.
        const trimmed = line.trim();
        return (
            trimmed.startsWith('//') || 
            trimmed.startsWith('/*') || 
            trimmed.startsWith('#') ||
            trimmed.startsWith('<!--') // Supportons aussi HTML !
        );
    }

    // Prochain seuil de niveau (croissance de 50%)
    public static getNextLevelXp(currentLevel: number): number {
        // increment starts at 10, grows by 1.5x each level.
        return Math.floor(10 * Math.pow(1.5, currentLevel - 1));
    }
}
```

### Zoom sur la détection des commentaires 👁️
- **`trimmed.startsWith('//')`** : On détecte si la ligne commence par des symboles de commentaire. C'est ici qu'on fait la différence entre le codage actif et la simple documentation. Notre Orb ne s'intéresse qu'à la logique pure !

### Zoom sur les niveaux 📈
Les seuils de progression ne sont pas linéaires. Si le niveau 1 demande 10 XP, le niveau 2 demandera 15 XP, le 3 demandera 22 XP, etc.
- **Pourquoi ?** C'est le principe fondamental de tout RPG. Plus on progresse, plus le défi est grand. Cela crée un sentiment de satisfaction quand on franchit un palier.

---
**Ressource utile :** [Introduction au Clean Code (SOLID)](https://fr.wikipedia.org/wiki/S.O.L.I.D.)

---
**Étape suivante : [Écouter les touches (05-event-listeners.md)](05-event-listeners.md)**

