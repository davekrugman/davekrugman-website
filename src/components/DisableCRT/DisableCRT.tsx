'use client';

import { useEffect } from 'react';

export default function DisableCRT() {
  useEffect(() => {
    document.body.classList.add('no-crt');
    return () => {
      document.body.classList.remove('no-crt');
    };
  }, []);

  return null;
}
