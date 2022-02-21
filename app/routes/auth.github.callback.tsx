import { LoaderFunction, redirect } from 'remix';
import { auth, sessionStorage } from '~/auth.server';
import { db } from '~/utils/db.server';

export const loader: LoaderFunction = async ({ request, params, context }) => {
  const session = await sessionStorage.getSession(request.headers.get('Cookie'));
  const data = await auth.isAuthenticated(request);

  const res = await auth.authenticate('github', request, {
    successRedirect: '/',
    failureRedirect: '/',
  });
};
