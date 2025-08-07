# Saleor Locale Translation Script

This documentation describes how to use the automatic translation script powered by Google Gemini AI to translate locale files for the Saleor Dashboard.

## Overview

The translation script (`scripts/translate.js`) automates the process of translating UI text from English to other languages using Google's Gemini AI. It's designed to handle large locale files efficiently with batch processing, progress saving, error recovery, and automatic file naming.

## Features

- **AI-Powered Translation**: Uses Google Gemini 2.5 Flash model for high-quality translations
- **Automatic File Naming**: Automatically generates backup and output file names based on target file
- **Batch Processing**: Translates entries in configurable batches to respect API rate limits
- **Progress Saving**: Saves progress after each batch to prevent data loss
- **Error Recovery**: Automatically retries failed batches with exponential backoff
- **Context-Aware**: Preserves placeholders, HTML tags, and considers context information
- **Backup System**: Creates backups before starting translation
- **Resume Capability**: Can resume from where it left off if interrupted
- **Manual Review**: Outputs to separate file for manual review before applying

## Prerequisites

### 1. Google Gemini API Key

You need a Google Gemini API key to use this script:

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click on "Get API key" in the left sidebar
4. Create a new API key or use an existing one
5. Copy the API key for use in the script

### 2. Node.js Version

- **Recommended**: Node.js 18+ (has built-in fetch support)
- **Minimum**: Node.js 14+ (will automatically install node-fetch as polyfill)

## Setup

### 1. Set Environment Variable

Set your Gemini API key as an environment variable:

**Windows (Command Prompt):**
```cmd
set GEMINI_API_KEY=your_api_key_here
```

**Windows (PowerShell):**
```powershell
$env:GEMINI_API_KEY="your_api_key_here"
```

**Linux/macOS:**
```bash
export GEMINI_API_KEY=your_api_key_here
```

### 2. Verify Setup

Check that your API key is set correctly:

**Windows:**
```cmd
echo %GEMINI_API_KEY%
```

**Linux/macOS:**
```bash
echo $GEMINI_API_KEY
```

## Usage

### Basic Usage

Navigate to the project root directory and run:

```bash
node scripts/translate.js
```

Or if you have an npm script set up:

```bash
npm run translate
```

### Command Line Options

The script supports various command-line options to customize its behavior:

```bash
node scripts/translate.js [options]
```

#### Available Options

| Option | Description | Default |
|--------|-------------|---------|
| `--help`, `-h` | Show help message | - |
| `--batch-size N` | Number of keys to translate per batch | 50 |
| `--delay N` | Delay between batches in milliseconds | 2000 |
| `--source FILE` | Source locale file path | `./locale/defaultMessages.json` |
| `--target FILE` | Target locale file path | `./locale/{target-lang}.json` |
| `--target-lang LANG` | Target language code | `ru` |
| `--include-existing` | Include existing translations from target file | false |

#### Examples

**Translate with smaller batches and longer delays:**
```bash
node scripts/translate.js --batch-size 10 --delay 5000
```

**Include existing translations:**
```bash
node scripts/translate.js --include-existing
```

**Translate to different languages:**
```bash
# French - will create ./locale/fr.json, ./locale/backup-fr.json, ./locale/new-fr.json
node scripts/translate.js --target-lang fr

# Spanish - will create ./locale/es.json, ./locale/backup-es.json, ./locale/new-es.json  
node scripts/translate.js --target-lang es

# German with custom target file
node scripts/translate.js --target ./translations/german.json --target-lang de
```

**Custom source and target files:**
```bash
# Custom paths - backup and output files will be auto-generated
node scripts/translate.js --source ./locale/en.json --target ./locale/custom-es.json --target-lang es
```

## Configuration

### Default Configuration

The script uses the following default configuration:

```javascript
const CONFIG = {
  BATCH_SIZE: 50,                    // Entries per batch
  DELAY_BETWEEN_BATCHES: 2000,       // 2 seconds between batches
  SOURCE_LANGUAGE: "en",             // Source language
  TARGET_LANGUAGE: "ru",             // Target language
  SOURCE_FILE: "./locale/defaultMessages.json",
  TARGET_FILE: null,                 // Auto-generated as ./locale/{target-lang}.json
  BACKUP_FILE: null,                 // Auto-generated as backup-{target-filename}
  OUTPUT_FILE: null,                 // Auto-generated as new-{target-filename}
  INCLUDE_EXISTING: false
};
```

### Automatic File Naming

The script automatically generates file names based on your target configuration:

- **Target file**: If not specified, defaults to `./locale/{target-language}.json`
- **Backup file**: Automatically named as `backup-{target-filename}`
- **Output file**: Automatically named as `new-{target-filename}`

#### Examples:

| Target Language | Target File | Backup File | Output File |
|----------------|-------------|-------------|-------------|
| `ru` | `./locale/ru.json` | `./locale/backup-ru.json` | `./locale/new-ru.json` |
| `fr` | `./locale/fr.json` | `./locale/backup-fr.json` | `./locale/new-fr.json` |
| Custom: `./translations/spanish.json` | `./translations/spanish.json` | `./translations/backup-spanish.json` | `./translations/new-spanish.json` |

