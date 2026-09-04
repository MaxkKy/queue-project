import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
export async function POST() {
  // const cookie = await cookies();
  // cookie.delete("token")
  const response = NextResponse.json({ message: "Log Out Success" });
  response.cookies.delete("token")
  return response;
}
