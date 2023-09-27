import Link from 'next/link'
import * as React from 'react'

import clsx from 'clsx'

const UnstyledLink = React.forwardRef(
  ({ children, href, openNewTab, className, nextLinkProps, ...rest }, ref) => {
    const isNewTab =
      openNewTab !== undefined
        ? openNewTab
        : href && !href.startsWith('/') && !href.startsWith('#')

    if (!isNewTab) {
      return (
        <Link
          href={href}
          ref={ref}
          className={className}
          {...rest}
          {...nextLinkProps}
        >
          {children}
        </Link>
      )
    }

    return (
      <a
        ref={ref}
        target='_blank'
        rel='noopener noreferrer'
        href={href}
        {...rest}
        className={clsx('cursor-newtab', className)}
      >
        {children}
      </a>
    )
  }
)

UnstyledLink.displayName = 'UnstyledLink'

export default UnstyledLink
