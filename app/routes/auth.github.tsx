import { ActionFunction, createCookie, redirect } from 'remix';
import { auth, sessionStorage } from '~/auth.server';
import { db } from '~/utils/db.server';

export const action: ActionFunction = async ({ request }) => {
  const from = await request.formData();
  const redirectUrl = from.get('url')?.toString() || '/';

  return auth.authenticate('github', request, {
    successRedirect: redirectUrl,
    failureRedirect: '/',
    context: { redirectUrl },
  });
};
