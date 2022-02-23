import { Avatar, Dropdown, Menu } from 'antd';
import { useNavigate } from 'remix';
import useRemixFormSubmit from '~/hooks/useRemixFormSubmit';

import { AppstoreOutlined, GithubOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';

interface AvatarActionProps {
  context?: GlobalContext;
}

const AvatarAction: React.FC<AvatarActionProps> = (props) => {
  const submit = useRemixFormSubmit();
  const naviagate = useNavigate();
  const context = props.context;

  const menu = (
    <Menu
      onClick={(e) => {
        // 在 root action 被执行
        if (e.key === 'loginout') submit(undefined, { actionType: 'loginout' });
        else if (e.key === 'login') submit('/auth/github');
        else if (e.key === 'admin') naviagate('/admin');
      }}>
      {context?.isMaster && (
        <Menu.Item key='admin'>
          <AppstoreOutlined className='mr-8px' />
          文章管理
        </Menu.Item>
      )}

      {!context?.loginInfo && (
        <Menu.Item key='login'>
          <GithubOutlined className='mr-8px' />
          github login
        </Menu.Item>
      )}
      {context?.loginInfo && (
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
        <Avatar icon={<UserOutlined />} src={context?.loginInfo?.avatar_url} />
      </Dropdown>
    </div>
  );
};

export default AvatarAction;
