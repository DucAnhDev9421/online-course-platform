// App.jsx
import { useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Categories from './components/Categories';
import CourseCard from './components/CourseCard';
import Footer from './components/Footer';


const courses = [
  {
    title: 'React - The Complete Guide (incl Hooks, React Router, Redux)',
    instructor: 'Maximilian Schwarzmüller',
    price: 12.99,
    rating: 4.7,
    students: '125,000',
    image: 'https://img-c.udemycdn.com/course/480x270/1362070_b9a1_2.jpg'
  },
  {
    title: 'The Complete JavaScript Course 2023: From Zero to Expert!',
    instructor: 'Jonas Schmedtmann',
    price: 13.99,
    rating: 4.8,
    students: '150,000',
    image: 'https://img-c.udemycdn.com/course/480x270/851712_fc61_6.jpg'
  },
  // Thêm các khóa học khác
];

export default function App() {
  const [authModal, setAuthModal] = useState({
    show: false,
    type: 'login' // 'login' hoặc 'register'
  });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Truyền hàm setAuthModal vào Header */}
      <Header onAuthButtonClick={(type) => setAuthModal({ show: true, type })} />
      
      <main className="flex-grow">
        <HeroSection />
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Các khóa học được đề xuất</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course, index) => (
                <CourseCard key={index} {...course} />
              ))}
            </div>
          </div>
        </section>
        <Categories />
      </main>
      
      <Footer />

    

    </div>
  )
}