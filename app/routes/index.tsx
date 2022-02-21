import { Button, Divider, Pagination, Result } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import {
    Link, LoaderFunction, useLoaderData, useLocation, useNavigate, useOutletContext
} from 'remix';
import TagCate from '~/components/TagCate/TagCate';
import { getDiscussCount, parseUrl, queryToUrl, translateMd } from '~/utils';

import { api_get_posts, PostListItem } from './api/posts';

export const loader: LoaderFunction = async ({ request }) => {
  const query = parseUrl(request.url);
  const data = await api_get_posts(query);

  data.results.forEach((item) => {
    item.content = translateMd(item.content.slice(0, 500));
  });

  return { data, query };
};

interface LoaderData {
  data: Page<PostListItem>;
  query: any;
}

export default function IndexPage() {
  const { data, query } = useLoaderData<LoaderData>();
  const naviagate = useNavigate();
  const [viewWidth, setViewWidth] = useState(1440);
  // result
  const context = useOutletContext<GlobalContext>();

  const handlePageChange = (current: number, pageSize: number) => {
    naviagate(`/?${queryToUrl({ ...query, current, pageSize })}`);
  };

  useEffect(() => {
    setViewWidth(document.documentElement.clientWidth);
  }, []);

  return (
    <div className='overflow-y-auto flex' style={{ height: 'calc(100vh - 64px - 40px)' }}>
      {query.k && data.total === 0 ? (
        <div className='flex justify-center flex-1'>
          <Result
            status='404'
            subTitle={
              <>
                对不起，未找到含有 <span className='text-red font-bold'>{query.k}</span> 关键词的文章！
              </>
            }
            extra={
              <Button type='primary' onClick={() => naviagate('/')}>
                返回主页
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <ul className='w-full xl:pr-292px'>
            {data.results.map((item) => {
              const count = getDiscussCount(item.comment);
              return (
                <li
                  key={item.id}
                  className='border-1 border-#ebedf0 px-24px py-16px mb-10px transition hover:bg-##effbff blog-list-item'>
                  <Divider orientation='left'>
                    <Link to={`/posts/${item.id}`} className='text-#394d69'>
                      <span className='font-semibold lh-1.2 cursor-pointer text-1.4rem'>{item.title}</span>
                    </Link>
                    <span className='text-.5em pl-20px'>{dayjs(item.createdAt).format('YYYY-MM-DD')}</span>
                  </Divider>

                  <div
                    onClick={(e) => naviagate(`/posts/${item.id}`)}
                    className='article max-h-260px overflow-hidden cursor-pointer'
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />

                  <div className='mt-10px' style={{ color: 'rgba(0,0,0,.45)' }}>
                    <span>
                      <img
                        className='wh-14 mr-4px'
                        src='https://gitee.com/alvin0216/cdn/raw/master/images/comment.png'
                      />
                      {count}
                    </span>
                    <span className='ml-8px'>
                      <img
                        className='wh-14 mr-4px -translate-y-1px'
                        src='https://gitee.com/alvin0216/cdn/raw/master/images/view.png'
                      />
                      <span>{item.view}</span>
                    </span>

                    <TagCate tag={item.tag} cate={item.cate} />
                  </div>
                </li>
              );
            })}
            <Pagination
              className='float-right'
              hideOnSinglePage
              current={data.current}
              pageSize={data.pageSize}
              total={data.total}
              onChange={handlePageChange}
              simple={viewWidth <= 736}
            />
          </ul>

          <div className='fixed top-90px right-20px w-260px'>
            <Divider>文章列表</Divider>
            <ul>
              {data.results.map((r) => (
                <li key={r.id} className='hover:bg-#f0f2f5'>
                  <Link to={`/posts/${r.id}`} className='block text-#8590a6 truncate' title={r.title}>
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
