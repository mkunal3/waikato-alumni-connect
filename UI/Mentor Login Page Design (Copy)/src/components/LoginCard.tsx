import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export function LoginCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [staySignedIn, setStaySignedIn] = useState(false);

  return (
    <div className="w-full max-w-[480px] bg-white rounded-xl p-10 shadow-[0_2px_6px_rgba(0,0,0,0.1)]">
      {/* Heading */}
      <div className="mb-2">
        <h1 className="text-black">Mentor Login</h1>
        <p className="text-gray-600 mt-1">Takiuru Kaitohutohu</p>
      </div>

      {/* Subtitle */}
      <div className="mt-4 mb-8">
        <p className="text-gray-600">
          Access your mentor dashboard, manage sessions, and connect with students.
        </p>
        <p className="text-gray-500 mt-1.5">
          Whakauru atu ki tō papatohu kaitohutohu, whakahaere hui, me te hono ki ngā ākonga.
        </p>
      </div>

      {/* Form */}
      <form className="space-y-6">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-gray-900 mb-2">
            Email Address / Wāhitau Īmēra
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email / Tuhia tō īmēra"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D50000] focus:border-transparent transition-all"
          />
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-gray-900 mb-2">
            Password / Kupuhipa
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password / Tuhia tō kupuhipa"
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D50000] focus:border-transparent transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Checkbox and Link Row */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={staySignedIn}
              onChange={(e) => setStaySignedIn(e.target.checked)}
              className="w-4 h-4 accent-[#D50000] cursor-pointer"
            />
            <span className="text-gray-700">Stay signed in / Me noho takiuru tonu au</span>
          </label>
        </div>

        <div className="text-right">
          <a href="#" className="text-[#D50000] hover:text-[#B71C1C] transition-colors">
            Forgot password? / Wareware te kupuhipa?
          </a>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full py-3.5 rounded-lg text-white font-medium transition-all hover:shadow-[0_2px_6px_rgba(0,0,0,0.2)] hover:bg-[#B71C1C]"
          style={{ backgroundColor: '#D50000' }}
        >
          <div>Login / Takiuru</div>
        </button>

        {/* Register Link */}
        <div className="text-center pt-2">
          <p className="text-gray-600">
            Don't have a mentor account? / Kāore anō koe kia whai pūkete kaitohutohu?
          </p>
          <a href="#" className="text-[#D50000] hover:text-[#B71C1C] transition-colors inline-block mt-1">
            Register as a Mentor / Rēhita hei Kaitohutohu
          </a>
        </div>
      </form>
    </div>
  );
}
