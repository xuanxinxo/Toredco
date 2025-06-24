import { serverCookieHelper } from "@/src/lib/cookieHelper";
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  serverCookieHelper.deleteTokenFromResponse(response);
  return response;
}
