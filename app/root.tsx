import { Spin } from 'antd';
import antdStyles from 'antd/dist/antd.css';
import {
    ActionFunction, Form, json, Links, LiveReload, Meta, Outlet, redirect, Scripts,
    ScrollRestoration, useLoaderData, useLocation, useTransition
} from 'remix';
import { auth, sessionStorage } from '~/auth.server';
import config from '~/config.json';

import Layout from './components/Layout/Layout';
import globalStyles from './styles/global.css';
import mdStyles from './styles/md.css';
import unoStyles from './styles/uno.css';
import { parseFormData } from './utils';

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

  return { loginInfo: data?.profile._json, isMaster: config.githubLoginName === data?.profile?._json.login };
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await parseFormData(request);

  console.log('trigger root action: ', form);

  if (form.actionType === 'loginout') return auth.logout(request, { redirectTo: form.redirectUrl });
};

export default function App() {
  const context = useLoaderData();
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
