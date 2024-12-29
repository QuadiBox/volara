'use client'

import React, { useEffect, useState } from 'react';

const BackLink = () => {
  const [prevUrl, setPrevUrl] = useState('');

  useEffect(() => {
    setPrevUrl(document.referrer || '/'); // Fallback to home if no referrer
  }, []);

  return (
    <a href={prevUrl}>
      <img src="/darklogo.png" alt="Volara dark theme logo" />
    </a>
  );
};

export default BackLink;
