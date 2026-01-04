import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Your App Name',
  description: 'App Description',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Toaster 
          position="top-center" 
          reverseOrder={false}
          // Tailwind classes use karke z-index aur spacing set ki hai
          containerClassName="z-[99999] mt-4" 
          toastOptions={{
            duration: 4000,
            // Toast ki internal styling Tailwind utility classes se control karein
            className: "bg-white text-slate-700 font-bold rounded-2xl border border-slate-100 shadow-2xl p-4",
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        
        {children}
      </body>
    </html>
  );
}