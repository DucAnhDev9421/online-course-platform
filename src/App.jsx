import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import HeroSection from './components/HeroSection';
import Categories from './components/Categories';
import CourseCard from './components/courses/CourseCard';
import Footer from './components/layout/Footer';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProfileUser from './pages/ProfileUser';

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
];

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={
              <>
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
              </>
            } />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            {/* Thêm route cho ProfileUser */}
            <Route path="/profileuser" element={<ProfileUser/>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