### Customizing Configuration

You can customize the configuration by:

1. **Command-line arguments** (recommended for temporary changes)
2. **Modifying the CONFIG object** in the script (for permanent changes)
3. **Environment variables** (for the API key)

## File Structure

The script works with automatically generated file paths based on your configuration:

### Input Files

- **Source File** (`./locale/defaultMessages.json`): Contains English messages with context
- **Target File** (auto-generated or specified): Existing translations (if `--include-existing` is used)

### Output Files

- **New Translation File** (auto-generated as `new-{target-filename}`): Generated translations for review
- **Backup File** (auto-generated as `backup-{target-filename}`): Backup of original target file
- **Original Target File**: Preserved unchanged

### File Naming Examples

When you run the script, it automatically creates appropriately named files:

```bash
# Default (Russian)
node scripts/translate.js
# Creates: ./locale/ru.json, ./locale/backup-ru.json, ./locale/new-ru.json

# French
node scripts/translate.js --target-lang fr
# Creates: ./locale/fr.json, ./locale/backup-fr.json, ./locale/new-fr.json

# Custom target file
node scripts/translate.js --target ./translations/spanish.json --target-lang es
# Creates: ./translations/spanish.json, ./translations/backup-spanish.json, ./translations/new-spanish.json
```

### Locale File Format

The script expects locale files in the following format:

```json
{
  "key1": {
    "string": "English text to translate",
    "context": "Optional context description"
  },
  "key2": {
    "string": "Another text with {placeholder}",
    "context": "Context helps AI understand usage"
  }
}
```

## Translation Process

### Step-by-Step Process

1. **Initialization**: Load configuration and validate API key
2. **File Loading**: Load source file and existing target file (if specified)
3. **Backup Creation**: Create backup of existing target file
4. **Analysis**: Identify entries that need translation
5. **Batch Processing**: Translate entries in configurable batches
6. **Progress Saving**: Save progress after each successful batch
7. **Error Handling**: Retry failed batches with delays
8. **Finalization**: Generate final translation file for review

### Translation Quality

The AI is prompted to:

- Maintain original meaning and context
- Use appropriate e-commerce terminology
- Keep placeholders (e.g., `{orderNumber}`) unchanged
- Preserve HTML tags
- Use formal/professional tone for business software
- Consider provided context information

### Batch Processing Logic

- Processes entries in batches to respect API rate limits
- Default batch size: 50 entries
- Default delay: 2 seconds between batches
- Automatically retries failed batches
- Saves progress after each successful batch

## Error Handling

### Common Errors and Solutions

#### 1. API Key Missing
```
Error: GEMINI_API_KEY environment variable is required
```

**Solution**: Set the `GEMINI_API_KEY` environment variable

#### 2. API Rate Limiting
```
API request failed: 429 Too Many Requests
```

**Solutions**:
- Increase delay between batches: `--delay 5000`
- Decrease batch size: `--batch-size 10`
- Wait and try again later

#### 3. File Not Found
```
Failed to load source file: ENOENT: no such file or directory
```

**Solution**: Verify file paths and ensure files exist

#### 4. Invalid JSON Response
```
No JSON found in response
```

**Solution**: Check API key validity and try with smaller batch size

#### 5. Network Issues
```
fetch failed
```

**Solution**: Check internet connection and try again

### Error Recovery

The script automatically handles errors by:

- Retrying failed batches up to 3 times
- Adding delays between retries
- Continuing from the last successful batch
- Preserving all completed work

## Best Practices

### 1. Review Translations

Always review the generated translations before applying them:

```bash
# Compare original and new files
diff locale/ru.json locale/ru.new.json

# Or use a visual diff tool
code --diff locale/ru.json locale/ru.new.json
```

### 2. Start with Small Batches

For first-time usage or large files, start with smaller batches:

```bash
node scripts/translate.js --batch-size 10 --delay 3000
```

### 3. Use Existing Translations

To build upon existing translations:

```bash
node scripts/translate.js --include-existing
```

### 4. Test with Subsets

For testing, create a smaller source file:

```bash
# Create test file with first 10 entries
head -20 locale/defaultMessages.json > locale/test-messages.json
node scripts/translate.js --source ./locale/test-messages.json --target ./locale/test-ru.json
```

### 5. Monitor Progress

The script provides detailed progress information:

```
🔄 Processing batch 5/20 (50 entries)
✅ Batch 5 completed (250/1000 total)
⏳ Waiting 2000ms before next batch...
```

## Troubleshooting

### 1. Script Stops Unexpectedly

The script saves progress after each batch. Simply restart it:

```bash
node scripts/translate.js --include-existing
```

### 2. Poor Translation Quality

Try:
- Adding more context to source entries
- Using smaller batch sizes
- Reviewing and editing the prompt in the script

### 3. API Quota Exceeded

- Wait for quota reset (usually 24 hours)
- Consider upgrading your Google AI Studio plan
- Use longer delays between requests

### 4. Large Files Taking Too Long

