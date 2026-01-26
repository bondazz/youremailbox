import { NextRequest, NextResponse } from 'next/server';
import { fetchEmails } from '@/lib/imap';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const alias = searchParams.get('alias');

    if (!alias) {
        return NextResponse.json({ error: 'Alias is required' }, { status: 400 });
    }

    try {
        const emails = await fetchEmails(alias);
        return NextResponse.json({ emails });
    } catch (error: any) {
        console.error('IMAP Error:', error);
        return NextResponse.json({ error: 'Failed to fetch emails', details: error.message }, { status: 500 });
    }
}
