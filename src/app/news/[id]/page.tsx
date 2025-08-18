import { notFound } from 'next/navigation'
import { prisma } from '@/src/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import { ObjectId } from 'mongodb'

type Props = { params: { id: string } }

// Validate if the ID is a valid MongoDB ObjectId
function isValidObjectId(id: string) {
  return ObjectId.isValid(id) && new ObjectId(id).toString() === id;
}

export default async function NewsDetailPage({ params }: Props) {
  // Check if the ID is a valid MongoDB ObjectId
  if (!isValidObjectId(params.id)) {
    notFound()
  }

  try {
    // Use the correct model name 'news' (lowercase) as defined in Prisma schema
    const newsItem = await prisma.news.findUnique({
      where: { id: new ObjectId(params.id) as any }
    })

    if (!newsItem) {
      notFound()
    }

    // Ensure we have all required fields
    if (!newsItem.title || !newsItem.summary || !newsItem.date) {
      console.error('News item is missing required fields:', newsItem)
      notFound()
    }

    const { title, summary, date, image, link } = newsItem

    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-10">
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <time className="text-gray-500 mb-4 block">
          {new Date(date).toLocaleDateString('vi-VN')}
        </time>
        {image && (
          <div className="relative w-full h-64 mb-6">
            <Image 
              src={image} 
              alt={title} 
              fill 
              className="rounded object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        )}
        <div className="prose mb-4" dangerouslySetInnerHTML={{ __html: summary || '' }} />
        {link && (
          <div className="mb-4">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Xem thêm tại nguồn
            </a>
          </div>
        )}
        <Link href="/" className="text-blue-500 hover:underline">
          &larr; Về trang chủ
        </Link>
      </div>
    )
  } catch (error) {
    console.error('Error fetching news item:', error)
    notFound()
  }
}
