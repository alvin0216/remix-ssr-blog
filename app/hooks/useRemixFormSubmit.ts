import { useRef } from 'react';
import { SubmitFunction, SubmitOptions, useLocation, useSubmit } from 'remix';

export default function useRemixFormSubmit() {
  const submit = useSubmit();
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
    submit(
      { redirectUrl: location.pathname + location.search + location.hash, ...formData },
      { method: 'post', action, ...submitOptions }
    );
  };
  return doSubmit;
}
