import { Button, Result } from 'antd';
import { Link } from 'remix';

export default function PermissionPage() {
  return (
    <div className='flex justify-center flex-1'>
      <Result
        status='404'
        title='401'
        subTitle='对不起，您无权限进行此操作！'
        extra={
          <Link to='/'>
            <Button type='primary'>返回主页</Button>
          </Link>
        }
      />
    </div>
  );
}
