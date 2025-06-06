# Online Course Platform

Đây là một dự án web platform học trực tuyến được xây dựng bằng React và Vite.

## Yêu cầu hệ thống

- Node.js (phiên bản 16.0.0 trở lên)
- npm (thường được cài đặt cùng với Node.js) hoặc yarn

## Cài đặt

1. Clone dự án về máy local của bạn:
```bash
git clone https://github.com/DucAnhDev9421/online-course-platform.git
cd online-course-platform
```

2. Cài đặt các dependencies:
```bash
npm install
# hoặc nếu bạn sử dụng yarn
yarn install
```

3. Khởi chạy môi trường development:
```bash
npm run dev
# hoặc
yarn dev
```

Sau khi chạy lệnh trên, ứng dụng sẽ được khởi chạy tại địa chỉ [http://localhost:5173](http://localhost:5173)

## Cấu trúc dự án

```
online-course-platform/
├── public/          # Chứa các tài nguyên tĩnh
├── src/             # Mã nguồn chính của ứng dụng
│   ├── components/  # Các React components
│   ├── pages/       # Các trang của ứng dụng
│   ├── assets/      # Hình ảnh, fonts và các tài nguyên khác
│   └── App.jsx      # Component gốc của ứng dụng
├── index.html       # File HTML gốc
└── package.json     # Quản lý dependencies và scripts
```

## Các lệnh thường dùng

- `npm run dev` - Khởi chạy môi trường development
- `npm run build` - Build dự án cho production
- `npm run preview` - Xem trước bản build production
- `npm run lint` - Kiểm tra lỗi code với ESLint

## Công nghệ sử dụng

- [React](https://reactjs.org/) - Thư viện JavaScript cho xây dựng giao diện người dùng
- [Vite](https://vitejs.dev/) - Build tool và development server
- [ESLint](https://eslint.org/) - Công cụ kiểm tra code
- [React Router](https://reactrouter.com/) - Quản lý routing trong ứng dụng

