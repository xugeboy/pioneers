import Script from 'next/script'

const marketingScriptsEnabled = process.env.NEXT_PUBLIC_MARKETING_SCRIPTS_ENABLED === 'true'
const gtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim()

let warnedMissingGtmId = false

const shouldRenderGTM = () => {
  if (!marketingScriptsEnabled) return false

  if (!gtmId) {
    if (process.env.NODE_ENV === 'development' && !warnedMissingGtmId) {
      warnedMissingGtmId = true
      console.warn(
        'Marketing scripts are enabled, but NEXT_PUBLIC_GTM_ID is missing. GTM will not be rendered.',
      )
    }

    return false
  }

  return true
}

export const MarketingHeadScripts = () => {
  if (!shouldRenderGTM()) return null

  const encodedGtmId = encodeURIComponent(gtmId as string)
  const serializedGtmId = JSON.stringify(gtmId)

  return (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script
      dangerouslySetInnerHTML={{
        __html: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id=${encodedGtmId}'+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer',${serializedGtmId});
        `,
      }}
      id="google-tag-manager"
      strategy="beforeInteractive"
    />
  )
}

export const MarketingBodyScripts = () => {
  if (!shouldRenderGTM()) return null

  return (
    <noscript>
      <iframe
        height="0"
        src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(gtmId as string)}`}
        style={{ display: 'none', visibility: 'hidden' }}
        title="Google Tag Manager"
        width="0"
      />
    </noscript>
  )
}
