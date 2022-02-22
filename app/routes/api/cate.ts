import { ActionFunction, createCookie, redirect } from 'remix';
import { parseFormData } from '~/utils';
import { db } from '~/utils/db.server';

import { Category, Post, Tag } from '@prisma/client';

export const action: ActionFunction = async ({ request }) => {
  const query = await parseFormData(request);
  return api_get_cates();
};

export function api_get_cates() {
  return db.category.groupBy({ by: ['name'], _count: true });
}

export function api_get_tags() {
  return db.tag.groupBy({ by: ['name'], _count: true });
}
