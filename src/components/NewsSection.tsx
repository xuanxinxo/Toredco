"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface NewsItem {
  id: string;
  title: string;
  summary?: string;
  image: string;
  date?: string;
  link?: string;
}

export default function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => {
        setNews(data.news || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Không tải được tin tức");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4 bg-white rounded shadow">Đang tải tin tức...</div>;
  if (error) return <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>;

  return (
    <section className="p-4 bg-white rounded shadow mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Tin Tức</h2>
        <Link href="/news" className="text-sm text-blue-600 hover:underline">
          Xem thêm &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {news.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow hover:shadow-md transition-all duration-200"
          >
            <Link href={item.link || "#"} className="block">
              <div className="relative w-full h-40 rounded-t-xl overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold leading-snug line-clamp-2">{item.title}</h3>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
