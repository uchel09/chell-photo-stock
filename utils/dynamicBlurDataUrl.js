const baseURL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000' 
  : "https://chell-photo-stock-mvyrevdxv-russels-projects-6e2a4a6c.vercel.app"

export async function dynamicBlurDataUrl(url){
  // generate the smallest image => covert to Base64.
  const base64str = await fetch(`${baseURL}/_next/image?url=${url}&w=16&q=75`)
    .then(async (res) => 
      Buffer.from(await res.arrayBuffer()).toString('base64')
    )

  const blurSvg = `
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 5'>
      <filter id='b' color-interpolation-filters='sRGB'>
        <feGaussianBlur stdDeviation='1'/>
      </filter>

      <image preserveAspectRatio='none' filter='url(#b)' x='0' y='0' height='100%' width='100%' href='data:image/webp;base64,${base64str}'/> 
    </svg>
  `
  //avif, webp
  const toBase64 = (str) => 
    typeof window === 'undefined'
      ? Buffer.from(str).toString('base64')
      : window.btoa(str)

  return `data:image/svg+xml;base64,${toBase64(blurSvg)}`
}