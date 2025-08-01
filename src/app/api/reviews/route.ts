import { NextResponse } from 'next/server';

type ReviewSeed = {
  id: number;
  category: 'talent' | 'company';
  name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  avatar: string;
  dob?: string;
  experience?: number;
  hometown?: string;
};

export async function GET() {
  const data: ReviewSeed[] = [
    /* ─── Talent ⭐5 ─── */
    { id: 1,  category: 'talent', name: 'Nguyễn Anh', rating: 5, avatar: '/img/atony.jpg',  dob: '1997‑04‑12', experience: 5, hometown: 'Hà Nội' },
    { id: 2,  category: 'talent', name: 'Trần Bình',  rating: 5, avatar: '/img/congphuong.jpg', dob: '1995‑08‑30', experience: 6, hometown: 'Hải Phòng' },
    { id: 3,  category: 'talent', name: 'Phạm Chi',   rating: 5, avatar: '/img/m10.jpg',    dob: '1999‑02‑18', experience: 3, hometown: 'Đà Nẵng' },
    { id: 4,  category: 'talent', name: 'Lê Dũng',    rating: 4, avatar: '/img/toni.jpg',   dob: '1996‑06‑22', experience: 4, hometown: 'Huế' },
    { id: 5,  category: 'talent', name: 'Đoàn Em',    rating: 4, avatar: '/img/kaka.jpg',   dob: '1998‑11‑10', experience: 4, hometown: 'Quảng Nam' },
    { id: 6,  category: 'talent', name: 'Võ Giang',   rating: 4, avatar: '/img/cr7.jpg',    dob: '1994‑03‑03', experience: 7, hometown: 'TP HCM' },
    /* ─── Talent ⭐4 ─── */
    { id: 4,  category: 'talent', name: 'Lê Dũng',    rating: 4, avatar: '/img/toni.jpg',   dob: '1996‑06‑22', experience: 4, hometown: 'Huế' },
    { id: 5,  category: 'talent', name: 'Đoàn Em',    rating: 4, avatar: '/img/kaka.jpg',   dob: '1998‑11‑10', experience: 4, hometown: 'Quảng Nam' },
    { id: 6,  category: 'talent', name: 'Võ Giang',   rating: 4, avatar: '/img/cr7.jpg',    dob: '1994‑03‑03', experience: 7, hometown: 'TP HCM' },

    /* ─── Talent ⭐3 ─── */
    { id: 7,  category: 'talent', name: 'Hồ Hạnh',    rating: 3, avatar: '/img/ava.jpg',    dob: '2000‑09‑15', experience: 2, hometown: 'Cần Thơ' },
    { id: 8,  category: 'talent', name: 'Mai Khoa',   rating: 3, avatar: '/img/ava.jpg',    dob: '1997‑12‑01', experience: 3, hometown: 'Bình Định' },
    { id: 9,  category: 'talent', name: 'Bùi Lâm',    rating: 3, avatar: '/img/ava.jpg',    dob: '1993‑05‑27', experience: 8, hometown: 'Nghệ An' },

    /* ─── Talent ⭐2 ─── */
    { id: 10, category: 'talent', name: 'Ngô Thắng',  rating: 2, avatar: '/img/ava.jpg',    dob: '1998‑10‑05', experience: 2, hometown: 'Phú Thọ' },
    { id: 11, category: 'talent', name: 'Đặng Yến',   rating: 2, avatar: '/img/ava.jpg',    dob: '1997‑11‑22', experience: 3, hometown: 'Quảng Trị' },
    { id: 12, category: 'talent', name: 'Đào Kiên',   rating: 2, avatar: '/img/ava.jpg',    dob: '1994‑01‑17', experience: 4, hometown: 'Hòa Bình' },

    /* ─── Talent ⭐1 ─── */
    { id: 13, category: 'talent', name: 'Lữ Hiếu',    rating: 1, avatar: '/img/ava.jpg',    dob: '1996‑03‑09', experience: 2, hometown: 'Thái Bình' },
    { id: 14, category: 'talent', name: 'Đinh Phú',   rating: 1, avatar: '/img/ava.jpg',    dob: '1995‑06‑02', experience: 3, hometown: 'Gia Lai' },
    { id: 15, category: 'talent', name: 'Trữ Quân',   rating: 1, avatar: '/img/ava.jpg',    dob: '1992‑12‑12', experience: 5, hometown: 'Sóc Trăng' },

    /* ─── Company ⭐5 ─── */
    { id: 101, category: 'company', name: 'Công ty ABC', rating: 5, avatar: '/img/vinground.png' },
    { id: 102, category: 'company', name: 'Công ty MB',  rating: 5, avatar: '/img/mb.png' },
    { id: 103, category: 'company', name: 'Công ty MB',  rating: 5, avatar: '/img/mb.png' },
    { id: 104, category: 'company', name: 'Công ty MB',  rating: 5, avatar: '/img/mb.png' },

    /* ─── Company ⭐4 ─── */
    { id: 105, category: 'company', name: 'Công ty XYZ', rating: 4, avatar: '/img/agri.jpg' },
    { id: 106, category: 'company', name: 'Công ty XYZ', rating: 4, avatar: '/img/agri.jpg' },
    { id: 107, category: 'company', name: 'Công ty XYZ', rating: 4, avatar: '/img/agri.jpg' },
    { id: 108, category: 'company', name: 'Công ty XYZ', rating: 4, avatar: '/img/agri.jpg' },

    /* ─── Company ⭐3 ─── */
    { id: 109, category: 'company', name: 'Công ty DEF', rating: 3, avatar: '/img/thaco.png' },
    { id: 1010, category: 'company', name: 'Công ty DEF', rating: 3, avatar: '/img/thaco.png' },
    { id: 1014, category: 'company', name: 'Công ty DEF', rating: 3, avatar: '/img/thaco.png' },
    { id: 1043, category: 'company', name: 'Công ty DEF', rating: 3, avatar: '/img/thaco.png' },
    { id: 1044, category: 'company', name: 'Công ty DEF', rating: 3, avatar: '/img/thaco.png' },

    /* ─── Company ⭐2 ─── */
    { id: 1005, category: 'company', name: 'Công ty MNO', rating: 2, avatar: '/img/ava.jpg' },
    { id: 1075, category: 'company', name: 'Công ty MNO', rating: 2, avatar: '/img/ava.jpg' },
    { id: 1045, category: 'company', name: 'Công ty MNO', rating: 2, avatar: '/img/ava.jpg' },
    { id: 1025, category: 'company', name: 'Công ty MNO', rating: 2, avatar: '/img/ava.jpg' },
    { id: 1054, category: 'company', name: 'Công ty MNO', rating: 2, avatar: '/img/ava.jpg' },

    /* ─── Company ⭐1 ─── */
    { id: 1096, category: 'company', name: 'Công ty PQR', rating: 1, avatar: '/img/ava.jpg' },
    { id: 1106, category: 'company', name: 'Công ty PQR', rating: 1, avatar: '/img/ava.jpg' },
    { id: 1306, category: 'company', name: 'Công ty PQR', rating: 1, avatar: '/img/ava.jpg' },
    { id: 1026, category: 'company', name: 'Công ty PQR', rating: 1, avatar: '/img/ava.jpg' },
    { id: 1046, category: 'company', name: 'Công ty PQR', rating: 1, avatar: '/img/ava.jpg' },
  ];

  return NextResponse.json({ data });
}
