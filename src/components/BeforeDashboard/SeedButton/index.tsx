'use client'

import React, { Fragment, useCallback, useState } from 'react'
import { toast, useAuth } from '@payloadcms/ui'
import { isAdminUser } from '@/access/roles'

import './index.scss'

const SuccessMessage: React.FC = () => (
  <div>
    Database seeded! You can now{' '}
    <a target="_blank" href="/">
      visit your website
    </a>
  </div>
)

export const SeedButton: React.FC = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [seeded, setSeeded] = useState(false)
  const [error, setError] = useState<null | string>(null)
  const isAdmin = isAdminUser(user)

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      if (seeded) {
        toast.info('Database already seeded.')
        return
      }
      if (loading) {
        toast.info('Seeding already in progress.')
        return
      }
      if (error) {
        toast.error(`An error occurred, please refresh and try again.`)
        return
      }

      setLoading(true)

      try {
        await toast.promise(
          new Promise((resolve, reject) => {
            try {
              fetch('/next/seed', { method: 'POST', credentials: 'include' })
                .then((res) => {
                  if (res.ok) {
                    resolve(true)
                    setSeeded(true)
                  } else {
                    reject('An error occurred while seeding.')
                  }
                })
                .catch((requestError) => {
                  reject(requestError)
                })
            } catch (requestError) {
              reject(requestError)
            }
          }),
          {
            loading: 'Seeding with data....',
            success: <SuccessMessage />,
            error: 'An error occurred while seeding.',
          },
        )
      } catch (err) {
        const nextError = err instanceof Error ? err.message : String(err)
        setError(nextError)
      } finally {
        setLoading(false)
      }
    },
    [error, loading, seeded],
  )

  if (!isAdmin) {
    return (
      <>
        Review your existing content and{' '}
        <a href="/" target="_blank">
          visit your website
        </a>{' '}
        to confirm everything looks right.
      </>
    )
  }

  let message = ''
  if (loading) message = ' (seeding...)'
  if (seeded) message = ' (done!)'
  if (error) message = ` (error: ${error})`

  return (
    <Fragment>
      <button className="seedButton" onClick={handleClick}>
        Seed your database
      </button>
      {message}
      {' with a few pages, posts, and projects to jump-start your new site, then '}
      <a href="/" target="_blank">
        visit your website
      </a>
      {' to see the results.'}
    </Fragment>
  )
}
