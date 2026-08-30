type ArrowIconProps = {
  direction?: 'up-right' | 'down' | 'left'
}

export function ArrowIcon({direction = 'up-right'}: ArrowIconProps) {
  const path = {
    'up-right': 'M5 19 19 5M8 5h11v11',
    down: 'M12 5v14M6 13l6 6 6-6',
    left: 'M19 12H5m6-6-6 6 6 6',
  }[direction]

  return (
    <svg
      className={`link-arrow link-arrow--${direction}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  )
}
