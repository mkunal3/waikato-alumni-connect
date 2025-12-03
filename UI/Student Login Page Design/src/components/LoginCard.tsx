import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function LoginCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempted with:', { email, password });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
      {/* Left side - Login form */}
      <div className="flex flex-col justify-center" style={{ padding: '32px' }}>
        <h1 className="mb-2">Student Login</h1>
        <p className="text-gray-600 mb-8">
          Access your student portal
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
              placeholder="student@waikato.ac.nz"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Login
          </button>

          <div className="text-center">
            <a href="#" className="text-red-600 hover:text-red-700 transition-colors">
              Create student account
            </a>
          </div>

          <div className="text-center">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Forgot password?
            </a>
          </div>
        </form>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden lg:flex items-center justify-center bg-gray-50 rounded-xl p-8">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1588912914049-d2664f76a947?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwbGVhcm5pbmclMjBpbGx1c3RyYXRpb258ZW58MXx8fHwxNzY0MTA0MzYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Student learning illustration"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
    </div>
  );
}
