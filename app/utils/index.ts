import hljs from 'highlight.js';
import { marked } from 'marked';
import xss from 'xss';
import { DiscussListItem } from '~/export.types';

/** 解析 url query，会默认转化为 number 类型 */
export function parseUrl<T = any>(url: string): T {
  if (!url.includes('?')) return {} as T;
  return url
    .replace(/.*\?/, '')
    .split(/[?&\/]/)
    .filter(Boolean)
    .reduce((q: any, s) => {
      const [key, value] = s.split('=');
      if (!isNaN(value as any)) q[key] = Number(value);
      else q[key] = decodeURI(value);
      return q;
    }, {});
}

/** query 转 url */
export function queryToUrl(query: any) {
  const str = Object.entries(query)
    .map(([key, value]) => {
      if (value === undefined) return false;
      return `${key}=${encodeURIComponent(String(value))}`;
    })
    .filter(Boolean)
    .join('&');

  return str ? `?${str}` : '';
}

export function translateMd(md: string, isGuardXss = false) {
  // @ts-ignore
  return marked(isGuardXss ? xss(md) : md, {
    renderer: new marked.Renderer(),
    gfm: true,
    pedantic: false,
    sanitize: false,
    tables: true,
    breaks: true,
    smartLists: true,
    smartypants: true,
    highlight: function (code: string) {
      return hljs.highlightAuto(code).value;
    },
  });
}

export function getDiscussCount(list: DiscussListItem[]) {
  let sum = list.length;

  list.forEach((item) => {
    sum += item.reply.length;
  });

  return sum;
}

export async function parseFormData<T = any>(request: Request) {
  const form = await request.formData();
  let result = {} as any;
  const fields = (form as any)?._fields;

  if (fields) {
    Object.entries(fields).forEach(([key, value]) => {
      const v = value ? (value as any)?.[0] : value;
      if (v !== 'undefined') {
        result[key] = v;
      }
    });
  }

  return result as T;
}

export interface HashListItem {
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
  title: string;
  href: string;
  children: HashListItem[];
}

export function getHashList(content: string): HashListItem[] {
  const pattern = /<(h[1-6])[\s\S]+?(?=<\/\1>)/g;
  const list: HashListItem[] = [];
  function pushItem(arr: HashListItem[], item: HashListItem) {
    const len = arr.length;
    const matchItem = arr[len - 1];
    if (matchItem && matchItem.tag !== item.tag) {
      pushItem(matchItem.children, item);
    } else {
      arr.push(item);
    }
  }
  // @ts-ignore
  content.replace(pattern, ($0, $1) => {
    const title = $0.replace(/.*?>/, '');
    const startIndex = $0.indexOf('"');
    const endIndex = $0.indexOf('">');

    const href = `#${$0.slice(startIndex + 1, endIndex)}`;
    const currentItem = {
      tag: $1, // 标签类型
      title,
      href,
      children: [],
    };
    pushItem(list, currentItem);
  });
  return list;
}

/**
 * 对数组进行分组
 * @param {Array} arr - 分组对象
 * @param {Function} f
 * @returns 数组分组后的新数组
 */
export const groupBy = (arr: any, f: any) => {
  const groups = {};
  arr.forEach((item: any) => {
    const group = JSON.stringify(f(item));
    // @ts-ignore
    groups[group] = groups[group] || [];
    // @ts-ignore
    groups[group].push(item);
  });
  // @ts-ignore
  return Object.keys(groups).map((group) => groups[group]);
};

export const colorList = [
  '#3598da',
  '#f47e60',
  '#839b87',
  '#e15b63',
  '#f9b369',
  '#67cd85',
  '#aabd80',
  '#F57E4C',
  '#67cd85',
  '#e15b64',
];

export const tagColorList = [
  'magenta',
  'blue',
  'success',
  'processing',
  'error',
  'warning',
  'default',
  'green',
  'cyan',
  'geekblue',
  'purple',
];
