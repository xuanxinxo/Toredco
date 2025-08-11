import Image from 'next/image';
import Link from 'next/link';
import { connectDB } from '../../lib/mongodb';
import News from '../../models/News';

export const revalidate = 60;

async function getNews() {
  await connectDB();
  const items = await News.find().sort({ date: -1 }).lean();
  return items as any[];
}

export default async function NewsListPage() {
  const news = await getNews();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6 mt-10">
        <h1 className="text-3xl font-bold">Tin tức</h1>
        <Link href="/" className="text-blue-600 hover:underline">Trang chủ</Link>
      </div>

      {news.length === 0 ? (
        <div className="p-6 bg-white rounded shadow">Chưa có tin tức.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {news.map((item: any) => (
            <Link key={item._id.toString()} href={`/news/${item._id}`} className="block bg-white rounded-lg shadow hover:shadow-md transition">
              <div className="relative w-full h-44 rounded-t-lg overflow-hidden">
                {item.image && (
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold line-clamp-2 mb-2">{item.title}</h3>
                {item.date && (
                  <time className="text-xs text-gray-500">
                    {new Date(item.date).toLocaleDateString('vi-VN')}
                  </time>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}


