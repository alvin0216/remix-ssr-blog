import { LoaderFunction, useLoaderData, useOutletContext } from 'remix';
import TageCatePage from '~/components/TageCatePage/TageCatePage';
import { PostListItem } from '~/export.types';
import { parseUrl } from '~/utils';

import { api_get_cates } from './api/cate';
import { api_get_posts } from './api/posts';

export const loader: LoaderFunction = async ({ request }) => {
  const query = parseUrl(request.url);
  const data = await api_get_posts({ ...query });

  return { query, data };
};

interface LoaderData {
  data: Page<PostListItem>;
  query: any;
}

export default function TagPage() {
  const context = useOutletContext<GlobalContext>();

  const loaderData = useLoaderData<LoaderData>();

  return <TageCatePage type='tag' context={context} {...loaderData} cateList={context.tagList} />;
}
