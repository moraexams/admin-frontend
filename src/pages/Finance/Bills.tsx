import React, { useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';

type ImageItem = {
  id: string;
  url: string;
  remark: string;
  category: string;
};

const sampleImages: ImageItem[] = [
  { id: '1', url: '/images/task/task-01.jpg', remark: 'task', category: 'Jaffna' },
  { id: '2', url: '/images/logo/logo-light.jpg', remark: 'logo', category: 'Colombo' },
  { id: '3', url: '/images/logo/logo-dark.svg', remark: 'branding', category: 'Jaffna' },
];

const Gallery: React.FC = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(sampleImages.map(img => img.category)))];

  const filteredImages = sampleImages.filter(img =>
    (category === 'All' || img.category === category) &&
    img.remark.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <DefaultLayout>
      <div style={{ padding: '20px', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: '10px 15px',
              borderRadius: '25px',
              border: '1px solid #ccc',
              fontSize: '16px',
              outline: 'none',
            }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search by remarks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flexGrow: 1,
              padding: '10px 15px',
              borderRadius: '25px',
              border: '1px solid #ccc',
              fontSize: '16px',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
          {filteredImages.map((img) => (
            <div key={img.id} style={{ borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <img src={img.url} alt="" style={{ width: '200px', height: 'auto', display: 'block' }} />
            </div>
          ))}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Gallery;
