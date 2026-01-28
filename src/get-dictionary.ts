import 'server-only';

const dictionaries: any = {
    en: () => import('./dictionaries/en.json').then((module) => module.default),
    az: () => import('./dictionaries/az.json').then((module) => module.default),
    tr: () => import('./dictionaries/tr.json').then((module) => module.default),
    ru: () => import('./dictionaries/ru.json').then((module) => module.default),
    ar: () => import('./dictionaries/ar.json').then((module) => module.default),
    zh: () => import('./dictionaries/zh.json').then((module) => module.default),
    fr: () => import('./dictionaries/fr.json').then((module) => module.default),
    de: () => import('./dictionaries/de.json').then((module) => module.default),
    hi: () => import('./dictionaries/hi.json').then((module) => module.default),
    hu: () => import('./dictionaries/hu.json').then((module) => module.default),
    it: () => import('./dictionaries/it.json').then((module) => module.default),
    fa: () => import('./dictionaries/fa.json').then((module) => module.default),
    es: () => import('./dictionaries/es.json').then((module) => module.default),
    uk: () => import('./dictionaries/uk.json').then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
    const load = dictionaries[locale] || dictionaries.en;
    return await load();
};
