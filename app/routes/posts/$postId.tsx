import { Divider } from 'antd';
import { ActionFunction, LoaderFunction, useLoaderData, useOutletContext } from 'remix';
import { api_add_comment, api_add_reply, api_remove_comment, api_remove_reply } from '~/api.server';
import Discuss, { DiscussListItem } from '~/components/Discuss/Discuss';
import TagCate from '~/components/TagCate/TagCate';
import { getDiscussCount, parseFormData, translateMd } from '~/utils';
import { db } from '~/utils/db.server';

import { CalendarOutlined } from '@ant-design/icons';
import { Category, Comment, Post, Reply, Tag, User } from '@prisma/client';

export const loader: LoaderFunction = async ({ request, params }) => {
  const data = await db.post.findUnique({
    where: { id: params.postId },
    include: {
      tag: true,
      cate: true,
      comment: {
        include: {
          reply: {
            include: { user: true },
            orderBy: { createdAt: 'asc' },
          },
          user: true,
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
  if (data) {
    data.content = translateMd(data.content);
  }
  return { data, postId: params.postId };
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
  data: Post & {
    tag: Tag[];
    cate: Category[];
    comment: DiscussListItem[];
  };
  postId: string;
}

const PostPage: React.FC = (props) => {
  const { data, postId } = useLoaderData<LoaderData>();
  const count = getDiscussCount(data.comment);
  const context = useOutletContext<GlobalContext>();

  return (
    <div className='xl:pr-275px pb-20px'>
      <div className='text-center mb-20px pb-20px ' style={{ borderBottom: '1px solid #e8e8e8' }}>
        <h1 className='color-#0d1a26 text-1.7em'>{data.title}</h1>

        <div>
          <CalendarOutlined /> &nbsp; Posted on &nbsp;<span>{'2022-02-01'}</span>
          <TagCate tag={data.tag} cate={data.cate} />
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
  );
};

export default PostPage;
