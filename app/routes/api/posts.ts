import { ActionFunction, createCookie, redirect } from 'remix';
import { DiscussListItem } from '~/components/Discuss/Discuss';
import { parseFormData } from '~/utils';
import { db } from '~/utils/db.server';

import { Category, Post, Tag } from '@prisma/client';

export type PostListItem = Post & {
  tag: Tag[];
  cate: Category[];
  comment: DiscussListItem[];
};

export const action: ActionFunction = async ({ request }) => {
  const query = await parseFormData(request);
  return api_get_posts(query);
};

export async function api_get_posts(query: any): Promise<Page<PostListItem>> {
  const pageSize = query.pageSize || 10;
  const current = query.current || 1;

  const keyword = query.k ? String(query.k) : undefined;
  const where = keyword
    ? {
        OR: [{ title: { contains: keyword } }, { content: keyword }],
      }
    : undefined;

  const results = await db.post.findMany({
    take: pageSize,
    skip: (current - 1) * pageSize,
    where: where,
    include: {
      tag: true,
      cate: true,
      comment: {
        include: {
          reply: { select: { id: true } },
        },
      },
    },
  });

  const total = await db.post.count({ where });

  return { results, total, current, pageSize } as Page<PostListItem>;
}

export async function api_get_post_by_id(postId: string) {
  return db.post.findUnique({
    where: { id: postId },
    include: {
      tag: true,
      cate: true,
      comment: {
        include: {
          reply: {
            include: { user: true },
            orderBy: { createdAt: 'asc' },
          },
          user: true,
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
}
