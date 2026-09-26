import Navbar from "@/component/navbar/page";

export default function MainLayout({ children }: LayoutProps<"/">) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}
