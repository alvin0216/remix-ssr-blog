import { SubmitOptions, useFetcher, useLocation } from 'remix';

export default function useRemixFetcherSubmit() {
  const fetcher = useFetcher();
  const location = useLocation();
  const doSubmit = (
    action?: string,
    formData?:
      | HTMLFormElement
      | HTMLButtonElement
      | HTMLInputElement
      | FormData
      | URLSearchParams
      | {
          [name: string]: string;
        }
      | null,
    submitOptions?: SubmitOptions
  ) => {
    fetcher.submit(
      { redirectUrl: location.pathname + location.search + location.hash, ...formData },
      { method: 'post', action, ...submitOptions }
    );
  };
  return { submit: doSubmit, fetcher };
}