For files with thousands of entries:
- Use smaller batch sizes (10-20)
- Increase delays (5000ms+)
- Run during off-peak hours
- Consider splitting the file

## Manual Review and Application

After translation completes:

### 1. Review the Output

```bash
# Open the new file for review (example for Russian)
code locale/new-ru.json

# Compare with original
code --diff locale/ru.json locale/new-ru.json
```

### 2. Apply the Translations

If satisfied with the translations:

```bash
# Backup the original (if not done automatically)
copy locale\ru.json locale\ru.original.json

# Apply the new translations (example for Russian)
move locale\new-ru.json locale\ru.json
```

### 3. Test the Application

After applying translations:
1. Start the development server
2. Switch to the translated language
3. Navigate through different pages
4. Verify translations appear correctly
5. Check for any missing or broken translations

## Integration with Development Workflow

### 1. Git Integration

Add to your git workflow:

```bash
# Before translating
git checkout -b update-translations
git add locale/defaultMessages.json

# After translating and reviewing (example for Russian)
git add locale/ru.json locale/backup-ru.json
git commit -m "Update Russian translations via Gemini AI"
git push origin update-translations
```

### 2. CI/CD Integration

Consider automating translation updates:

```yaml
# Example GitHub Action
name: Update Translations
on:
  schedule:
    - cron: '0 2 * * 1'  # Weekly on Monday at 2 AM
jobs:
  translate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: node scripts/translate.js --include-existing
        env:
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
      - name: Create PR
        # Create pull request with translations
```

### 3. Package.json Scripts

Add convenient npm scripts:

```json
{
  "scripts": {
    "translate": "node scripts/translate.js",
    "translate:fresh": "node scripts/translate.js",
    "translate:incremental": "node scripts/translate.js --include-existing",
    "translate:test": "node scripts/translate.js --batch-size 5 --delay 1000"
  }
}
```

## Advanced Usage

### 1. Multiple Languages

Translate to multiple languages with automatic file naming:

```bash
# Russian (creates ./locale/ru.json, ./locale/backup-ru.json, ./locale/new-ru.json)
node scripts/translate.js --target-lang ru

# French (creates ./locale/fr.json, ./locale/backup-fr.json, ./locale/new-fr.json)
node scripts/translate.js --target-lang fr

# Spanish (creates ./locale/es.json, ./locale/backup-es.json, ./locale/new-es.json)
node scripts/translate.js --target-lang es

# Custom path for Italian
node scripts/translate.js --target ./translations/italian.json --target-lang it
```

### 2. Custom Prompts

Modify the translation prompt in the script for specific needs:

```javascript
const promptHeader = `You are a professional translator for e-commerce software.
Translate from English to ${CONFIG.TARGET_LANGUAGE}.
Special requirements:
- Use technical terminology appropriate for retail/commerce
- Maintain formal business tone
- Preserve all placeholders and HTML tags
...`;
```

### 3. Filtering Entries

Modify the script to translate only specific entries:

```javascript
getUntranslatedEntries() {
  const untranslated = [];
  for (const [key, entry] of Object.entries(this.sourceData)) {
    // Only translate entries matching pattern
    if (key.startsWith('product.') && !this.targetData[key]) {
      untranslated.push([key, entry]);
    }
  }
  return untranslated;
}
```

## Performance Optimization

### 1. API Rate Limits

Gemini AI has rate limits. Optimize by:

- **Free tier**: 15 requests/minute → use `--delay 4000`
- **Paid tier**: Higher limits → can use default settings
- **Batch size**: Balance between efficiency and reliability

### 2. Memory Usage

For very large locale files:

- Process in smaller chunks
- Use streaming JSON parsing
- Clear processed data from memory

### 3. Network Optimization

- Use stable internet connection
- Consider running on server with better connectivity
- Implement exponential backoff for retries

## Security Considerations

### 1. API Key Security

- Never commit API keys to version control
- Use environment variables or secure vaults
- Rotate API keys regularly
- Limit API key permissions if possible

### 2. Data Privacy

- Review what data is sent to Google's API
- Consider data privacy regulations (GDPR, etc.)
- Avoid translating sensitive information
- Use on-premises solutions if required

## Maintenance

### 1. Regular Updates

- Update to newer Gemini models when available
- Monitor API changes and deprecations
- Update dependencies regularly
- Review and improve translation prompts

### 2. Quality Assurance

- Regularly review translation quality
- Gather feedback from native speakers
- Maintain glossaries for consistent terminology
- Test translations in the actual application

## Support and Contributing

### Getting Help

1. Check this documentation first
2. Review error messages carefully
3. Search existing issues in the repository
4. Create detailed bug reports with:
    - Error messages
    - Configuration used
    - Sample data (anonymized)
    - Steps to reproduce

### Contributing Improvements

1. Fork the repository
2. Create feature branch
3. Test changes thoroughly
4. Update documentation
5. Submit pull request with detailed description

## Changelog

- **v1.0.0**: Initial release with Gemini AI integration
- Features: Batch processing, progress saving, error recovery
- Supports: Node.js 14+, multiple target languages, CLI options