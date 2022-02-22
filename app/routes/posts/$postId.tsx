import { Anchor, Divider } from 'antd';
import dayjs from 'dayjs';
import { ActionFunction, LoaderFunction, useLoaderData, useOutletContext } from 'remix';
import { api_add_comment, api_add_reply, api_remove_comment, api_remove_reply } from '~/api.server';
import Discuss from '~/components/Discuss/Discuss';
import TagCate from '~/components/TagCate/TagCate';
import { PostListItem } from '~/export.types';
import {
    getDiscussCount, getHashList, HashListItem, parseFormData, parseUrl, translateMd
} from '~/utils';

import { CalendarOutlined } from '@ant-design/icons';

import { api_get_post_by_id } from '../api/posts';

export const loader: LoaderFunction = async ({ request, params }) => {
  const data = await api_get_post_by_id(params.postId || '');
  if (data) {
    data.content = translateMd(data.content);
  }
  return { data, postId: params.postId, hashList: data?.content ? getHashList(data.content) : [] };
};

export const action: ActionFunction = async ({ request }) => {
  const form = await parseFormData<any>(request);
  if (form.actionType === 'api_add_comment') return api_add_comment(request, form);
  if (form.actionType === 'api_remove_comment') return api_remove_comment(request, form);
  if (form.actionType === 'api_add_reply') return api_add_reply(request, form);
  if (form.actionType === 'api_remove_reply') return api_remove_reply(request, form);
  return null;
};

interface LoaderData {
  data: PostListItem;
  postId: string;
  hashList: HashListItem[];
}

const PostPage: React.FC = (props) => {
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
      <div className='flex-1 pr-20px'>
        <div className='text-center mb-20px pb-20px' style={{ borderBottom: '1px solid #e8e8e8' }}>
          <h1 className='color-#0d1a26 text-1.7em'>{data.title}</h1>

          <div>
            <CalendarOutlined /> &nbsp; Posted on &nbsp;<span>{dayjs(data.createdAt).format('YYYY-MM-DD')}</span>
            <TagCate tag={data.tag} cate={data.cate} tagColor={context.tagColor} />
            <Divider type='vertical' />
            <span>
              <img className='wh-14 mr-4px' src='https://gitee.com/alvin0216/cdn/raw/master/images/comment.png' />
              {count}
            </span>
            <span className='ml-8px'>
              <img
                className='wh-14 mr-4px -translate-y-1px'
                src='https://gitee.com/alvin0216/cdn/raw/master/images/view.png'
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
};

export default PostPage;
