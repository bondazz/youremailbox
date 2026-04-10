import { headers } from 'next/headers';
import { getDomainConfig } from '@/lib/domain';

export default async function robots() {
    const host = (await headers()).get('host');
    const { baseUrl } = getDomainConfig(host);

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/admin/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap_index.xml`,
    };
}
