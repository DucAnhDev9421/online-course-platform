// components/HeroSection.jsx
export default function HeroSection() {
  return (
    <section className="relative py-24 bg-gray-900 text-white">
      {/* Background image */}
      <div className="absolute inset-0 bg-[url('https://img-c.udemycdn.com/notices/web_carousel_slide/image/db24b94e-d190-4d5a-b1dd-958f702cc8f5.jpg')] bg-cover bg-center opacity-50"></div>

      {/* Nội dung */}
      <div className="container mx-auto px-4 relative z-10 ">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Học những kỹ năng mới mỗi ngày</h1>
          <p className="text-lg mb-6">Với hơn 185,000 khóa học video, bạn có thể tìm thấy những gì bạn cần để phát triển.</p>
        </div>
      </div>
    </section>
  )
}