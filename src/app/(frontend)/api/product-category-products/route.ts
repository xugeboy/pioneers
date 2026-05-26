import { NextRequest } from 'next/server'
import { getPayload } from 'payload'

import configPromise from '@payload-config'
import {
  PRODUCT_PAGE_LIMIT,
  getAllProductCategories,
  getDescendantProductCategoryIDs,
  getProductCategoryPath,
  getProductCategoryProductsWhere,
  productCardSelect,
} from '@/utilities/productCategories'

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const categoryID = Number(searchParams.get('categoryId'))
  const pageParam = Number(searchParams.get('page') || '1')

  if (!Number.isInteger(categoryID) || categoryID < 1) {
    return Response.json({ error: 'Invalid category ID.' }, { status: 400 })
  }

  if (!Number.isInteger(pageParam) || pageParam < 1) {
    return Response.json({ error: 'Invalid page number.' }, { status: 400 })
  }

  const payload = await getPayload({ config: configPromise })
  const allCategories = await getAllProductCategories(payload)
  const category = allCategories.find((item) => item.id === categoryID)
  const categoryPath = getProductCategoryPath(category)

  if (!category || !categoryPath) {
    return Response.json({ error: 'Category not found.' }, { status: 404 })
  }

  const descendantIDs = getDescendantProductCategoryIDs(allCategories, categoryPath)
  const products = await payload.find({
    collection: 'products',
    depth: 1,
    limit: PRODUCT_PAGE_LIMIT,
    page: pageParam,
    overrideAccess: false,
    select: productCardSelect,
    sort: '-publishedAt',
    where: getProductCategoryProductsWhere(descendantIDs),
  })

  return Response.json({
    docs: products.docs,
    page: products.page,
    totalDocs: products.totalDocs,
    totalPages: products.totalPages,
  })
}
