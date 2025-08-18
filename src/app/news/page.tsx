import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/src/lib/prisma';

export const revalidate = 60;

async function getNews() {
  try {
    const news = await prisma.news.findMany({
      orderBy: { date: 'desc' },
    });
    return news;
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

export default async function NewsListPage() {
  const news = await getNews();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6 mt-10">
        <h1 className="text-3xl font-bold">Tin tức</h1>
        <Link href="/" className="text-blue-600 hover:underline">Trang chủ</Link>
      </div>

      {news && news.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {news.map((item) => (
            <Link
              key={item.id}
              href={`/news/${item.id}`}
              className="block bg-white rounded-lg shadow hover:shadow-md transition"
            >
              <div className="relative w-full h-44 rounded-t-lg overflow-hidden">
                {item.image ? (
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold line-clamp-2 mb-2">{item.title}</h3>
                {item.date ? (
                  <time className="text-xs text-gray-500">
                    {new Date(item.date).toLocaleDateString('vi-VN')}
                  </time>
                ) : (
                  <span className="text-xs text-gray-400">Không có ngày</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Không có tin tức nào</p>
      )}
    </div>
  );
}
