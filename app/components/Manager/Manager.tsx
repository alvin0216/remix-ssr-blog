import { Table } from 'antd';
import { useEffect } from 'react';
import { useActionData, useFetcher, useSubmit } from 'remix';
import useRemixFormSubmit from '~/hooks/useRemixFormSubmit';
import { PostListItem } from '~/routes/api/posts';

interface ManagerProps {}

const Manager: React.FC<ManagerProps> = (props) => {
  const fetcher = useFetcher<Page<PostListItem>>();

  const loadList = async () => {
    fetcher.submit({ actionType: '' }, { action: '/api/posts', method: 'post' });
  };

  useEffect(() => {
    loadList();
  }, []);

  console.log(fetcher.data);

  return (
    <>
      <button onClick={loadList}>loadList</button>
      <Table<PostListItem>
        dataSource={fetcher.data?.results}
        columns={[
          { dataIndex: 'title', title: '标题' },
          { dataIndex: 'tag', title: '标签', render: (text, record) => record.tag.map((t) => t.name).join(',') },
        ]}
      />
    </>
  );
};

export default Manager;
