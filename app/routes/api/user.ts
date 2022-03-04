import { ActionFunction, createCookie, redirect } from 'remix';
import { UserInfo } from '~/export.types';
import { parseFormData } from '~/utils';
import { db } from '~/utils/db.server';

import { Category, Post, Tag, User } from '@prisma/client';

export const action: ActionFunction = async ({ request }) => {
  const query = await parseFormData(request);
  const actionType = query.actionType;
  if (actionType === 'api_get_users') return api_get_users(query);
  if (actionType === 'api_remove_unread') api_remove_unread(query);
  return redirect(query.redirectUrl || request.url);
};

export async function api_get_users(query: any): Promise<Page<UserInfo>> {
  const pageSize = Number(query.pageSize || 10);
  const current = Number(query.current || 1);

  const results = await db.user.findMany({ orderBy: { createdAt: 'desc' } });
  const total = await db.user.count();

  results.forEach((r) => {
    r.github = JSON.parse(r.github);
  });

  return { results, total, current, pageSize } as any;
}

export async function api_get_user_unread_msg(userId: number) {
  const list = await db.msg.findMany({ where: { userId } });
  const posts = await db.post.findMany({ where: { OR: list.map((l) => ({ id: l.postId })) } });

  return list.map((l) => {
    const target = posts.find((p) => p.id === l.postId);
    return { ...l, title: target?.title };
  });
}

export async function api_remove_unread(data: any) {
  return db.msg.deleteMany({ where: { postId: data.postId, userId: data.userId } });
}
