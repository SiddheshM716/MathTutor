import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chapter = searchParams.get('chapter');
  const exampleId = searchParams.get('exampleId');

  if (!chapter || !exampleId) {
    return NextResponse.json({ error: 'Missing chapter or exampleId' }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), 'public', 'examples_html', chapter, `${exampleId}.html`);
    const fileContent = await fs.readFile(filePath, 'utf8');

    const bodyMatch = fileContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const htmlBody = bodyMatch ? bodyMatch[1] : '';

    return NextResponse.json({ htmlBody });
  } catch (err) {
    console.error('API Error - File not found:', err);
    return NextResponse.json({ error: 'Example not found' }, { status: 404 });
  }
}