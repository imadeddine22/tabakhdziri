// Helper function to get translated text based on current language
export function getTranslatedText(item: any, field: string, language: string): string {
    if (!item) return '';

    // If language is Arabic and Arabic translation exists, use it
    if (language === 'ar' && item[`${field}_ar`]) {
        return item[`${field}_ar`];
    }

    // Otherwise, use the default (French) field
    return item[field] || '';
}

// Helper to get product name
export function getProductName(product: any, language: string): string {
    return getTranslatedText(product, 'name', language);
}

// Helper to get product description
export function getProductDescription(product: any, language: string): string {
    return getTranslatedText(product, 'description', language);
}
