import { Avatar, Badge, Dropdown, Menu, Modal } from 'antd';
import { useEffect } from 'react';
import { Link, useNavigate } from 'remix';
import useModal from '~/hooks/useModal';
import useRemixFormSubmit from '~/hooks/useRemixFormSubmit';

import {
    AppstoreOutlined, GithubOutlined, LogoutOutlined, NotificationOutlined, UserOutlined
} from '@ant-design/icons';

// import UnReadNoticeModal from '../UnReadNoticeModal/UnReadNoticeModal';

interface AvatarActionProps {
  context?: GlobalContext;
}

const AvatarAction: React.FC<AvatarActionProps> = (props) => {
  const submit = useRemixFormSubmit();
  const naviagate = useNavigate();
  const context = props.context;

  const unReadList = context?.unReadList || [];

  const { modalProps, show, close } = useModal(unReadList.length > 0);

  const menu = (
    <Menu
      onClick={(e) => {
        // 在 root action 被执行
        if (e.key === 'loginout') submit(undefined, { actionType: 'loginout' });
        else if (e.key === 'login') submit('/auth/github');
        else if (e.key === 'admin') naviagate('/admin');
        else if (e.key === 'unread') show();
      }}>
      {unReadList.length > 0 && (
        <Menu.Item key='unread'>
          <NotificationOutlined className='mr-8px' />
          未读消息
          {/* <Modal {...modalProps} onOk={close}></Modal> */}
        </Menu.Item>
      )}

      {context?.isMaster && (
        <Menu.Item key='admin'>
          <AppstoreOutlined className='mr-8px' />
          文章管理
        </Menu.Item>
      )}

      {!context?.user && (
        <Menu.Item key='login'>
          <GithubOutlined className='mr-8px' />
          github login
        </Menu.Item>
      )}
      {context?.user && (
        <Menu.Item key='loginout'>
          <LogoutOutlined className='mr-8px' />
          退出登录
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <div className='lh-64px px-12px'>
      <Dropdown overlay={menu}>
        <Badge count={unReadList?.length} size='small'>
          <Avatar icon={<UserOutlined />} src={context?.user?.avatar_url} />
        </Badge>
      </Dropdown>
      <Modal
        {...modalProps}
        onOk={close}
        title={
          <>
            <NotificationOutlined className='mr-8px' />
            您的留言收到回复啦！点击快速查看～
          </>
        }>
        <ul>
          {unReadList.map((item) => (
            <li key={item.id}>
              <Link
                to={`/posts/${item.postId}`}
                onClick={() => {
                  context?.setUnReadList(unReadList.filter((u) => u.id !== item.id));
                  close();
                }}>
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
};

export default AvatarAction;
