// pages/_document.js

import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
        />
        {/* You can add other meta tags or links here */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
