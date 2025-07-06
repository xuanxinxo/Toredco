// Marquee.tsx
export default function Marquee() {
  return (
    <div className="w-full overflow-hidden bg-blue-600 h-20 sm:h-24 flex items-center border-y-2 border-blue-700">
      <p className="whitespace-nowrap animate-marquee pause-on-hover text-xl sm:text-2xl font-semibold text-white tracking-wide">
        🚀 Tìm việc dễ dàng, ứng tuyển chỉ với 1 cú click! &nbsp;&nbsp;&nbsp; 💼
        Kết nối nhanh với nhà tuyển dụng uy tín! &nbsp;&nbsp;&nbsp; 📌 Việc làm
        mơ ước không còn xa – Khám phá ngay!
      </p>
    </div>
  );
}
