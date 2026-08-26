import Image from 'next/image'

type BrandLogoProps = {
  variant: 'positive' | 'negative'
  priority?: boolean
}

export function BrandLogo({variant, priority = false}: BrandLogoProps) {
  return (
    <span className={`brand-logo brand-logo--${variant}`} aria-hidden="true">
      <Image
        className="brand-logo__image"
        src={`/brand/incontri-ravvicinati-${variant}.png`}
        alt=""
        width={3508}
        height={2481}
        sizes="(max-width: 640px) 78vw, 36rem"
        priority={priority}
        unoptimized
      />
    </span>
  )
}
