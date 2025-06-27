import { NextResponse } from 'next/server';

export async function GET() {
  const data = [
    // ===== Nhân sự (talent) =====
    {
      id: 1,
      category: 'talent',
      name: 'Nguyễn Anh',
      rating: 5,
      avatar: './img/atony.jpg',
      dob: '1997-04-12',
      experience: 5,
      hometown: 'Hà Nội',
    },
    {
      id: 2,
      category: 'talent',
      name: 'Trần Bình',
      rating: 5,
      avatar: './img/congphuong.jpg',

      dob: '1995-08-30',
      experience: 6,
      hometown: 'Hải Phòng',
    },
    {
      id: 3,
      category: 'talent',
      name: 'Phạm Chi',
      rating: 5,
      avatar: './img/M10.jpg',

      dob: '1999-02-18',
      experience: 3,
      hometown: 'Đà Nẵng',
    },
    {
      id: 4,
      category: 'talent',
      name: 'Lê Dũng',
      rating: 4,
      avatar: './img/toni.jpg',

      dob: '1996-06-22',
      experience: 4,
      hometown: 'Huế',
    },
    {
      id: 5,
      category: 'talent',
      name: 'Đoàn Em',
      rating: 4,
      avatar: './img/kaka.jpg',

      dob: '1998-11-10',
      experience: 4,
      hometown: 'Quảng Nam',
    },
    {
      id: 6,
      category: 'talent',
      name: 'Võ Giang',
      rating: 4,
      avatar: './img/cr7.jpg',

      dob: '1994-03-03',
      experience: 7,
      hometown: 'TP.HCM',
    },
    {
      id: 7,
      category: 'talent',
      name: 'Hồ Hạnh',
      rating: 3,
      avatar: './img/ava.jpg',

      dob: '2000-09-15',
      experience: 2,
      hometown: 'Cần Thơ',
    },
    {
      id: 8,
      category: 'talent',
      name: 'Mai Khoa',
      rating: 3,
      avatar: './img/ava.jpg',

      dob: '1997-12-01',
      experience: 3,
      hometown: 'Bình Định',
    },
    {
      id: 9,
      category: 'talent',
      name: 'Bùi Lâm',
      rating: 3,
      avatar: './img/ava.jpg',

      dob: '1993-05-27',
      experience: 8,
      hometown: 'Nghệ An',
    },

     {
      id: 1,
      category: 'talent',
      name: 'Nguyễn Anh',
      rating: 5,
      avatar: './img/ava.jpg',
      dob: '1997-04-12',
      experience: 5,
      hometown: 'Hà Nội',
    },
    {
      id: 2,
      category: 'talent',
      name: 'Trần Bình',
      rating: 5,
      avatar: './img/ava.jpg',

      dob: '1995-08-30',
      experience: 6,
      hometown: 'Hải Phòng',
    },
    {
      id: 3,
      category: 'talent',
      name: 'Phạm Chi',
      rating: 5,
      avatar: './img/ava.jpg',

      dob: '1999-02-18',
      experience: 3,
      hometown: 'Đà Nẵng',
    },
    {
      id: 4,
      category: 'talent',
      name: 'Lê Dũng',
      rating: 4,
      avatar: './img/ava.jpg',

      dob: '1996-06-22',
      experience: 4,
      hometown: 'Huế',
    },
    {
      id: 5,
      category: 'talent',
      name: 'Đoàn Em',
      rating: 4,
      avatar: './img/ava.jpg',

      dob: '1998-11-10',
      experience: 4,
      hometown: 'Quảng Nam',
    },
    {
      id: 6,
      category: 'talent',
      name: 'Võ Giang',
      rating: 4,
      avatar: './img/ava.jpg',

      dob: '1994-03-03',
      experience: 7,
      hometown: 'TP.HCM',
    },
    {
      id: 7,
      category: 'talent',
      name: 'Hồ Hạnh',
      rating: 3,
      avatar: './img/ava.jpg',

      dob: '2000-09-15',
      experience: 2,
      hometown: 'Cần Thơ',
    },
    {
      id: 8,
      category: 'talent',
      name: 'Mai Khoa',
      rating: 3,
      avatar: './img/ava.jpg',

      dob: '1997-12-01',
      experience: 3,
      hometown: 'Bình Định',
    },
    {
      id: 9,
      category: 'talent',
      name: 'Bùi Lâm',
      rating: 3,
      avatar: './img/ava.jpg',

      dob: '1993-05-27',
      experience: 8,
      hometown: 'Nghệ An',
    },
    // ===== Doanh nghiệp (company) =====
    {
      id: 101,
      category: 'company',
      name: 'Công ty ABC',
      rating: 5,
      avatar: './img/vinground.png'
    },
    {
      id: 102,
      category: 'company',
      name: 'Công ty XYZ',
      rating: 4,
      avatar: './img/agri.jpg'
    },
    {
      id: 103,
      category: 'company',
      name: 'Công ty DEF',
      rating: 3,
      avatar: './img/thaco.png'
    },
      {
      id: 104,
      category: 'company',
      name: 'Công ty ABC',
      rating: 5,
      avatar: './img/mb.png'
    },
  ];

  return NextResponse.json({ data });
}
