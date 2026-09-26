import Navbar from "@/component/admin/navbar/page";


export default function MainLayout({ children }: LayoutProps<"/">) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}
