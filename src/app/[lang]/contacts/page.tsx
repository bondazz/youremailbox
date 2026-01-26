import { getDictionary } from '@/get-dictionary';
import { Metadata } from 'next';
import ContactClient from './ContactClient';

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { lang } = await params;
    return {
        title: `Contact Us | YourEmailBox Security Protocol`,
        description: `Get in touch with the YourEmailBox technical team for support, security reports, or business inquiries.`,
    };
}

export default async function ContactPage({ params }: { params: Params }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);

    return <ContactClient dictionary={dictionary} lang={lang} />;
}
