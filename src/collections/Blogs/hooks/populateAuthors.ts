import type { CollectionAfterReadHook } from 'payload'

type BlogAuthorAccount = {
  email?: string | null
  id: number | string
  name?: string | null
}

// The `user` collection has access control locked so that users are not publicly accessible
// This means that we need to populate the authors manually here to protect user privacy
// GraphQL will not return mutated user data that differs from the underlying schema
// So we use an alternative `populatedAuthors` field to populate the user data, hidden from the admin UI
export const populateAuthors: CollectionAfterReadHook = async ({ doc, req }) => {
  if (doc?.authors && doc?.authors?.length > 0) {
    const authorDocs: BlogAuthorAccount[] = []

    for (const author of doc.authors) {
      try {
        const authorDoc = await req.payload.findByID({
          id: typeof author === 'object' ? author?.id : author,
          collection: 'users',
          depth: 0,
          overrideAccess: true,
          req,
          select: {
            email: true,
            name: true,
          },
        })

        if (authorDoc) {
          authorDocs.push(authorDoc)
        }

        if (authorDocs.length > 0) {
          doc.populatedAuthors = authorDocs.map((authorDoc) => ({
            id: authorDoc.id,
            name: authorDoc.name || getAuthorDisplayNameFromEmail(authorDoc.email),
          }))
        }
      } catch {
        // swallow error
      }
    }
  }

  return doc
}

function getAuthorDisplayNameFromEmail(email?: string | null): string | null {
  if (!email) return null

  return email.split('@')[0] || null
}
