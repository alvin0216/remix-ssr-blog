import { Button, Form, Input, Popconfirm, Select, Space, Table, Tag, Upload } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useRef } from 'react';
import { Link, useFetcher } from 'remix';
import { PostListItem } from '~/export.types';
import useRemixFormSubmit from '~/hooks/useRemixFormSubmit';
import { getDiscussCount } from '~/utils';

import UploadModal, { UploadModalRef } from './UploadModal';

interface PostManagerProps {
  context: GlobalContext;
  cateList: CateListItem[];
}

const PostManager: React.FC<PostManagerProps> = (props) => {
  const { context, cateList } = props;
  const submit = useRemixFormSubmit();
  const fetcher = useFetcher<Page<PostListItem>>();

  const [form] = Form.useForm();
  const uploadModalRef = useRef<UploadModalRef>(null);

  const loadList = async (values?: any) => {
    console.log('query', values);
    fetcher.submit({ actionType: 'api_get_posts', ...values }, { action: '/api/posts', method: 'post' });
  };

  useEffect(() => {
    loadList();
  }, []);

  const handleDelete = (postId: string) => {
    submit('/api/posts', { actionType: 'api_delete_post', postId });
  };

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
        <Form.Item label='分类' name='cate'>
          <Select
            className='!w-180px'
            allowClear
            placeholder='请选择分类'
            options={cateList.map((t) => ({ value: t.name, label: t.name }))}
          />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button
              onClick={() => {
                form.resetFields();
                form.submit();
              }}>
              重置
            </Button>
            <Button type='primary' title='可导入 md 类型的文档' onClick={() => uploadModalRef.current?.show()}>
              导入文章
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
          {
            dataIndex: 'title',
            title: '标题',
            ellipsis: true,
            render: (text, record) => (
              <Link className='text-#555' to={`/posts/${record.id}`}>
                {text}
              </Link>
            ),
          },
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
          {
            dataIndex: 'comment',
            title: '评论数',
            render: (text, record) => getDiscussCount(record.comment),
            sorter: (a, b) => getDiscussCount(a.comment) - getDiscussCount(b.comment),
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
            title: '更新时间',
            render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
            ellipsis: true,
          },
          {
            title: '操作',
            key: 'operation',
            fixed: 'right',
            width: 100,
            render: (text, record) => (
              <Space>
                <Popconfirm
                  placement='left'
                  title='Are you sure to delete this post?'
                  onConfirm={() => handleDelete(record.id)}>
                  <Button type='text' danger>
                    删除
                  </Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />
      <UploadModal innerRef={uploadModalRef} />
    </>
  );
};

export default PostManager;
