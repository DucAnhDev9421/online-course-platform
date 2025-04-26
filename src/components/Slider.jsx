import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Import Swiper styles
import 'swiper/css/bundle';

export default function Slider() {
  const [slides, setSlides] = useState([
    {
      id: 1,
      image: 'https://img-c.udemycdn.com/notices/web_carousel_slide/image/db24b94e-d190-4d5a-b1dd-958f702cc8f5.jpg',
      title: 'Học những kỹ năng mới mỗi ngày',
      description: 'Với hơn 185,000 khóa học video, bạn có thể tìm thấy những gì bạn cần để phát triển.'
    },
    {
      id: 2,
      image: 'https://img-c.udemycdn.com/notices/featured_carousel_slide/image/487fb3b7-4b6e-4c2f-a3fe-67eb51016502.jpg',
      title: 'Học từ các chuyên gia hàng đầu',
      description: 'Các khóa học được giảng dạy bởi các chuyên gia thực tế trong lĩnh vực.'
    },
    {
      id: 3,
      image: 'https://img-c.udemycdn.com/notices/featured_carousel_slide/image/5387d960-4af6-482a-a6a7-2c2f1349814b.jpg',
      title: 'Học mọi lúc, mọi nơi',
      description: 'Truy cập khóa học từ bất kỳ thiết bị nào, bất kỳ lúc nào bạn muốn.'
    }
  ]);

  return (
    <section className="relative py-0 bg-gray-900 text-white">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 7000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="h-[500px]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div 
              className="relative h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="container mx-auto px-4 h-full flex items-center">
                <div className="max-w-2xl bg-black bg-opacity-40 p-8 rounded-lg backdrop-blur-sm">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">{slide.title}</h1>
                  <p className="text-lg mb-6">{slide.description}</p>
                  <Link 
                    to="/courses" 
                    className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-md transition duration-300"
                  >
                    Khám phá khóa học
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
} 