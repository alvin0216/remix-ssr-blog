import { ActionFunction, createCookie, redirect } from 'remix';
import { UserInfo } from '~/export.types';
import { parseFormData } from '~/utils';
import { db } from '~/utils/db.server';

import { Category, Post, Tag, User } from '@prisma/client';

export const action: ActionFunction = async ({ request }) => {
  const query = await parseFormData(request);
  const actionType = query.actionType;
  if (actionType === 'api_get_users') return api_get_users(query);
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
