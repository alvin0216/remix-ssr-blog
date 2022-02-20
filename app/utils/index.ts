import hljs from 'highlight.js';
import { marked } from 'marked';
import xss from 'xss';
import { DiscussListItem } from '~/components/Discuss/Discuss';

/** 解析 url query，会默认转化为 number 类型 */
export function parseUrl<T = any>(url: string): T {
  return url
    .replace(/.*\?/, '')
    .split(/[?&\/]/)
    .filter(Boolean)
    .reduce((q: any, s) => {
      const [key, value] = s.split('=');
      if (!isNaN(value as any)) q[key] = Number(value);
      else q[key] = value;
      return q;
    }, {});
}

/** query 转 url */
export function queryToUrl(query: any) {
  return Object.entries(query)
    .map(([key, value]) => {
      if (value === undefined) return false;
      return `${key}=${encodeURIComponent(String(value))}`;
    })
    .filter(Boolean)
    .join('&');
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
      result[key] = value ? (value as any)?.[0] : value;
    });
  }

  return result as T;
}
