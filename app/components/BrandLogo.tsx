import Image from 'next/image'

type BrandLogoProps = {
  variant: 'positive' | 'negative'
}

export function BrandLogo({variant}: BrandLogoProps) {
  return (
    <span className={`brand-logo brand-logo--${variant}`} aria-hidden="true">
      <Image
        className="brand-logo__image"
        src={`/brand/incontri-ravvicinati-${variant}.png`}
        alt="Logo di Incontri Ravvicinati"
        width={3508}
        height={2481}
        loading={variant === 'positive' ? 'eager' : 'lazy'}
        sizes="(max-width: 767px) 140vw, (max-width: 1100px) 90vw, 780px"
      />
    </span>
  )
}
