import { AuthAside } from "@/components/auth/auth-aside";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-svh w-full bg-background">
      <AuthAside />

      <div className="relative flex flex-1 flex-col overflow-y-auto">
        <div className="flex w-full flex-1 justify-center px-4 py-10 sm:px-8 sm:py-14 lg:px-12">
          <div className="my-auto w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
