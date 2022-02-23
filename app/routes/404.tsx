import { Button, Result } from 'antd';
import { Link } from 'remix';

export default function NotFoundPage() {
  return (
    <div className='flex justify-center flex-1'>
      <Result
        status='404'
        title='404'
        subTitle='Sorry, the page you visited does not exist.'
        extra={
          <Link to='/'>
            <Button type='primary'>Back Home</Button>
          </Link>
        }
      />
    </div>
  );
}
