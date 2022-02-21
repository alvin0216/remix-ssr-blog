import { BackTop, Col, Row } from 'antd';
import useMount from '~/hooks/useMount';

import Aside from '../Aside/Aside';
import BHeader from '../Header/Header';

// 响应式
const siderLayout = { xxl: 4, xl: 5, lg: 5, sm: 0, xs: 0 };
const contentLayout = { xxl: 20, xl: 19, lg: 19, sm: 24, xs: 24 };

interface BLayoutProps {
  context: GlobalContext;
}

const BLayout: React.FC<BLayoutProps> = (props) => {
  return (
    <div>
      <BHeader context={props.context} />
      <Row className='pt-40px relative'>
        <Col {...siderLayout}>
          <Aside />
        </Col>
        <Col
          {...contentLayout}
          className='app-main pl-20px overflow-y-auto'
          style={{ height: 'calc(100vh - 64px - 40px)' }}>
          {props.children}
        </Col>
      </Row>
    </div>
  );
};

export default BLayout;