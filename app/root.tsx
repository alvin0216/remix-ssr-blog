import { Button, Result, Spin } from 'antd';
import antdStyles from 'antd/dist/antd.css';
import { useEffect, useState } from 'react';
import {
    ActionFunction, Form, json, Link, Links, LiveReload, Meta, Outlet, redirect, Scripts,
    ScrollRestoration, useLoaderData, useLocation, useTransition
} from 'remix';
import { auth, getUserProfile, sessionStorage } from '~/auth.server';
import config from '~/config.json';

import Layout from './components/Layout/Layout';
import { api_get_tags } from './routes/api/cate';
import { api_get_user_unread_msg } from './routes/api/user';
import globalStyles from './styles/global.css';
import mdStyles from './styles/md.css';
import unoStyles from './styles/uno.css';
import { parseFormData, tagColorList } from './utils';

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

export const meta: MetaFunction = ({ location, parentsData }) => {
  const title = config?.seo?.title || config.blogName;
  const description = config?.seo?.description;
  return {
    ...config.seo,
    title,
    'og:title': title,
    'twitter:title': title,
    description,
    'og:description': description,
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const { user, isMaster } = await getUserProfile(request);
  const tagList = await api_get_tags();

  const tagColor = tagList.reduce((map, item, index) => {
    map[item.name] = tagColorList[index] || tagColorList[Math.floor(Math.random() * 10)];
    return map;
  }, {} as any);

  let unReadList: UnReadItem[] = [];
  if (user) {
    unReadList = await api_get_user_unread_msg(user.id);
  }

  return {
    user,
    isMaster,
    tagList,
    tagColor,
    unReadList,
  };
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await parseFormData(request);
  console.log('trigger root action: ', form);
  if (form.actionType === 'loginout') return auth.logout(request, { redirectTo: form.redirectUrl });
};

export default function App() {
  const loaderData = useLoaderData<GlobalContext>();
  const transition = useTransition();

  const [unReadList, setUnReadList] = useState(loaderData.unReadList);
  const context = {
    ...loaderData,
    unReadList,
    setUnReadList,
  };

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

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        <Layout>
          <Result
            status='warning'
            title='There are some problems with your operation.'
            extra={
              <Link to='/'>
                <Button type='primary'>Back Home</Button>
              </Link>
            }
          />
        </Layout>

        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
}
