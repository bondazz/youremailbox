export type DomainConfig = {
    domain: string;
    baseUrl: string;
    siteName: string;
    emailDomain: string;
};

export const DOMAINS: Record<string, DomainConfig> = {
    'tempmaila.org': {
        domain: 'tempmaila.org',
        baseUrl: 'https://tempmaila.org',
        siteName: 'TempMaila',
        emailDomain: 'tempmaila.org',
    },
    'youremailbox.com': {
        domain: 'youremailbox.com',
        baseUrl: 'https://youremailbox.com',
        siteName: 'YourEmailBox',
        emailDomain: 'youremailbox.com',
    },
};

export function getDomainConfig(hostHeader?: string | null): DomainConfig {
    // Default to ouremailbox if no host is found
    const host = hostHeader || (typeof window !== 'undefined' ? window.location.hostname : 'youremailbox.com');

    if (host.includes('tempmaila.org')) {
        return DOMAINS['tempmaila.org'];
    }

    return DOMAINS['youremailbox.com'];
}

export function translateBranding(text: string, siteName: string, domain: string): string {
    if (!text) return text;
    return text.replace(/YourEmailBox/g, siteName).replace(/youremailbox\.com/g, domain);
}
