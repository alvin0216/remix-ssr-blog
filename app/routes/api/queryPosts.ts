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
  return getPostList(query);
};

export async function getPostList(query: any): Promise<Page<PostListItem>> {
  const pageSize = query.pageSize || 10;
  const current = query.current || 1;

  const where = query.k
    ? {
        OR: [{ title: { contains: query.k } }, { content: query.k }],
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
