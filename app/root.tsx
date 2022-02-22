import { Spin } from 'antd';
import antdStyles from 'antd/dist/antd.css';
import { useEffect } from 'react';
import {
    ActionFunction, Form, json, Links, LiveReload, Meta, Outlet, redirect, Scripts,
    ScrollRestoration, useLoaderData, useLocation, useTransition
} from 'remix';
import { auth, sessionStorage } from '~/auth.server';
import config from '~/config.json';

import Layout from './components/Layout/Layout';
import useMount from './hooks/useMount';
import { api_get_tags } from './routes/api/cate';
import globalStyles from './styles/global.css';
import mdStyles from './styles/md.css';
import unoStyles from './styles/uno.css';
import { parseFormData, tagColorList } from './utils';

import type { GitHubProfile } from 'remix-auth-github';
import type { LoaderFunction } from 'remix';
import type { MetaFunction } from 'remix';
export function links() {
  return [
    { rel: 'stylesheet', href: mdStyles },
    { rel: 'stylesheet', href: unoStyles },
    { rel: 'stylesheet', href: antdStyles },
    { rel: 'stylesheet', href: globalStyles },
  ];
}

export const meta: MetaFunction = () => {
  return { title: 'New Remix App' };
};

type LoaderData = { profile: GitHubProfile };

export const loader: LoaderFunction = async ({ request }): Promise<GlobalContext> => {
  const data = await auth.isAuthenticated(request);
  const tagList = await api_get_tags();

  const tagColor = tagList.reduce((map, item, index) => {
    map[item.name] = tagColorList[index] || tagColorList[Math.floor(Math.random() * 10)];
    return map;
  }, {} as any);

  return {
    loginInfo: data?.profile._json,
    isMaster: config.githubLoginName === data?.profile?._json.login,
    tagList,
    tagColor,
  };
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await parseFormData(request);
  console.log('trigger root action: ', form);
  if (form.actionType === 'loginout') return auth.logout(request, { redirectTo: form.redirectUrl });
};

export default function App() {
  const context = useLoaderData<GlobalContext>();
  const transition = useTransition();

  // result
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        <Layout context={context}>
          <Spin tip='Loading...' spinning={transition.state === 'loading'}>
            <Outlet context={context} />
          </Spin>
        </Layout>

        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
}
