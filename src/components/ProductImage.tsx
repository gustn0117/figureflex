'use client';

const categoryIcons: Record<string, JSX.Element> = {
  'cat-ichiban': <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
  'cat-figure': <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 1 4 4v2H8V6a4 4 0 0 1 4-4z" /><rect x="8" y="8" width="8" height="10" rx="1" /><path d="M10 18v4M14 18v4" /></svg>,
  'cat-gacha': <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><line x1="12" y1="2" x2="12" y2="8" /></svg>,
  'cat-goods': <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12v10H4V12" /><rect x="2" y="7" width="20" height="5" rx="1" /><path d="M12 22V7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></svg>,
};

interface Props {
  imageUrl?: string;
  categoryId: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function ProductImage({ imageUrl, categoryId, alt = '', size = 'md' }: Props) {
  const hasImage = imageUrl && imageUrl.length > 0 && !imageUrl.startsWith('/images/');
  const iconScale = size === 'lg' ? 'scale-[1.8]' : size === 'sm' ? 'scale-[0.8]' : 'scale-[1.2]';

  if (hasImage) {
    return <img src={imageUrl} alt={alt} className="w-full h-full object-cover" />;
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className={`text-gray-300 ${iconScale}`}>
        {categoryIcons[categoryId] || categoryIcons['cat-goods']}
      </div>
    </div>
  );
}

export { categoryIcons };
