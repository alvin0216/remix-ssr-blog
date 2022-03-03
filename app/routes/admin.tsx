import { Button, Form, Input, Select, Space, Table, Tabs, Tag } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import {
    LoaderFunction, redirect, useActionData, useFetcher, useLoaderData, useOutletContext, useSubmit
} from 'remix';
import { auth } from '~/auth.server';
import PostManager from '~/components/Manager/PostManager';
import UserManager from '~/components/Manager/UserManager';
import config from '~/config.json';
import useRemixFormSubmit from '~/hooks/useRemixFormSubmit';

import { api_get_cates } from './api/cate';

export const loader: LoaderFunction = async ({ request, context }) => {
  const data = await auth.isAuthenticated(request);
  const isMaster = config.githubLoginName === data?.profile?._json.login;
  if (!isMaster) return redirect('/401');
  const cateList = await api_get_cates();
  return { cateList };
};

interface LoaderData {
  cateList: CateListItem[];
}

export default function AdminPage() {
  const context = useOutletContext<GlobalContext>();
  const { cateList } = useLoaderData<LoaderData>();

  return (
    <Tabs type='card'>
      <Tabs.TabPane tab='文章管理' key='1'>
        <PostManager context={context} cateList={cateList} />
      </Tabs.TabPane>
      <Tabs.TabPane tab='用户管理' key='2'>
        <UserManager />
      </Tabs.TabPane>
    </Tabs>
  );
}
