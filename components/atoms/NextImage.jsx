import Image from 'next/image'
import * as React from 'react'

import clsx from 'clsx'

/**
 *
 * @description Must set width using `w-` className
 * @param useSkeleton add background with pulse animation, don't use it if image is transparent
 */
export default function NextImage({
  useSkeleton = false,
  src,
  width,
  height,
  alt,
  className,
  imgClassName,
  iconFallbackClassName,
  blurClassName,
  ...rest
}) {
  const [status, setStatus] = React.useState(
    useSkeleton ? 'loading' : 'complete'
  )
  const widthIsSet = className?.includes('w-') ?? false

  const [imageError, setImageError] = React.useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <figure
      style={!widthIsSet ? { width: `${width}px` } : undefined}
      className={className}
    >
      {!imageError ? (
        <Image
          className={clsx(
            imgClassName,
            status === 'loading' && clsx('animate-pulse', blurClassName)
          )}
          src={src}
          width={width}
          height={height}
          alt={alt}
          onLoadingComplete={() => setStatus('complete')}
          onError={handleImageError}
          {...rest}
        />
      ) : (
        <IconFallback
          className={iconFallbackClassName}
          width={width}
          height={height}
        />
      )}
    </figure>
  )
}

export function IconFallback({ width = 20, height = 20, className }) {
  const [pathWidth, setPathWidth] = React.useState(width)
  const [pathHeight, setPathHeight] = React.useState(height)

  const handleResize = (e) => {
    const svgElement = e.target
    const boundingBox = svgElement.getBBox()
    setPathWidth((width * width) / boundingBox.width)
    setPathHeight((height * height) / boundingBox.height)
  }

  return (
    <span className={clsx('svg-icon svg-icon-muted svg-icon-2hx', className)}>
      <svg
        width={width}
        height={height}
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        onResize={handleResize}
      >
        <path
          opacity='0.3'
          d='M22 5V19C22 19.6 21.6 20 21 20H19.5L11.9 12.4C11.5 12 10.9 12 10.5 12.4L3 20C2.5 20 2 19.5 2 19V5C2 4.4 2.4 4 3 4H21C21.6 4 22 4.4 22 5ZM7.5 7C6.7 7 6 7.7 6 8.5C6 9.3 6.7 10 7.5 10C8.3 10 9 9.3 9 8.5C9 7.7 8.3 7 7.5 7Z'
          fill='currentColor'
          width={pathWidth}
          height={pathHeight}
        />
        <path
          d='M19.1 10C18.7 9.60001 18.1 9.60001 17.7 10L10.7 17H2V19C2 19.6 2.4 20 3 20H21C21.6 20 22 19.6 22 19V12.9L19.1 10Z'
          fill='currentColor'
          width={pathWidth}
          height={pathHeight}
        />
      </svg>
    </span>
  )
}
