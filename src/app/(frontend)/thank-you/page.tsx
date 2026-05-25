import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Thank You | PioneersGears',
  description: 'Thank you for your inquiry. Our team will contact you as soon as possible.',
  alternates: {
    canonical: '/thank-you',
  },
  robots: {
    follow: false,
    googleBot: {
      follow: false,
      index: false,
    },
    index: false,
  },
}

export default function ThankYouPage() {
  return (
    <main className="flex min-h-[calc(100vh-8rem)] items-center bg-white px-4 py-20 text-foreground">
      <section className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <p className="mb-4 font-mono text-sm font-semibold uppercase tracking-[0.28em] text-[#00A650] md:text-base">
          Inquiry received
        </p>
        <h1 className="max-w-3xl font-industrial text-5xl font-bold leading-[0.95] tracking-normal text-neutral-950 md:text-7xl">
          Thank you for your inquiry!
        </h1>
        <p className="mt-7 max-w-2xl text-base font-medium leading-7 text-neutral-700 md:text-lg">
          We have received your message. Our team will review your request and contact you as soon
          as possible.
        </p>

        <div aria-hidden="true" className="mt-14 w-full max-w-xl">
          <svg
            className="h-auto w-full"
            fill="none"
            role="img"
            viewBox="0 0 640 320"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M83 238h474" stroke="#F1F1F4" strokeLinecap="round" strokeWidth="10" />
            <path d="M153 111h78a8 8 0 0 1 8 8v55h-94v-55a8 8 0 0 1 8-8Z" fill="#FBFBFC" />
            <path d="M153 111h78a8 8 0 0 1 8 8v55h-94v-55a8 8 0 0 1 8-8Z" stroke="#ECECF1" />
            <path d="M109 178h171" stroke="#F0F0F5" strokeLinecap="round" strokeWidth="8" />
            <path d="M166 187h-12l-22 74h14l20-74ZM238 187h12l22 74h-14l-20-74Z" fill="#7B6558" />
            <path d="M143 183h116v11H143z" fill="#E9E9EF" />
            <path d="M353 217h142v12H353z" fill="#F2F2F6" />
            <path d="M374 228h-12l-19 63h13l18-63ZM472 228h12l19 63h-13l-18-63Z" fill="#7B6558" />
            <path d="M364 126c-18 7-28 22-31 45l-5 42h62l1-50c0-27-8-41-27-37Z" fill="#E95054" />
            <path d="M360 132c-3 24-18 43-40 57l11 13c28-16 45-38 50-65l-21-5Z" fill="#E95054" />
            <path
              d="M401 137c15 13 22 31 20 55l-2 26h-23l-1-34c-1-18-7-31-18-40l24-7Z"
              fill="#5E6876"
            />
            <path
              d="M378 101c19 0 31 14 28 33-3 18-16 30-33 28-17-2-28-16-25-34 3-16 14-27 30-27Z"
              fill="#F2B6A3"
            />
            <path
              d="M352 113c10-16 35-23 51-10 11 9 13 23 6 36-4-10-11-16-22-18-14-2-22-4-35-8Z"
              fill="#4D5865"
            />
            <path
              d="M360 126c-13 5-22 16-25 31-2 13 1 26 9 37-24-2-38-15-38-36 0-27 21-48 54-32Z"
              fill="#4D5865"
            />
            <path d="M381 213h-78l17-57h77l-16 57Z" fill="#5668A8" />
            <path d="M343 183c5 0 9 3 8 7-1 3-5 6-10 6s-9-3-8-7c1-3 5-6 10-6Z" fill="#EEF1FF" />
            <path
              d="M426 95c0-29 23-52 52-52s52 23 52 52-23 52-52 52c-9 0-17-2-24-6l-28 24 8-35c-5-9-8-22-8-35Z"
              fill="#fff"
              stroke="#EFEFF4"
              strokeWidth="2"
            />
            <path
              d="M456 83 503 68l-15 47-10-20-22-12Z"
              fill="#fff"
              stroke="#E95054"
              strokeLinejoin="round"
              strokeWidth="4"
            />
            <path d="m478 95 25-27" stroke="#E95054" strokeLinecap="round" strokeWidth="4" />
            <path
              d="M536 204c15 16 21 36 18 62"
              stroke="#E8E8EF"
              strokeLinecap="round"
              strokeWidth="5"
            />
            <path d="M533 224c-14-3-23-12-27-28 15 0 25 9 27 28Z" fill="#F4F4F8" />
            <path d="M554 241c13-7 25-7 38 0-9 13-22 13-38 0Z" fill="#F4F4F8" />
          </svg>
        </div>
      </section>
    </main>
  )
}
