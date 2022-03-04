import { LoaderFunction, useLoaderData, useOutletContext } from 'remix';
import { getUserProfile } from '~/auth.server';
import Discuss from '~/components/Discuss/Discuss';
import { PostListItem } from '~/export.types';
import { getDiscussCount } from '~/utils';
import { db } from '~/utils/db.server';

import { api_get_post_by_id } from './api/posts';

export const loader: LoaderFunction = async ({ request, params }) => {
  const data = await api_get_post_by_id('1024');
  const { user } = await getUserProfile(request);
  if (user) {
    await db.msg.deleteMany({ where: { postId: '1024' } });
  }
  return { data, postId: '1024' };
};

interface LoaderData {
  data: PostListItem;
  postId: string;
}

const AboutPage: React.FC = (props) => {
  const { data, postId } = useLoaderData<LoaderData>();
  const context = useOutletContext<GlobalContext>();

  return (
    <>
      <h3>To do list {'&'} 后续</h3>
      <ul>
        <li>1. 中英文语言切换</li>
        <li>2. 响应式</li>
        <li>3. admin 管理页完善 (一键导入导出功能)</li>
        <li>4. github action 的 ci/cd 接入 ✅</li>
        <li>5. 留言消息的未读已读功能</li>
      </ul>
      <h3>简述</h3>
      <p>
        项目地址{' '}
        <a target='_blank' href='https://github.com/alvin0216/remix-ssr-blog'>
          remix-ssr-blog
        </a>
        ， 延承主题{' '}
        <a target='_blank' href='https://github.com/alvin0216/react-blog'>
          spa 版本 react-blog
        </a>{' '}
        <img src='https://img.shields.io/github/stars/alvin0216/react-blog.svg' />，
        此项目采用的技术均为当前最新的技术。🔎 详情请进入 github 查看。觉得对您有帮助的，不妨请我喝杯奶茶，加个友链～
      </p>
      <p> 如有好的建议可以在下方留言，也可以 email 联系我：alvin00216@163.com</p>

      <Discuss comment={data.comment} context={context} postId={postId} />
    </>
  );
};

export default AboutPage;
