import type { Metadata } from 'next';
import './globals.css'; // Import file CSS toàn cục để nhận diện Tailwind CSS

// Phần metadata này rất tốt cho SEO và hiển thị tên tab trình duyệt
export const metadata: Metadata = {
  title: 'Treasure Match - AI Project',
  description: 'Đồ án môn Trí tuệ Nhân tạo - Game Match 3',
};

// RootLayout bắt buộc phải nhận vào 'children' và trả về thẻ html, body
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="antialiased">
        {/* 'children' ở đây chính là nội dung của file page.tsx mà chúng ta đã code */}
        {children}
      </body>
    </html>
  );
}