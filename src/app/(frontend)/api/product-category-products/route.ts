import { NextRequest } from 'next/server'
import { getPayload } from 'payload'

import configPromise from '@payload-config'
import {
  PRODUCT_PAGE_LIMIT,
  getAllProductCategories,
  getDescendantProductCategoryIDs,
  getProductCategoryProductsWhere,
  getProductCategorySegmentsFromPath,
  productCardSelect,
  resolveProductCategoryBySegments,
} from '@/utilities/productCategories'

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path')
  const pageParam = Number(searchParams.get('page') || '1')

  if (!path) {
    return Response.json({ error: 'Missing category path.' }, { status: 400 })
  }

  if (!Number.isInteger(pageParam) || pageParam < 1) {
    return Response.json({ error: 'Invalid page number.' }, { status: 400 })
  }

  const payload = await getPayload({ config: configPromise })
  const category = await resolveProductCategoryBySegments(
    payload,
    getProductCategorySegmentsFromPath(path),
  )

  if (!category) {
    return Response.json({ error: 'Category not found.' }, { status: 404 })
  }

  const allCategories = await getAllProductCategories(payload)
  const descendantIDs = getDescendantProductCategoryIDs(allCategories, path)
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
