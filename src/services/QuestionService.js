const fs = require('fs').promises;
const path = require('path');

class QuestionService {
  constructor() {
    this.questionPacks = new Map();
    this.currentPack = null;
  }

  /**
   * Load all valid question packs from the question_packs directory
   * @returns {Promise<Array>} Array of question pack names
   */
  async loadQuestionPacks() {
    try {
      const questionPacksDir = path.join(process.cwd(), 'question_packs');
      const files = await fs.readdir(questionPacksDir);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      const validPacks = [];
      
      for (const file of jsonFiles) {
        try {
          const filePath = path.join(questionPacksDir, file);
          const content = await fs.readFile(filePath, 'utf8');
          const packData = JSON.parse(content);
          
          // Validate the question pack structure
          if (this.validateQuestionPack(packData)) {
            const packName = file.replace('.json', '');
            this.questionPacks.set(packName, packData);
            validPacks.push(packName);
            console.log(`✓ Loaded question pack: ${packName}`);
          } else {
            console.warn(`✗ Invalid question pack structure: ${file}`);
          }
        } catch (error) {
          console.warn(`✗ Error loading question pack ${file}:`, error.message);
        }
      }
      
      if (validPacks.length === 0) {
        throw new Error('No valid question packs found');
      }
      
      // Set a random pack as default if none is selected
      if (!this.currentPack && validPacks.length > 0) {
        this.setCurrentPack(validPacks[Math.floor(Math.random() * validPacks.length)]);
      }
      
      return validPacks;
    } catch (error) {
      console.error('Error loading question packs:', error);
      throw error;
    }
  }

  /**
   * Validate that a question pack has the correct structure
   * @param {Object} packData - The parsed JSON data
   * @returns {boolean} True if valid
   */
  validateQuestionPack(packData) {
    // Check for required top-level properties
    if (!packData.early_rounds || !packData.final_round) {
      return false;
    }

    // Check early_rounds structure
    if (!Array.isArray(packData.early_rounds) || packData.early_rounds.length === 0) {
      return false;
    }

    // Check final_round structure
    if (!Array.isArray(packData.final_round) || packData.final_round.length === 0) {
      return false;
    }

    // Validate a few sample questions from early_rounds
    const sampleQuestions = packData.early_rounds.slice(0, 3);
    for (const question of sampleQuestions) {
      if (!this.validateQuestion(question)) {
        return false;
      }
    }

    // Validate a sample from final_round
    if (!this.validateQuestion(packData.final_round[0])) {
      return false;
    }

    return true;
  }

  /**
   * Validate individual question structure
   * @param {Object} question - Single question object
   * @returns {boolean} True if valid
   */
  validateQuestion(question) {
    const required = ['category', 'question', 'answer', 'lies'];
    
    for (const field of required) {
      if (!question.hasOwnProperty(field)) {
        return false;
      }
    }

    // Check that lies is an array with at least some options
    if (!Array.isArray(question.lies) || question.lies.length < 3) {
      return false;
    }

    // Check that required fields are strings
    if (typeof question.category !== 'string' || 
        typeof question.question !== 'string' || 
        typeof question.answer !== 'string') {
      return false;
    }

    return true;
  }

  /**
   * Set the current question pack
   * @param {string} packName - Name of the pack to use
   * @returns {boolean} True if pack was found and set
   */
  setCurrentPack(packName) {
    if (this.questionPacks.has(packName)) {
      this.currentPack = packName;
      console.log(`Using question pack: ${packName}`);
      return true;
    }
    return false;
  }

  /**
   * Get list of available question pack names
   * @returns {Array<string>} Array of pack names
   */
  getAvailablePacks() {
    return Array.from(this.questionPacks.keys());
  }

  /**
   * Get random categories for a question selection
   * @param {boolean} isFinalRound - Whether this is for the final round
   * @returns {Array} Array of 4 category options with their questions
   */
  getRandomCategories(isFinalRound = false, usedQuestions = new Set()) {
    if (!this.currentPack) {
      throw new Error('No question pack selected');
    }

    const pack = this.questionPacks.get(this.currentPack);
    const questions = isFinalRound ? pack.final_round : pack.early_rounds;

    // Filter out questions that have already been used this game
    const available = questions.filter(q => !usedQuestions.has(q.question));

    // Shuffle to randomize selection
    const shuffled = [...available].sort(() => 0.5 - Math.random());

    const selected = [];
    const usedCategories = new Set();

    // Prefer unique categories
    for (const q of shuffled) {
      if (!usedCategories.has(q.category)) {
        selected.push(q);
        usedCategories.add(q.category);
      }
      if (selected.length === 4) break;
    }

    // If we still don't have enough options (e.g., not enough unique categories)
    if (selected.length < 4) {
      for (const q of shuffled) {
        if (!selected.includes(q)) {
          selected.push(q);
        }
        if (selected.length === 4) break;
      }
    }

    return selected.map((question, index) => ({
      id: index,
      category: question.category,
      question: question // Store full question for later use
    }));
  }

  /**
   * Get a random question from the final round
   * @returns {Object} Question object
   */
  getRandomFinalRoundQuestion(usedQuestions = new Set()) {
    if (!this.currentPack) {
      throw new Error('No question pack selected');
    }

    const pack = this.questionPacks.get(this.currentPack);
    const questions = pack.final_round;

    const available = questions.filter(q => !usedQuestions.has(q.question));
    const pool = available.length > 0 ? available : questions;

    return pool[Math.floor(Math.random() * pool.length)];
  }

  /**
   * Get a random lie from a question's lies array (for disconnected players)
   * @param {Object} question - The question object
   * @returns {string} A random lie
   */
  getRandomLieFromQuestion(question, usedLies = new Set()) {
    if (!question.lies || question.lies.length === 0) {
      return "Mystery answer"; // Fallback
    }

    const available = question.lies.filter(l => !usedLies.has(l));
    const pool = available.length > 0 ? available : question.lies;

    return pool[Math.floor(Math.random() * pool.length)];
  }

  /**
   * Shuffle an array of options (lies + truth) for display
   * @param {Array} options - Array of answer options
   * @returns {Array} Shuffled array with position tracking
   */
  shuffleOptions(options) {
    const shuffled = options.map((option, originalIndex) => {
      const opt = typeof option === 'string' ? { text: option } : { ...option };
      return {
        ...opt,
        originalIndex,
        id: Math.random().toString(36).substr(2, 9) // Unique ID for frontend
      };
    });
    
    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled;
  }
}

module.exports = QuestionService;
