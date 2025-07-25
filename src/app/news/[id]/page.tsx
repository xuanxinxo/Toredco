import { notFound } from 'next/navigation'
import { connectDB } from '../../../lib/mongodb'
import News from '../../../models/News'
import Image from 'next/image'
import Link from 'next/link'

type Props = { params: { id: string } }

export default async function NewsDetailPage({ params }: Props) {
  await connectDB()
  const newsItem = await News.findById(params.id).lean()
  if (!newsItem) notFound()

  const { title, summary, date, image, link } = newsItem as any

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <time className="text-gray-500 mb-4 block">
        {new Date(date).toLocaleDateString('vi-VN')}
      </time>
      {image && (
        <div className="relative w-full h-64 mb-6">
          <Image src={image} alt={title} fill className="rounded object-cover" />
        </div>
      )}
      <p className="prose mb-4">{summary}</p>
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
}
