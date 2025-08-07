#!/usr/bin/env node
const fs = require("fs/promises");

// Polyfill fetch for Node.js versions < 18
if (!globalThis.fetch) {
  console.log("⚠️  Fetch not available, installing node-fetch...");

  try {
    const fetch = require("node-fetch");

    globalThis.fetch = fetch;
  } catch (error) {
    console.error("❌ Please install node-fetch: npm install node-fetch");
    console.error("Or use Node.js 18+ which has built-in fetch support");
    process.exit(1);
  }
}

// Configuration
const CONFIG = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  BATCH_SIZE: 50, // Number of keys to translate per batch
  DELAY_BETWEEN_BATCHES: 2000, // Delay in ms between batches
  SOURCE_LANGUAGE: "en",
  TARGET_LANGUAGE: "ru",
  SOURCE_FILE: "./locale/defaultMessages.json",
  TARGET_FILE: null, // Will be auto-generated if not provided
  BACKUP_FILE: null, // Will be auto-generated based on target file
  OUTPUT_FILE: null, // Will be auto-generated based on target file
  INCLUDE_EXISTING: false, // Whether to include existing translations from target file
  GEMINI_API_URL:
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
};

class LocaleTranslator {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }

    this.apiKey = apiKey;
    this.sourceData = {};
    this.targetData = {};
    this.translatedCount = 0;
    this.totalCount = 0;

    // Initialize file paths
    this.initializeFilePaths();
  }

  /**
   * Initialize file paths based on target file or target language
   */
  initializeFilePaths() {
    // If no target file specified, use target language
    if (!CONFIG.TARGET_FILE) {
      CONFIG.TARGET_FILE = `./locale/${CONFIG.TARGET_LANGUAGE}.json`;
    }

    // Generate backup and output file names from target file
    const targetPath = CONFIG.TARGET_FILE;
    const pathParts = targetPath.split("/");
    const fileName = pathParts[pathParts.length - 1];
    const dirPath = pathParts.slice(0, -1).join("/");

    // Generate backup file: backup-ru.json or backup-existing-name.json
    const backupFileName = `backup-${fileName}`;

    CONFIG.BACKUP_FILE = dirPath ? `${dirPath}/${backupFileName}` : backupFileName;

    // Generate output file: new-ru.json or new-existing-name.json
    const outputFileName = `new-${fileName}`;

    CONFIG.OUTPUT_FILE = dirPath ? `${dirPath}/${outputFileName}` : outputFileName;
  }

  /**
   * Load source locale file
   */
  async loadSourceLocale() {
    try {
      const sourceContent = await fs.readFile(CONFIG.SOURCE_FILE, "utf-8");

      this.sourceData = JSON.parse(sourceContent);
      this.totalCount = Object.keys(this.sourceData).length;
      console.log(`✅ Loaded ${this.totalCount} entries from source file`);
    } catch (error) {
      throw new Error(`Failed to load source file: ${error}`);
    }
  }

  /**
   * Load existing target locale file
   */
  async loadTargetLocale() {
    if (!CONFIG.INCLUDE_EXISTING) {
      console.log("ℹ️  Skipping existing translations (--include-existing not specified)");
      this.targetData = {};

      return;
    }

    try {
      const targetContent = await fs.readFile(CONFIG.TARGET_FILE, "utf-8");

      this.targetData = JSON.parse(targetContent);
      console.log(
        `✅ Loaded existing target file with ${Object.keys(this.targetData).length} entries`,
      );
    } catch (error) {
      console.log("ℹ️  Target file not found, starting fresh");
      this.targetData = {};
    }
  }

  /**
   * Create backup of existing target file
   */
  async createBackup() {
    try {
      await fs.copyFile(CONFIG.TARGET_FILE, CONFIG.BACKUP_FILE);
      console.log("✅ Backup created");
    } catch (error) {
      console.log("ℹ️  No existing file to backup");
    }
  }

  /**
   * Get entries that need translation
   */
  getUntranslatedEntries() {
    const untranslated = [];

    for (const [key, entry] of Object.entries(this.sourceData)) {
      // Skip if already translated
      if (
        this.targetData[key] &&
        this.targetData[key].string &&
        this.targetData[key].string.trim()
      ) {
        continue;
      }

      untranslated.push([key, entry]);
    }

    return untranslated;
  }

  /**
   * Create translation prompt for a batch of entries
   */
  createTranslationPrompt(entries) {
    const promptHeader = `You are a professional translator translating UI text from English to Russian for an e-commerce dashboard application called Saleor.

Please translate the following strings while:
1. Maintaining the original meaning and context
2. Using appropriate Russian e-commerce terminology
3. Keeping placeholders like {orderNumber}, {userName}, etc. exactly as they are
4. Preserving HTML tags if present
5. Using formal/professional tone suitable for business software
6. Considering the context provided for each string

Format your response as a JSON object with the original keys and translated strings only.

Entries to translate:

`;

    const entriesText = entries
      .map(([key, entry]) => {
        let entryText = `Key: ${key}\n`;

        if (entry.context) {
          entryText += `Context: ${entry.context}\n`;
        }

        entryText += `English: "${entry.string}"\n`;

        return entryText;
      })
      .join("\n");

    const promptFooter = `\nRespond with only a JSON object in this format:
{
  "key1": "translated_string_1",
  "key2": "translated_string_2"
}`;

    return promptHeader + entriesText + promptFooter;
  }

  /**
   * Translate a batch of entries using Gemini API
   */
  async translateBatch(entries) {
    try {
      const prompt = this.createTranslationPrompt(entries);

      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      };

      const response = await fetch(`${CONFIG.GEMINI_API_URL}?key=${this.apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          `API request failed: ${response.status} ${response.statusText} - ${errorText}`,
        );
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error("No text found in API response");
      }

      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }

      const translations = JSON.parse(jsonMatch[0]);

      console.log(entries, translations);

      return translations;
    } catch (error) {
      console.error("❌ Translation failed for batch:", error);
      throw error;
    }
  }

  /**
   * Process all untranslated entries in batches
   */
  async translateAllEntries() {
    const untranslatedEntries = this.getUntranslatedEntries();

    console.log(`🔄 Found ${untranslatedEntries.length} entries to translate`);

    if (untranslatedEntries.length === 0) {
      console.log("✅ All entries are already translated!");

      return;
    }

    // Process in batches
    for (let i = 0; i < untranslatedEntries.length; i += CONFIG.BATCH_SIZE) {
      const batch = untranslatedEntries.slice(i, i + CONFIG.BATCH_SIZE);
      const batchNumber = Math.floor(i / CONFIG.BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(untranslatedEntries.length / CONFIG.BATCH_SIZE);

      console.log(`\n🔄 Processing batch ${batchNumber}/${totalBatches} (${batch.length} entries)`);

      try {
        const translations = await this.translateBatch(batch);

        // Update target data with translations
        for (const [key, entry] of batch) {
          if (translations[key]) {
            this.targetData[key] = {
              ...entry,
              string: translations[key],
            };
            this.translatedCount++;
          }
        }

        console.log(
          `✅ Batch ${batchNumber} completed (${this.translatedCount}/${this.totalCount} total)`,
        );

        // Save progress after each batch
        await this.saveProgress();

        // Delay between batches to respect API limits
        if (i + CONFIG.BATCH_SIZE < untranslatedEntries.length) {
          console.log(`⏳ Waiting ${CONFIG.DELAY_BETWEEN_BATCHES}ms before next batch...`);
          await new Promise(resolve => setTimeout(resolve, CONFIG.DELAY_BETWEEN_BATCHES));
        }
      } catch (error) {
        console.error(`❌ Failed to process batch ${batchNumber}:`, error);
        console.log("⏸️  Pausing for 5 seconds before retrying...");
        await new Promise(resolve => setTimeout(resolve, 5000));
        i -= CONFIG.BATCH_SIZE; // Retry the same batch
      }
    }
  }

  /**
   * Save translation progress to file
   */
  async saveProgress() {
    try {
      const sortedData = {};
      const sortedKeys = Object.keys(this.targetData).sort();

      for (const key of sortedKeys) {
        sortedData[key] = this.targetData[key];
      }

      await fs.writeFile(CONFIG.OUTPUT_FILE, JSON.stringify(sortedData, null, 2), "utf-8");
    } catch (error) {
      console.error("❌ Failed to save progress:", error);
    }
  }

  /**
   * Finalize translation by keeping the new file for manual review
   */
  async finalizeTranslation() {
    try {
      // Keep the new file instead of replacing the original
      console.log("✅ Translation completed!");
      console.log("📁 New translation file saved as:", CONFIG.OUTPUT_FILE);
      console.log("📁 Original file preserved as:", CONFIG.TARGET_FILE);
      console.log("📁 Backup file saved as:", CONFIG.BACKUP_FILE);
      console.log("\n⚠️  MANUAL ACTION REQUIRED:");
      console.log("   1. Review the new translation file:", CONFIG.OUTPUT_FILE);
      console.log("   2. If satisfied with the translations, manually replace the old file:");
      console.log(`      - Delete or rename: ${CONFIG.TARGET_FILE}`);
      console.log(`      - Rename: ${CONFIG.OUTPUT_FILE} → ${CONFIG.TARGET_FILE}`);
      console.log("   3. Keep the backup file in case you need to revert changes");
    } catch (error) {
      console.error("❌ Failed to finalize translation:", error);
    }
  }

  /**
   * Display translation statistics
   */
  displayStats() {
    const totalEntries = Object.keys(this.sourceData).length;
    const translatedEntries = Object.keys(this.targetData).filter(key =>
      this.targetData[key]?.string?.trim(),
    ).length;
    const percentage = ((translatedEntries / totalEntries) * 100).toFixed(1);

    console.log("\n📊 Translation Statistics:");
    console.log(`   Total entries: ${totalEntries}`);
    console.log(`   Translated: ${translatedEntries}`);
    console.log(`   Remaining: ${totalEntries - translatedEntries}`);
    console.log(`   Progress: ${percentage}%`);
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log("🚀 Starting locale translation with Gemini AI...\n");

  try {
    const translator = new LocaleTranslator(CONFIG.GEMINI_API_KEY);

    // Load source and target data
    await translator.loadSourceLocale();
    await translator.loadTargetLocale();

    // Create backup
    await translator.createBackup();

    // Display initial stats
    translator.displayStats();

    // Perform translation
    await translator.translateAllEntries();

    // Display final stats
    translator.displayStats();

    // Finalize
    await translator.finalizeTranslation();

    console.log("\n🎉 Translation process completed successfully!");
  } catch (error) {
    console.error("\n❌ Translation failed:", error);
    process.exit(1);
  }
}

// CLI interface
async function runCLI() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
Saleor Locale Translator with Google Gemini AI

Usage: npm run translate or node translate.js [options]

Options:
  --help, -h               Show this help message
  --batch-size N           Set batch size (default: ${CONFIG.BATCH_SIZE})
  --delay N                Set delay between batches in ms (default: ${CONFIG.DELAY_BETWEEN_BATCHES})
  --source FILE            Source locale file (default: ${CONFIG.SOURCE_FILE})
  --target FILE            Target locale file (default: ./locale/{target-lang}.json)
  --target-lang LANG       Target language code (default: ${CONFIG.TARGET_LANGUAGE})
  --include-existing       Include existing translations from target file (default: false)

Environment Variables:
  GEMINI_API_KEY           Google Gemini API key (required)

File Naming:
  Target file:             Specified via --target or auto-generated as ./locale/{target-lang}.json
  Backup file:             Auto-generated as backup-{target-filename}
  Output file:             Auto-generated as new-{target-filename}

Examples:
  node translate.js --batch-size 5 --delay 3000
  node translate.js --include-existing
  node translate.js --target-lang fr
  node translate.js --target ./locale/custom.json --target-lang es
  GEMINI_API_KEY=your_key node translate.js

Notes:
  - Uses native fetch API (no external dependencies required)
  - Translates locale keys in batches to respect API rate limits
  - Creates backups and saves progress incrementally
  - Resumes from where it left off if interrupted
  - By default, starts fresh without existing translations
  - Backup and output files are automatically named based on target file
  - Use --include-existing to preserve and build upon existing translations
`);

    return;
  }

  // Parse CLI arguments
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--batch-size":
        CONFIG.BATCH_SIZE = parseInt(args[++i]) || CONFIG.BATCH_SIZE;
        break;
      case "--delay":
        CONFIG.DELAY_BETWEEN_BATCHES = parseInt(args[++i]) || CONFIG.DELAY_BETWEEN_BATCHES;
        break;
      case "--source":
        CONFIG.SOURCE_FILE = args[++i] || CONFIG.SOURCE_FILE;
        break;
      case "--target":
        CONFIG.TARGET_FILE = args[++i] || CONFIG.TARGET_FILE;
        break;
      case "--target-lang":
        CONFIG.TARGET_LANGUAGE = args[++i] || CONFIG.TARGET_LANGUAGE;
        break;
      case "--include-existing":
        CONFIG.INCLUDE_EXISTING = true;
        break;
    }
  }

  await main();
}

// Run if called directly
if (require.main === module) {
  runCLI().catch(console.error);
}

module.exports = { LocaleTranslator, CONFIG };