import { serverCookieHelper } from "@/src/lib/cookieHelper";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({ success: true });
    serverCookieHelper.deleteTokenFromResponse(response);
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, message: "Đăng xuất thất bại" },
      { status: 500 }
    );
  }
}
