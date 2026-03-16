import type { CollectionConfig } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '../access/anyone'
import { isAdmin } from '../access/isAdmin'
import { isEditorOrAdmin } from '../access/isEditorOrAdmin'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Files: CollectionConfig = {
  slug: 'files',
  access: {
    create: isEditorOrAdmin,
    delete: isAdmin,
    read: anyone,
    update: isEditorOrAdmin,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
  ],
  upload: {
    staticDir: path.resolve(dirname, '../../public/files'),
  },
}
