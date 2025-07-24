'use client';

import React, { useState, useEffect, FormEvent } from 'react';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  image: string;
  link?: string;
}

export default function NewsAdmin() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [date, setDate] = useState('');
  const [image, setImage] = useState('');
  const [link, setLink] = useState('');

  const fetchNews = async () => {
    const res = await fetch('/api/news');
    const data = await res.json();
    setItems(data.news || []);
  };

  useEffect(() => { fetchNews(); }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, summary, date, image, link }),
    });
    if (res.ok) {
      setTitle(''); setSummary(''); setDate(''); setImage(''); setLink('');
      fetchNews();
    } else {
      const errData = await res.json();
      console.error('API error creating news item:', errData);
      alert(errData.error || 'Error creating news item');
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl mb-4">Admin: Manage News</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label className="block">Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className="border p-2 w-full" />
        </div>
        <div>
          <label className="block">Summary</label>
          <textarea value={summary} onChange={e => setSummary(e.target.value)} className="border p-2 w-full" />
        </div>
        <div>
          <label className="block">Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border p-2 w-full" />
        </div>
        <div>
          <label className="block">Image URL</label>
          <input value={image} onChange={e => setImage(e.target.value)} className="border p-2 w-full" />
        </div>
        <div>
          <label className="block">Link (optional)</label>
          <input value={link} onChange={e => setLink(e.target.value)} className="border p-2 w-full" />
        </div>
        <button type="submit" className="bg-green-500 text-white px-4 py-2">Create News</button>
      </form>
      <section>
        <h2 className="text-xl mb-2">Existing News</h2>
        <ul className="space-y-4">
          {items.map(item => (
            <li key={item.id} className="border p-4">
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.date}</p>
              <p>{item.summary}</p>
              {item.image && <img src={item.image} alt={item.title} className="mt-2 max-w-xs" />}
              {item.link && <p><a href={item.link} className="text-blue-500">Read more</a></p>}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
