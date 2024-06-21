import fs from 'node:fs';

export function getCatalog(): Section[] {
    const catalogStr = fs.readFileSync('app/utils/catalog.json', 'utf8');
    return JSON.parse(catalogStr);
}