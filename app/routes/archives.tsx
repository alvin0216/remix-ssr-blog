import { Timeline } from 'antd';
import dayjs from 'dayjs';
import { Link, LoaderFunction, useLoaderData } from 'remix';
import { PostListItem } from '~/export.types';
import { groupBy, parseUrl } from '~/utils';

import { ClockCircleOutlined } from '@ant-design/icons';

import { api_get_posts } from './api/posts';

export const loader: LoaderFunction = async ({ request }) => {
  const query = parseUrl(request.url);

  const data = await api_get_posts({ ...query, onlyPosts: true });

  return { data, query };
};

interface LoaderData {
  data: Page<PostListItem>;
  query: any;
}

export default function ArchivesPage() {
  const { data } = useLoaderData<LoaderData>();

  // @ts-ignore
  const list: PostListItem[][] = groupBy(data.results, (item) => item.createdAt.slice(0, 4)); // 按年份排序

  return (
    <div className='w-full flex justify-center mt-10px'>
      <Timeline>
        {list.map((d, i) => (
          <>
            {i === 0 && (
              <Timeline.Item>
                <span key={i} className='font-bold'>{`Nice! ${data.total} posts in total. Keep on posting...`}</span>
                <br />
                <br />
              </Timeline.Item>
            )}

            <Timeline.Item key={i} dot={<ClockCircleOutlined />} color='red'>
              <div className='text-22px font-semibold relative -top-4px'>{dayjs(d[0]['createdAt']).format('YYYY')}</div>
              <br />
            </Timeline.Item>

            {d.map((item) => (
              <Timeline.Item key={item.id}>
                <span className='text-13px mr-16px'>{dayjs(item.createdAt).format('MM-DD')}</span>
                <Link to={`/posts/${item.id}`}>{item.title}</Link>
              </Timeline.Item>
            ))}
          </>
        ))}
      </Timeline>
    </div>
  );
}
