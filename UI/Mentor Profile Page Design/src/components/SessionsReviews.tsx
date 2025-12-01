import { Star, Calendar } from 'lucide-react';

interface Session {
  title: string;
  date: string;
  rating: number;
}

interface Review {
  name: string;
  comment: string;
  image: string;
  rating: number;
}

interface SessionsReviewsProps {
  studentImage1: string;
  studentImage2: string;
}

const sessions: Session[] = [
  { title: 'Career Roadmap Discussion', date: 'Nov 2025', rating: 5 },
  { title: 'Resume Review for Cloud Jobs', date: 'Nov 2025', rating: 5 },
  { title: 'Mock Technical Interview', date: 'Oct 2025', rating: 5 },
];

export function SessionsReviews({ studentImage1, studentImage2 }: SessionsReviewsProps) {
  const reviews: Review[] = [
    { 
      name: 'Neeraj Sharma', 
      comment: 'Very helpful session! Dr. Kapadia provided excellent guidance on my career transition into data science.', 
      image: studentImage1,
      rating: 5 
    },
    { 
      name: 'Aman Gupta', 
      comment: 'Got amazing guidance. The mock interview preparation helped me land my dream job at a tech company!', 
      image: studentImage2,
      rating: 5 
    },
  ];

  return (
    <div className="bg-white rounded-[16px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
      <h2 className="text-gray-900 mb-6">Past Sessions & Reviews</h2>
      
      {/* Sessions List */}
      <div className="mb-8 space-y-3">
        {sessions.map((session, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-[12px] hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#D50000]" />
              <div>
                <p className="text-gray-900">{session.title}</p>
                <p className="text-gray-500 text-sm">{session.date}</p>
              </div>
            </div>
            <div className="flex gap-1">
              {[...Array(session.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#D50000] text-[#D50000]" />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        <h3 className="text-gray-900">Student Reviews</h3>
        {reviews.map((review, index) => (
          <div key={index} className="p-5 bg-gray-50 rounded-[12px]">
            <div className="flex items-start gap-4">
              <img 
                src={review.image} 
                alt={review.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-900">{review.name}</p>
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#D50000] text-[#D50000]" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{review.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
