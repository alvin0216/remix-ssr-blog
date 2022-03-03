import {
    Badge, Button, Form, Input, Modal, Popconfirm, Popover, Select, Space, Table, Tag, Upload
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import config from '~/config.json';
import { UserInfo } from '~/export.types';
import useModal from '~/hooks/useModal';
import useRemixFetcherSubmit from '~/hooks/useRemixFetcherSubmit';

import { User } from '@prisma/client';

interface UserManagerProps {}

const UserManager: React.FC<UserManagerProps> = (props) => {
  const { submit, fetcher } = useRemixFetcherSubmit();
  const { modalProps, show, close } = useModal();

  const [githubInfo, setGithubInfo] = useState<GithubInfo | null>(null);

  const loadList = async (values?: any) => {
    submit('/api/user', { actionType: 'api_get_users', ...values });
  };

  useEffect(() => {
    loadList();
  }, []);

  return (
    <>
      <Table<UserInfo>
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
            loadList({ current, pageSize });
          },
          showTotal: (total) => `Total ${total} items`,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        columns={[
          {
            dataIndex: 'username',
            title: '用户名',
            ellipsis: true,
            render: (text, record) => (
              <a
                className='text-#555'
                target='_blank'
                rel='noreferrer noopener'
                href={`https://github.com/${record?.github.login}`}>
                {record.github.login === config.githubLoginName && (
                  <Tag className='mr-2' color='#108ee9'>
                    Master
                  </Tag>
                )}
                {text}
              </a>
            ),
          },
          {
            dataIndex: 'username',
            title: '昵称',
            ellipsis: true,
            render: (text, record) => record.github.name,
          },
          {
            dataIndex: 'email',
            title: 'email',
            render: (text, record) => record.github.email,
          },
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
                <Button
                  type='primary'
                  size='small'
                  onClick={() => {
                    setGithubInfo(record.github);
                    show();
                  }}>
                  用户信息
                </Button>
              </Space>
            ),
          },
        ]}
      />
      <Modal {...modalProps} title={githubInfo?.login} width={800}>
        <pre>{JSON.stringify(githubInfo, null, 2)}</pre>
      </Modal>
    </>
  );
};

export default UserManager;
