import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LoginCard } from './components/LoginCard';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F7F7F7' }}>
      <Header />
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[1440px]">
          <LoginCard />
        </div>
      </main>
      <Footer />
    </div>
  );
}
