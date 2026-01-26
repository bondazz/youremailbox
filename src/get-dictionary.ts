import 'server-only';

const dictionaries: any = {
    en: () => import('./dictionaries/en.json').then((module) => module.default),
    az: () => import('./dictionaries/az.json').then((module) => module.default),
    tr: () => import('./dictionaries/tr.json').then((module) => module.default),
    ru: () => import('./dictionaries/ru.json').then((module) => module.default),
    ar: () => import('./dictionaries/ar.json').then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
    const load = dictionaries[locale] || dictionaries.en;
    return await load();
};
