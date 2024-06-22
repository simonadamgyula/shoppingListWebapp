import fs from 'node:fs';

export function getCatalog(): Section[] {
    const catalogStr = fs.readFileSync('app/utils/catalog.json', 'utf8');
    return JSON.parse(catalogStr);
}

export function searchCatalog(search: string): Section[] {
    const catalogStr = fs.readFileSync('app/utils/catalog.json', 'utf8');
    const catalog = JSON.parse(catalogStr);
    const searchLower = search.toLowerCase();
    const filteredSections = catalog.filter((section: Section) => {
        return section.items.filter(item => {
            return item.name.toLowerCase().includes(searchLower);
        }).length > 0;
    });

    return filteredSections.map((section: Section) => {
        return {
            name: section.name,
            items: section.items.filter(item => item.name.toLowerCase().includes(searchLower)),
        };
    });
}