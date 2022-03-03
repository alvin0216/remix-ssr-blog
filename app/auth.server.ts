import { createCookieSessionStorage } from 'remix';
import { Authenticator } from 'remix-auth';
import { GitHubStrategy } from 'remix-auth-github';
import config from '~/config.json';

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
        // 更新或创建！
        await db.user.upsert({
          where: { id: profile._json.id },
          update: {
            username: profile.displayName,
            github: JSON.stringify(profile._json),
          },
          create: {
            username: profile.displayName,
            github: JSON.stringify(profile._json),
            id: profile._json.id,
          },
        });
      }
      return { profile, accessToken, extraParams };
    }
  )
);

export async function getUserProfile(request: Request) {
  const data = await auth.isAuthenticated(request);
  return { user: data?.profile._json, isMaster: config.githubLoginName === data?.profile?._json.login };
}

/**
 * 用户是否登录 返回用户资料
 */
export async function checkUserProfile(request: Request) {
  const data = await auth.isAuthenticated(request);
  if (!data) {
    throw new Error('用户授权已失效！');
  }
  return { user: data?.profile._json, isMaster: config.githubLoginName === data?.profile?._json.login };
}
