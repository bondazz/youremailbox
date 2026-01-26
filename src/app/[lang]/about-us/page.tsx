import { getDictionary } from '@/get-dictionary';
import { Metadata } from 'next';
import AboutUsClient from './AboutUsClient';

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { lang } = await params;
    return {
        title: `About Us | YourEmailBox Security Protocol`,
        description: `Learn about the mission and technical standards of YourEmailBox, the leading provider of high-speed temporary email services.`,
    };
}

export default async function AboutUsPage({ params }: { params: Params }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);

    return <AboutUsClient dictionary={dictionary} lang={lang} />;
}
