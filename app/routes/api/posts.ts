import { ActionFunction, createCookie, redirect } from 'remix';
import { parseFormData } from '~/utils';
import { db } from '~/utils/db.server';

import { Category, Post, Tag } from '@prisma/client';

import type { PostListItem } from '~/export.types';

export const action: ActionFunction = async ({ request }) => {
  const query = await parseFormData(request);
  return api_get_posts(query);
};

export async function api_get_posts(query: any): Promise<Page<PostListItem>> {
  const pageSize = Number(query.pageSize || 10);
  const current = Number(query.current || 1);

  const where = {
    OR: query.k ? [{ title: { contains: String(query.k) } }, { content: String(query.k) }] : undefined,
    tag: { every: { name: query.tag } },
    cate: { every: { name: query.cate } },
  };

  const searchConfig: any = query.onlyPosts
    ? {
        select: { title: true, createdAt: true, id: true },
      }
    : {
        include: {
          tag: true,
          cate: true,
          comment: {
            include: {
              reply: { select: { id: true } },
            },
          },
        },
      };

  const results = await db.post.findMany({
    take: pageSize,
    skip: (current - 1) * pageSize,
    where,
    ...searchConfig,
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
