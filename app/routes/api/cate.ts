import { ActionFunction, createCookie, redirect } from 'remix';
import { DiscussListItem } from '~/components/Discuss/Discuss';
import { parseFormData } from '~/utils';
import { db } from '~/utils/db.server';

import { Category, Post, Tag } from '@prisma/client';

export const action: ActionFunction = async ({ request }) => {
  const query = await parseFormData(request);
  return api_get_cates(query);
};

export function api_get_cates(query: any) {
  return db.category.groupBy({
    by: ['name'],
    _count: true,
  });
}
