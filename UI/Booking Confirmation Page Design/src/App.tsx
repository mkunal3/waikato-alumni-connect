import React from 'react';
import { CheckCircle, Calendar, Download, Clock, Video, MapPin, FileText } from 'lucide-react';
import waikatoLogo from 'figma:asset/db2e9e04f65d3b029ee3458fee7925cd0a8c7f70.png';

export default function App() {
  const confirmationDetails = {
    mentor: {
      name: "Dr. Sarah Thompson",
      role: "Senior Software Engineer",
      company: "Microsoft New Zealand",
      photo: "https://images.unsplash.com/photo-1738750908048-14200459c3c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtZW50b3IlMjBidXNpbmVzcyUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDEwNjMyNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    session: {
      date: "Thursday, March 14, 2024",
      time: "2:00 PM - 2:45 PM",
      type: "Career Mentoring",
      location: "Online (Microsoft Teams)",
      duration: "45 minutes"
    }
  };

  const preparationTips = [
    "Prepare 2–3 questions for your mentor.",
    "Join 5 minutes early.",
    "Bring a notebook or laptop."
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header with Logo */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <img src={waikatoLogo} alt="University of Waikato" className="h-12 sm:h-16" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Banner */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" strokeWidth={2.5} />
          </div>
          <h1 className="text-gray-900 mb-3">Your Session is Confirmed!</h1>
          <p className="text-gray-600">You will receive a confirmation email shortly.</p>
        </div>

        {/* Confirmation Summary Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Mentor Photo */}
            <div className="flex-shrink-0">
              <img
                src={confirmationDetails.mentor.photo}
                alt={confirmationDetails.mentor.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
              />
            </div>

            {/* Mentor Info */}
            <div className="flex-1">
              <h2 className="text-gray-900 mb-2">{confirmationDetails.mentor.name}</h2>
              <p className="text-gray-600 mb-1">{confirmationDetails.mentor.role}</p>
              <p className="text-gray-500">{confirmationDetails.mentor.company}</p>
            </div>
          </div>

          <div className="h-px bg-gray-200 my-6"></div>

          {/* Session Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Date */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Date</p>
                <p className="text-gray-900">{confirmationDetails.session.date}</p>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Time</p>
                <p className="text-gray-900">{confirmationDetails.session.time}</p>
              </div>
            </div>

            {/* Session Type */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Session Type</p>
                <p className="text-gray-900">{confirmationDetails.session.type}</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Video className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Location</p>
                <p className="text-gray-900">{confirmationDetails.session.location}</p>
                <p className="text-gray-500 text-sm mt-1">Duration: {confirmationDetails.session.duration}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Reminder Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-gray-900 mb-4">Add to Calendar</h3>
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#0078D4] text-white rounded-lg hover:bg-[#106EBE] transition-colors">
              <Calendar className="w-4 h-4" />
              Outlook
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Calendar className="w-4 h-4" />
              Google Calendar
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Calendar className="w-4 h-4" />
              Apple Calendar
            </button>
          </div>
        </div>

        {/* Preparation Tips Section */}
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 mb-8">
          <h3 className="text-gray-900 mb-4">Preparation Tips</h3>
          <ul className="space-y-3">
            {preparationTips.map((tip, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm mt-0.5">
                  {index + 1}
                </div>
                <p className="text-gray-700">{tip}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Actions Section */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <button className="w-full sm:w-auto px-6 py-3 bg-white border-2 border-[#D50000] text-[#D50000] rounded-lg hover:bg-[#D50000] hover:text-white transition-colors">
            Reschedule Session
          </button>
          <button className="w-full sm:w-auto px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors">
            Cancel Session
          </button>
        </div>

        {/* Homepage Link */}
        <div className="text-center">
          <a href="/" className="text-[#D50000] hover:underline">
            Back to Dashboard
          </a>
        </div>
      </main>
    </div>
  );
}