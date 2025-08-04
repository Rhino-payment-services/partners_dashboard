import SideBar from "@/components/SideBar";




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-row">
      <div className="w-1/6 bg-red-500">
        <SideBar />
      </div>
      <div className="w-5/6">
        {children}
      </div>
    </div>
  );
}
