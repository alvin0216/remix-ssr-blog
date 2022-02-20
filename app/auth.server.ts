import { createCookieSessionStorage } from 'remix';
import { Authenticator } from 'remix-auth';
import { GitHubStrategy } from 'remix-auth-github';

import { db } from './utils/db.server';

import type { GitHubExtraParams, GitHubProfile } from 'remix-auth-github';
if (!process.env.GITHUB_CLIENT_ID) {
  throw new Error('GITHUB_CLIENT_ID is required');
}

if (!process.env.GITHUB_CLIENT_SECRET) {
  throw new Error('GITHUB_CLIENT_SECRET is required');
}

if (!process.env.GITHUB_CALLBACK_URL) {
  throw new Error('GITHUB_CALLBACK_URL is required');
}

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: ['s3cret'], // This should be an env variable
    secure: process.env.NODE_ENV === 'production',
  },
});

export const auth = new Authenticator<{
  profile: GitHubProfile;
  accessToken: string;
  extraParams: GitHubExtraParams;
}>(sessionStorage);

auth.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: new URL('/auth/github/callback', process.env.GITHUB_CALLBACK_URL).toString(),
    },
    async ({ profile, accessToken, extraParams }) => {
      if (profile) {
        const user = await db.user.findUnique({ where: { id: profile.id } });
        if (!user) {
          db.user
            .create({
              data: {
                username: profile.displayName,
                github: JSON.stringify(profile._json),
                id: profile.id,
              },
            })
            .catch((e) => {
              console.log('error', e);
            });
        }
      }
      return { profile, accessToken, extraParams };
    }
  )
);

export async function getUserProfile(request: Request) {
  const data = await auth.isAuthenticated(request);
  if (!data) {
    throw new Error('用户授权已失效！');
  }
  return data.profile;
}
