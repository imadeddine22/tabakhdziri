/**
 * Utility functions for smart search with enhanced keyword mapping
 * Handles French accents, Arabic character variations, and food-related keywords
 */

// Keyword mapping for common food attributes and synonyms
const KEYWORD_MAP = {
    // Arabic keywords
    'حار': ['حار', 'حريف', 'بهار', 'فلفل'],
    'حلو': ['حلو', 'حلويات', 'سكر', 'عسل'],
    'مالح': ['مالح', 'ملح'],
    'لحم': ['لحم', 'دجاج', 'لحوم', 'مشوي', 'مشاوي'],
    'دجاج': ['دجاج', 'فروج', 'طيور'],
    'سمك': ['سمك', 'أسماك', 'بحري', 'جمبري'],
    'خضار': ['خضار', 'خضروات', 'نباتي'],
    'حساء': ['حساء', 'شوربة', 'حريرة'],
    'مشوي': ['مشوي', 'مشاوي', 'شواء', 'باربيكيو'],
    'مقلي': ['مقلي', 'قلي', 'محمر'],
    'مطبوخ': ['مطبوخ', 'طبخ', 'مطهو'],
    'تقليدي': ['تقليدي', 'تراثي', 'شعبي', 'أصيل'],
    'جزائري': ['جزائري', 'جزائرية', 'دزيري'],
    'عربي': ['عربي', 'عربية', 'شرقي'],
    'مناسبة': ['مناسبة', 'حفل', 'عرس', 'زفاف', 'عيد'],
    'عائلي': ['عائلي', 'عائلة', 'جماعي'],

    // French keywords
    'épicé': ['épicé', 'piquant', 'fort', 'harissa'],
    'sucré': ['sucré', 'doux', 'dessert', 'gâteau'],
    'salé': ['salé', 'sel'],
    'viande': ['viande', 'poulet', 'agneau', 'boeuf', 'mouton'],
    'poulet': ['poulet', 'volaille', 'chicken'],
    'poisson': ['poisson', 'fruits de mer', 'crevette'],
    'légumes': ['légumes', 'végétarien', 'salade'],
    'soupe': ['soupe', 'harira', 'chorba'],
    'grillé': ['grillé', 'barbecue', 'grill'],
    'frit': ['frit', 'friture'],
    'traditionnel': ['traditionnel', 'authentique', 'classique'],
    'algérien': ['algérien', 'algérienne', 'dziri'],
    'arabe': ['arabe', 'oriental'],
    'événement': ['événement', 'fête', 'mariage', 'célébration'],
    'familial': ['familial', 'famille', 'groupe'],

    // Dish-specific keywords
    'couscous': ['couscous', 'كسكس', 'seksu'],
    'tajine': ['tajine', 'طاجين', 'tagine'],
    'mechoui': ['mechoui', 'مشوي', 'mouton'],
    'chorba': ['chorba', 'شوربة', 'soupe'],
    'rechta': ['rechta', 'رشتة', 'nouilles'],
    'berkoukes': ['berkoukes', 'بركوكس', 'aïch'],
};

export const normalizeText = (text) => {
    if (!text) return '';

    return String(text)
        .toLowerCase()
        // 1. Normalize unicode (separates accents from characters)
        .normalize("NFD")
        // 2. Remove accents/diacritics (French/Arabic vowels)
        .replace(/[\u0300-\u036f]/g, "")
        // 3. Normalize Arabic characters
        .replace(/[أإآ]/g, 'ا') // Normalize Alifs
        .replace(/ة/g, 'ه')     // Ta Marbuta -> Ha
        .replace(/ى/g, 'ي')     // Alif Maqsura -> Ya
        .replace(/ؤ/g, 'و')     // Waw
        .replace(/ئ/g, 'ي')     // Ya with Hamza
        // 4. Remove special characters and extra spaces
        .replace(/[^\w\s\u0600-\u06FF]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
};

/**
 * Expand query with related keywords
 */
const expandQuery = (query) => {
    const normalizedQuery = normalizeText(query);
    const expanded = new Set([normalizedQuery]);

    // Check if query matches any keyword category
    Object.entries(KEYWORD_MAP).forEach(([key, synonyms]) => {
        const normalizedKey = normalizeText(key);
        const normalizedSynonyms = synonyms.map(s => normalizeText(s));

        // If query matches key or any synonym, add all synonyms
        if (normalizedQuery.includes(normalizedKey) ||
            normalizedSynonyms.some(syn => normalizedQuery.includes(syn))) {
            normalizedSynonyms.forEach(syn => expanded.add(syn));
        }
    });

    return Array.from(expanded);
};

/**
 * Calculate similarity score between two strings (0-1)
 * Higher score = more similar
 */
const calculateSimilarity = (str1, str2) => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    // Check if shorter is contained in longer
    if (longer.includes(shorter)) {
        return 0.8 + (shorter.length / longer.length) * 0.2;
    }

    // Count matching characters in sequence
    let matches = 0;
    let lastIndex = -1;
    for (let i = 0; i < shorter.length; i++) {
        const index = longer.indexOf(shorter[i], lastIndex + 1);
        if (index > lastIndex) {
            matches++;
            lastIndex = index;
        }
    }

    return matches / longer.length;
};

/**
 * Smart search function that matches query against multiple fields
 * Supports fuzzy matching, keyword expansion, and Arabic/French text
 * Returns true if match found
 */
export const smartSearch = (item, query, fields = ['name', 'description', 'category', 'type', 'name_ar', 'description_ar']) => {
    if (!query) return true;

    // Expand query with related keywords
    const expandedQueries = expandQuery(query);

    // Check all specified fields
    return fields.some(field => {
        let value = item[field];

        // Handle nested category object
        if (field === 'category' && typeof value === 'object') {
            value = value?.name || value?.name_ar || '';
        }

        if (!value) return false;

        const normalizedValue = normalizeText(value);

        // Check each expanded query
        return expandedQueries.some(expandedQuery => {
            const queryTerms = expandedQuery.split(' ').filter(t => t.length > 0);

            return queryTerms.some(term => {
                // Exact match or contains
                if (normalizedValue.includes(term)) {
                    return true;
                }

                // Fuzzy match: check if term is similar to any word in value
                const valueWords = normalizedValue.split(' ');
                return valueWords.some(word => {
                    // If term is at least 3 chars, allow fuzzy matching
                    if (term.length >= 3) {
                        const similarity = calculateSimilarity(term, word);
                        return similarity >= 0.5; // 50% similarity threshold (more lenient)
                    }
                    // For short terms, require starts with
                    return word.startsWith(term);
                });
            });
        });
    });
};
