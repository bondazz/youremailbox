import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const blogFilePath = path.join(process.cwd(), 'src/lib/data/blog.json');

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');

        const fileContent = fs.readFileSync(blogFilePath, 'utf8');
        const posts = JSON.parse(fileContent);

        if (slug) {
            const post = posts.find((p: any) => p.slug === slug);
            return NextResponse.json(post);
        }

        return NextResponse.json(posts);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read posts' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const newPost = await request.json();
        const fileContent = fs.readFileSync(blogFilePath, 'utf8');
        let posts = JSON.parse(fileContent);

        // Find if it's an update
        const existingIndex = posts.findIndex((p: any) => p.slug === newPost.slug);

        if (existingIndex !== -1) {
            // Update
            posts[existingIndex] = { ...posts[existingIndex], ...newPost };
        } else {
            // Create
            posts.unshift(newPost);
        }

        fs.writeFileSync(blogFilePath, JSON.stringify(posts, null, 2));
        return NextResponse.json({ success: true, post: newPost });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save post' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { slug } = await request.json();
        const fileContent = fs.readFileSync(blogFilePath, 'utf8');
        let posts = JSON.parse(fileContent);

        posts = posts.filter((p: any) => p.slug !== slug);

        fs.writeFileSync(blogFilePath, JSON.stringify(posts, null, 2));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}
