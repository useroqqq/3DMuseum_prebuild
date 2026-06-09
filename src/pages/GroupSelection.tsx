import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { exhibits } from '../data/exhibits';

export default function GroupSelection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const exhibit = exhibits[id || ''];

  if (!exhibit || !exhibit.isGroup) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-neutral-50 text-neutral-900">
        <h1 className="text-2xl font-bold mb-4">Группа экспонатов не найдена</h1>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Вернуться на главную
        </button>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-row overflow-hidden bg-black text-white relative">
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-50 bg-black/50 hover:bg-black/80 backdrop-blur-md text-white p-3 rounded-full transition-colors border border-white/10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      {/* 4 Vertical Sections */}
      {exhibit.groupItems?.map((item) => (
        <div 
          key={item.id}
          onClick={() => navigate(`/exhibit/${item.id}`)}
          className="relative flex-1 h-full cursor-pointer group overflow-hidden border-r border-neutral-800 last:border-r-0"
        >
          {/* Background Photo */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${item.photo})` }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-500 opacity-90 group-hover:opacity-100" />

          {/* Caption at the bottom */}
          <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <h2 className="text-3xl font-bold font-sans tracking-tight mb-3 drop-shadow-md">{item.title}</h2>
            <div className="w-12 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
