import { Badge, Pagination, Space, Tag, Timeline } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Link, Links, LoaderFunction, useLoaderData, useNavigate, useOutletContext } from 'remix';
import TagCate from '~/components/TagCate/TagCate';
import { CateListItem, PostListItem } from '~/export.types';
import { colorList, groupBy, parseUrl, queryToUrl } from '~/utils';
import { db } from '~/utils/db.server';

import { CalendarOutlined } from '@ant-design/icons';

import { api_get_cates } from './api/cate';
import { api_get_posts } from './api/posts';

export const loader: LoaderFunction = async ({ request }) => {
  const query = parseUrl(request.url);
  const cateList = await api_get_cates();
  const data = await api_get_posts({ ...query });
  const total = await db.post.count();

  return { cateList, query, total, data };
};

interface LoaderData {
  cateList: CateListItem[];
  data: Page<PostListItem>;
  query: any;
  total: number;
}

export default function CatePage() {
  const naviagate = useNavigate();
  const context = useOutletContext<GlobalContext>();

  const { cateList, query, total, data } = useLoaderData<LoaderData>();
  const [viewWidth, setViewWidth] = useState(1440);
  const cList = [{ _count: 0, name: '全部' }, ...cateList];

  const handlePageChange = (current: number, pageSize: number) => {
    naviagate(queryToUrl({ ...query, current, pageSize }));
  };

  useEffect(() => {
    setViewWidth(document.documentElement.clientWidth);
  }, []);

  return (
    <div>
      <div className='max-w-860px pt-5 m-auto'>
        <Space className='w-full justify-center'>
          {cList.map((c, cIndex) => (
            <Badge count={c._count} key={c.name} size='small' offset={[-6, 0]}>
              <Link to={cIndex === 0 ? '' : queryToUrl({ ...query, cate: c.name, current: 1 })}>
                <Tag
                  className={`transform motion-safe:hover:scale-120 ${
                    query.cate === c.name || (cIndex === 0 && !query.cate) ? 'scale-120' : ''
                  }`}
                  color={colorList[cIndex] || colorList[Math.floor(Math.random() * 10)]}>
                  {c.name}
                </Tag>
              </Link>
            </Badge>
          ))}
        </Space>
        <ul>
          {data.results.map((item) => (
            <li key={item.id} className='rounded-md transition my-24px px-20px py-16px list-shadow'>
              <Link to={`/posts/${item.id}`} className='block text-1.28rem font-bold lh-46px text-#555'>
                {item.title}
              </Link>
              <CalendarOutlined />
              &nbsp;<span>{dayjs(item.createdAt).format('YYYY-MM-DD')}</span>
              <TagCate tag={item.tag} cate={item.cate} tagColor={context.tagColor} />
            </li>
          ))}
        </ul>
        <Pagination
          className='text-center'
          hideOnSinglePage
          current={data.current}
          pageSize={data.pageSize}
          total={data.total}
          onChange={handlePageChange}
          simple={viewWidth <= 736}
        />
      </div>
    </div>
  );
}
