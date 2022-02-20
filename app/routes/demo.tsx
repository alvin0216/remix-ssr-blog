import { ActionFunction, redirect } from 'remix';
import { auth } from '~/auth.server';
import { db } from '~/utils/db.server';

export const action: ActionFunction = async ({ request }) => {
  const data = await auth.isAuthenticated(request);
  const form = await request.formData();

  const redirectUrl = form.get('redirectUrl') as string;

  return redirect(redirectUrl || request.url);
};
