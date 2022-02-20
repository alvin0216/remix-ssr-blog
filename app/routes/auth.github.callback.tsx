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

  // if (res?.profile) {
  //   const user = await db.user.findUnique({ where: { id: res.profile.id } });
  //   console.log(321321, user);
  //   if (!user) {
  //     db.user
  //       .create({
  //         data: {
  //           username: res.profile.displayName,
  //           github: JSON.stringify(res.profile._json),
  //           id: res.profile.id,
  //         },
  //       })
  //       .catch((e) => {
  //         console.log('error', e);
  //       });
  //   }
  // }
};
