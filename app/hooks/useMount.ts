import { useEffect, useState } from 'react';

export default function useMount(cb?: Function) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    cb?.();
    setIsMounted(true);
  }, []);

  return isMounted;
}
