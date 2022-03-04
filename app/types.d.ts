declare interface GithubInfo {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string;
  company?: any;
  blog: string;
  location: string;
  email?: any;
  hireable?: any;
  bio: string;
  twitter_username?: any;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

declare interface UnReadItem {
  title: string | undefined;
  id: number;
  userId: number;
  postId: string;
  email: string;
  masterIsRead: boolean;
}

declare interface GlobalContext {
  user?: GithubInfo;
  isMaster: boolean;
  tagList: { name: string; _count: number }[];
  tagColor: { [key: string]: string };
  unReadList: UnReadItem[];
  setUnReadList: (newList: UnReadItem[]) => void;
}

declare interface Page<T> {
  total: number;
  results: T[];
  current: number;
  pageSize: number;
}

declare interface CateListItem {
  name: string;
  _count: number;
}
