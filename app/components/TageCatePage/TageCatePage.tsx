import { Badge, Pagination, Space, Tag, Timeline } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Link, Links, LoaderFunction, useLoaderData, useNavigate, useOutletContext } from 'remix';
import TagCate from '~/components/TagCate/TagCate';
import { PostListItem } from '~/export.types';
import { colorList, groupBy, parseUrl, queryToUrl } from '~/utils';
import { db } from '~/utils/db.server';

import { CalendarOutlined } from '@ant-design/icons';

interface TageCatePageProps {
  context: GlobalContext;
  cateList: CateListItem[];
  data: Page<PostListItem>;
  query: any;
  type: 'cate' | 'tag';
}

const TageCatePage: React.FC<TageCatePageProps> = (props) => {
  const naviagate = useNavigate();
  const { context, cateList, query, data, type } = props;

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
        <Space className='w-full justify-center' wrap>
          {cList.map((c, cIndex) => {
            let to =
              cIndex === 0
                ? ''
                : queryToUrl({
                    ...query,
                    cate: type === 'cate' ? c.name : undefined,
                    tag: type === 'tag' ? c.name : undefined,
                    current: 1,
                  });
            if (cIndex === 0) to = '';

            let color =
              type === 'tag'
                ? context.tagColor[c.name] || '#3b5999'
                : colorList[cIndex] || colorList[Math.floor(Math.random() * 10)];

            const qName = query.cate || query.tag;

            return (
              <Badge count={c._count} key={c.name} size='small' offset={[-6, 0]}>
                <Link to={to}>
                  <Tag
                    className={`transform motion-safe:hover:scale-120 ${
                      qName === c.name || (cIndex === 0 && !qName) ? 'scale-120' : ''
                    }`}
                    color={color}>
                    {c.name}
                  </Tag>
                </Link>
              </Badge>
            );
          })}
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
};

export default TageCatePage;
