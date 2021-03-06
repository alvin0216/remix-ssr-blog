import { LoaderFunction, useLoaderData, useOutletContext } from 'remix';
import TageCatePage from '~/components/TageCatePage/TageCatePage';
import { PostListItem } from '~/export.types';
import { parseUrl } from '~/utils';

import { api_get_cates } from './api/cate';
import { api_get_posts } from './api/posts';

export const loader: LoaderFunction = async ({ request }) => {
  const query = parseUrl(request.url);
  const cateList = await api_get_cates();
  const data = await api_get_posts({ ...query });

  return { cateList, query, data };
};

interface LoaderData {
  cateList: CateListItem[];
  data: Page<PostListItem>;
  query: any;
}

export default function CatePage() {
  const context = useOutletContext<GlobalContext>();

  const loaderData = useLoaderData<LoaderData>();

  return <TageCatePage type='cate' context={context} {...loaderData} />;
}
