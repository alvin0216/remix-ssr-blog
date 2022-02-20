import { Avatar, BackTop, Col, Dropdown, Input, Row } from 'antd';
import classnames from 'classnames';
import { Link, LoaderFunction, useLoaderData, useLocation, useNavigate } from 'remix';
import config from '~/config.json';
import { parseUrl, queryToUrl } from '~/utils';

import {
    FolderOutlined, FormOutlined, HomeOutlined, MenuOutlined, SearchOutlined, UserOutlined
} from '@ant-design/icons';

import AvatarAction from './AvatarAction';

// 响应式
const responsiveLeft = { xxl: 4, xl: 5, lg: 5, sm: 4, xs: 24 };
const responsiveRight = { xxl: 20, xl: 19, lg: 19, sm: 20, xs: 0 };

const navList = [
  { icon: <HomeOutlined />, title: '首页', link: '/' },
  { icon: <FormOutlined />, title: '归档', link: '/archives' },
  { icon: <FolderOutlined />, title: '分类', link: '/categories' },
  { icon: <UserOutlined />, title: '关于', link: '/about' },
];

interface BHeaderProps {
  context: GlobalContext;
}

const BHeader: React.FC<BHeaderProps> = (props) => {
  const naviagate = useNavigate();
  const { pathname, search } = useLocation();
  const query = parseUrl(search);

  const onSearch = (e: any) => {
    naviagate(`/?${queryToUrl({ current: 1, k: e.target.value || undefined })}`);
  };

  return (
    <div
      className='h-16 bg-white'
      style={{
        boxShadow: '0 2px 8px #f0f1f2',
      }}>
      <Row>
        <Col {...responsiveLeft} className='text-center lh-64px relative'>
          <img src={config.blogLogo} alt='logo' className='w-8 h-8' />
          <span className='text-20px pl-10px'>{config.blogName}</span>
        </Col>
        <Col {...responsiveRight}>
          <div className='w-full flex '>
            <div
              className='h-22px pl-16px lh-22px mt-22px flex-1 flex items-center'
              style={{ borderLeft: '1px solid rgb(235, 237, 240)' }}>
              <SearchOutlined className='cursor-pointer' style={{ color: '#ced4d9' }} />
              <Input
                bordered={false}
                type='text'
                className='w-200px'
                placeholder='搜索文章'
                defaultValue={query.k}
                onPressEnter={onSearch}
                onBlur={onSearch}
              />
            </div>
            <div>
              {navList.map((nav) => (
                <Link
                  to={nav.link}
                  key={nav.link}
                  className={classnames(
                    'inline-block w-92px lh-64px  text-center border-t-2 border-transparent hover:border-t-#1890ff hover:text-#1890ff',
                    pathname === nav.link ? 'border-t-#1890ff text-#1890ff' : 'text-#000000d8'
                  )}>
                  {nav.icon}
                  <span className='pl-10px'>{nav.title}</span>
                </Link>
              ))}
            </div>

            <AvatarAction context={props.context} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default BHeader;
