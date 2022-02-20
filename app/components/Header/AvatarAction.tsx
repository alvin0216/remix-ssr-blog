import { Avatar, Dropdown, Menu, Modal } from 'antd';
import useModal from '~/hooks/useModal';
import useRemixFormSubmit from '~/hooks/useRemixFormSubmit';

import { GithubOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';

import Manager from '../Manager/Manager';

interface AvatarActionProps {
  context: GlobalContext;
}

const AvatarAction: React.FC<AvatarActionProps> = (props) => {
  const submit = useRemixFormSubmit();
  const context = props.context;

  const { modalProps, show } = useModal();

  const menu = (
    <Menu
      onClick={(e) => {
        // 在 root action 被执行
        if (e.key === 'loginout') submit(undefined, { actionType: 'loginout' });
        else if (e.key === 'login') submit('/auth/github');
        else if (e.key === 'manager') show();
      }}>
      {context.isMaster && (
        <Menu.Item key='manager'>
          <GithubOutlined className='mr-8px' />
          文章管理
        </Menu.Item>
      )}

      {!context.loginInfo && (
        <Menu.Item key='login'>
          <GithubOutlined className='mr-8px' />
          github login
        </Menu.Item>
      )}
      {context.loginInfo && (
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
        <Avatar icon={<UserOutlined />} src={context.loginInfo?.avatar_url} />
      </Dropdown>
      <Modal {...modalProps} title='文章管理' footer={false} width={850}>
        <Manager />
      </Modal>
    </div>
  );
};

export default AvatarAction;
