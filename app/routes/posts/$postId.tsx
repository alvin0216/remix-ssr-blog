import { Anchor, Divider } from 'antd';
import dayjs from 'dayjs';
import { LoaderFunction, MetaFunction, redirect, useLoaderData, useOutletContext } from 'remix';
import { getUserProfile } from '~/auth.server';
import Discuss from '~/components/Discuss/Discuss';
import TagCate from '~/components/TagCate/TagCate';
import config from '~/config.json';
import { PostListItem } from '~/export.types';
import {
    getDiscussCount, getHashList, HashListItem, parseFormData, parseUrl, translateMd
} from '~/utils';
import { db } from '~/utils/db.server';

import { CalendarOutlined } from '@ant-design/icons';

import NotFoundPage from '../404';
import { api_get_post_by_id } from '../api/posts';

export const loader: LoaderFunction = async ({ request, params }) => {
  if (params.postId === '1024') return redirect('/about');
  const { user } = await getUserProfile(request);
  if (user) {
    db.msg.deleteMany({ where: { postId: params.postId, userId: user.id } });
  }
  const data = await api_get_post_by_id(params.postId || '');
  if (!data) return redirect('/404');
  data.content = translateMd(data.content);
  return { data, postId: params.postId, hashList: data?.content ? getHashList(data.content) : [] };
};

export const meta: MetaFunction = ({ data }) => {
  const loaderData = data as LoaderData;
  const configKeyword = Array.isArray(config.seo.keywords) ? config.seo.keywords : [config.seo.keywords];
  const keywords = [...configKeyword, loaderData.data.tag.map((t) => t.name).join(', ')].filter(Boolean);
  const title = [data?.data?.title, config.seo?.title].filter(Boolean).join(' | ');

  return { title, 'og:title': title, 'twitter:title': title, keywords };
};

interface LoaderData {
  data: PostListItem;
  postId: string;
  hashList: HashListItem[];
}

export default function PostPage() {
  const { data, postId, hashList } = useLoaderData<LoaderData>();
  const context = useOutletContext<GlobalContext>();
  const count = getDiscussCount(data.comment);

  const renderHashLink = (hashList: HashListItem[]) => {
    return hashList.map((h) => (
      <Anchor.Link key={h.href} href={h.href} title={h.title} className='anchor'>
        {h.children?.length > 0 && renderHashLink(h.children)}
      </Anchor.Link>
    ));
  };

  return (
    <div className='pb-20px flex'>
      <div className='flex-1 pr-20px overflow-x-hidden'>
        <div className='text-center mb-20px pb-20px' style={{ borderBottom: '1px solid #e8e8e8' }}>
          <h1 className='color-#0d1a26 text-1.7em'>{data.title}</h1>

          <div>
            <CalendarOutlined /> &nbsp; Posted on &nbsp;<span>{dayjs(data.createdAt).format('YYYY-MM-DD')}</span>
            <TagCate tag={data.tag} cate={data.cate} tagColor={context.tagColor} />
            <Divider type='vertical' />
            <span>
              <img
                alt='comment'
                className='wh-14 mr-4px'
                src='https://alvin-cdn.oss-cn-shenzhen.aliyuncs.com/images/comment.png'
              />
              {count}
            </span>
            <span className='ml-8px'>
              <img
                alt='viewCount'
                className='wh-14 mr-4px -translate-y-1px'
                src='https://alvin-cdn.oss-cn-shenzhen.aliyuncs.com/images/view.png'
              />
              <span>{data.view}</span>
            </span>
          </div>
        </div>

        <div className='article' dangerouslySetInnerHTML={{ __html: data.content }} />

        <Discuss comment={data.comment} context={context} postId={postId} />
      </div>
      <Anchor
        className='w-275px'
        // @ts-ignore
        getContainer={() => {
          const dom = document.querySelector('.app-main');
          return dom;
        }}>
        {renderHashLink(hashList)}
      </Anchor>
      ,
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  // console.error(error);
  return <NotFoundPage />;
}
