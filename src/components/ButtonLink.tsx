import Link from 'next/link';
import { CSSProperties, ReactNode } from 'react';

export default function ButtonLink({
  href = '#',
  title = '',
  onClick,
  children,
  style = {},
  className = '',
}: Readonly<{
  href?: string;
  title?;
  onClick?: (...args: any) => any;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}>) {
  const handleClick = (event) => {
    if (!href || href === '#') {
      event.preventDefault();
    }
    onClick && onClick?.();
  };
  return (
    <Link
      href={href}
      onClick={handleClick}
      style={style}
      className={className}
      title={title}
    >
      {children}
    </Link>
  );
}
