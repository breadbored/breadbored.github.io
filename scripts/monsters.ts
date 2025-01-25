import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'papaparse';

interface RawMonster {
    Name: string;
    Size: string;
    Type: string;
    Environment: string;
    HP: string;
    AC: string;
    Initiative: string;
    Alignment: string;
    Legendary: string;
    Lair: string;
    Unique: string;
    CR: string;
    Tags: string;
    Source: string;
    Url: string;
}

interface ProcessedMonster {
    name: string;
    size: string;
    type: string;
    environment: string[];
    hp: number;
    ac: number;
    initiative: number;
    alignment: string;
    isLegendary: boolean;
    hasLair: boolean;
    isUnique: boolean;
    cr: string;
    tags: string[];
    source: {
        book: string;
        page: number;
    };
    url: string;
}

// Normalize size values
function normalizeSize(size: string): string {
    const sizeMap: { [key: string]: string } = {
        'T': 'Tiny',
        'S': 'Small',
        'M': 'Medium',
        'L': 'Large',
        'H': 'Huge',
        'G': 'Gargantuan',
        'Sall': 'Small',
        'Mwsium': 'Medium',
        'Meidum': 'Medium',
        'medium': 'Medium',
        'huge': 'Huge',
        'Gargatuan': 'Gargantuan',
        'Titanic': 'Gargantuan'
    };

    size = size.trim();
    return sizeMap[size] || size.split('/')[0].trim(); // Handle cases like "Small / Medium"
}

// Normalize type values
function normalizeType(type: string): string {
    const typeMap: { [key: string]: string } = {
        'Beasts': 'Beast',
        'Constructs': 'Construct',
        'Fiends': 'Fiend',
        'Mosntrosity': 'Monstrosity',
        '(undead)': 'Undead'
    };

    type = type.trim();
    // Extract base type before parentheses or comma
    const baseType = type.split(/[\(,]/)[0].trim();
    return typeMap[baseType] || baseType;
}

// Process boolean fields
function processBoolean(value: string): boolean {
    return value.toLowerCase() === 'yes' || value.toLowerCase() === 'true' || value === '1';
}

// Process CR string
function normalizeCR(cr: string): string {
    cr = cr.trim();
    if (cr === '') return '0';
    // Convert fractional CRs to decimal format
    if (cr.includes('/')) {
        const [num, den] = cr.split('/').map(Number);
        return (num / den).toString();
    }
    return cr;
}

async function processMonsters() {
    try {
        // Read the CSV file
        const csvData = await fs.promises.readFile(path.join('_raw', 'monsters.csv'), 'utf-8');

        // Parse CSV
        const { data } = parse<RawMonster>(csvData, {
            header: true,
            skipEmptyLines: true
        });

        // Filter and process monsters
        const processedMonsters: ProcessedMonster[] = data
            .filter(monster => monster.Source.includes('Volo\'s Guide to Monsters'))
            .map(monster => {
                // Extract page number from source
                const pageMatch = monster.Source.match(/Volo's Guide to Monsters: (\d+)/);
                const page = pageMatch ? parseInt(pageMatch[1]) : 0;

                return {
                    name: monster.Name.trim(),
                    size: normalizeSize(monster.Size),
                    type: normalizeType(monster.Type),
                    environment: monster.Environment ? monster.Environment.split(',').map(e => e.trim()) : [],
                    hp: parseFloat(monster.HP) || 0,
                    ac: parseInt(monster.AC) || 0,
                    initiative: parseFloat(monster.Initiative) || 0,
                    alignment: monster.Alignment.toLowerCase().trim(),
                    isLegendary: processBoolean(monster.Legendary),
                    hasLair: processBoolean(monster.Lair),
                    isUnique: processBoolean(monster.Unique),
                    cr: normalizeCR(monster.CR),
                    tags: monster.Tags ? monster.Tags.split(',').map(t => t.trim()) : [],
                    source: {
                        book: 'Volo\'s Guide to Monsters',
                        page
                    },
                    url: monster.Url.trim()
                };
            });

        // Create _data directory if it doesn't exist
        const dataDir = path.join('_data');
        if (!fs.existsSync(dataDir)) {
            await fs.promises.mkdir(dataDir);
        }

        // Write processed data to JSON file
        await fs.promises.writeFile(
            path.join(dataDir, 'monsters.json'),
            JSON.stringify(processedMonsters, null, 2)
        );

        console.log(`Processed ${processedMonsters.length} monsters from Volo's Guide to Monsters`);

    } catch (error) {
        console.error('Error processing monsters:', error);
        process.exit(1);
    }
}

processMonsters();