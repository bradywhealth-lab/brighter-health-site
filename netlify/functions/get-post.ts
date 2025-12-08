import type { Config, Context } from '@netlify/functions';
import { neon } from '@netlify/neon';

const jsonHeaders = { 'content-type': 'application/json' } as const;

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  const postId = context.params?.id ?? url.searchParams.get('id');

  if (!postId) {
    return new Response(
      JSON.stringify({ error: 'Missing required post id' }),
      { status: 400, headers: jsonHeaders },
    );
  }

  try {
    const sql = neon();
    const [post] = await sql`SELECT * FROM posts WHERE id = ${postId}`;

    if (!post) {
      return new Response(
        JSON.stringify({ error: 'Post not found' }),
        { status: 404, headers: jsonHeaders },
      );
    }

    return new Response(
      JSON.stringify({ post }),
      { status: 200, headers: jsonHeaders },
    );
  } catch (error) {
    console.error('Failed to fetch post', error);
    return new Response(
      JSON.stringify({ error: 'Unable to load post' }),
      { status: 500, headers: jsonHeaders },
    );
  }
};

export const config: Config = {
  path: '/api/posts/:id',
};
