// components/Categories.jsx
export default function Categories() {
    const categories = [
      { name: 'Phát triển', icon: '💻' },
      { name: 'Kinh doanh', icon: '📈' },
      { name: 'Tài chính', icon: '💰' },
      { name: 'IT và Phần mềm', icon: '🔧' },
      { name: 'Marketing', icon: '📢' },
      { name: 'Nghệ thuật', icon: '🎨' },
      { name: 'Nhiếp ảnh', icon: '📷' },
      { name: 'Âm nhạc', icon: '🎵' },
    ]
  
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Danh mục phổ biến</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-purple-50 cursor-pointer">
                <div className="text-3xl mb-2">{category.icon}</div>
                <h3 className="font-medium">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }