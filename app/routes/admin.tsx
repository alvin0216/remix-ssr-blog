import { Button, Form, Input, Select, Space, Table, Tag } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import {
    LoaderFunction, redirect, useActionData, useFetcher, useOutletContext, useSubmit
} from 'remix';
import { auth } from '~/auth.server';
import config from '~/config.json';
import { PostListItem } from '~/export.types';
import useRemixFormSubmit from '~/hooks/useRemixFormSubmit';

export const loader: LoaderFunction = async ({ request, context }) => {
  const data = await auth.isAuthenticated(request);
  const isMaster = config.githubLoginName === data?.profile?._json.login;
  if (!isMaster) return redirect('/401');

  const api_get_cates;

  return {};
};

interface LoaderData {}

export default function AdminPage() {
  const context = useOutletContext<GlobalContext>();
  const fetcher = useFetcher<Page<PostListItem>>();

  const [form] = Form.useForm();

  const loadList = async (values?: any) => {
    console.log('query', values);
    fetcher.submit({ actionType: '', ...values }, { action: '/api/posts', method: 'post' });
  };

  useEffect(() => {
    loadList();
  }, []);

  console.log(fetcher.data);

  return (
    <>
      <Form className='!mb-24px' layout='inline' form={form} onFinish={(values) => loadList(values)}>
        <Form.Item label='关键词' name='k'>
          <Input placeholder='请输入关键词' />
        </Form.Item>
        <Form.Item label='标签' name='tag'>
          <Select
            className='!w-180px'
            allowClear
            placeholder='请选择标签'
            options={context.tagList.map((t) => ({ value: t.name, label: t.name }))}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
          <Space>
            <Button
              onClick={() => {
                form.resetFields();
                form.submit();
              }}>
              重置
            </Button>
            <Button type='primary' htmlType='submit' loading={fetcher.state === 'loading'}>
              查询
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <Table<PostListItem>
        bordered
        dataSource={fetcher.data?.results}
        loading={fetcher.state === 'loading'}
        rowKey='id'
        scroll={{ x: 'max-content' }}
        pagination={{
          total: fetcher.data?.total,
          current: fetcher.data?.current,
          pageSize: fetcher.data?.pageSize,
          onChange: (current, pageSize) => {
            loadList({ current, pageSize, ...form.getFieldsValue() });
          },
          showTotal: (total) => `Total ${total} items`,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        columns={[
          { dataIndex: 'title', title: '标题', ellipsis: true },
          {
            dataIndex: 'tag',
            title: '标签',
            render: (text, record) => (
              <Space>
                {record.tag.map((t) => (
                  <Tag key={t.id} color={context?.tagColor[t.name]}>
                    {t.name}
                  </Tag>
                ))}
              </Space>
            ),
          },
          {
            dataIndex: 'cate',
            title: '分类',
            render: (text, record) => (
              <Space>
                {record.cate.map((t) => (
                  <Tag key={t.id} color='#2db7f5'>
                    {t.name}
                  </Tag>
                ))}
              </Space>
            ),
          },
          { dataIndex: 'view', title: '浏览次数' },
          {
            dataIndex: 'createdAt',
            title: '创建时间',
            render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
            ellipsis: true,
          },
          {
            dataIndex: 'updatedAt',
            title: '创建时间',
            render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
            ellipsis: true,
          },
        ]}
      />
    </>
  );
}
