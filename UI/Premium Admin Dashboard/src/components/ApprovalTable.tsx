import { Eye, CheckCircle, XCircle } from 'lucide-react';

interface Applicant {
  name: string;
  role: 'Mentor' | 'Student';
  email: string;
  submittedOn: string;
}

export function ApprovalTable() {
  const applicants: Applicant[] = [
    {
      name: 'Sarah Johnson',
      role: 'Mentor',
      email: 'sarah.j@waikato.ac.nz',
      submittedOn: 'Nov 22, 2025'
    },
    {
      name: 'Michael Chen',
      role: 'Student',
      email: 'michael.chen@gmail.com',
      submittedOn: 'Nov 23, 2025'
    },
    {
      name: 'Emma Williams',
      role: 'Mentor',
      email: 'e.williams@waikato.ac.nz',
      submittedOn: 'Nov 23, 2025'
    },
    {
      name: 'James Taylor',
      role: 'Student',
      email: 'james.t@student.waikato.ac.nz',
      submittedOn: 'Nov 24, 2025'
    },
    {
      name: 'Olivia Brown',
      role: 'Mentor',
      email: 'olivia.brown@alumni.waikato.ac.nz',
      submittedOn: 'Nov 24, 2025'
    },
    {
      name: 'Daniel Martinez',
      role: 'Student',
      email: 'd.martinez@student.waikato.ac.nz',
      submittedOn: 'Nov 25, 2025'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl">Pending Registrations</h2>
        <p className="text-sm text-gray-500 mt-1">Review and approve new user applications</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs text-gray-600">Name</th>
              <th className="px-6 py-3 text-left text-xs text-gray-600">Role</th>
              <th className="px-6 py-3 text-left text-xs text-gray-600">Email</th>
              <th className="px-6 py-3 text-left text-xs text-gray-600">Submitted On</th>
              <th className="px-6 py-3 text-center text-xs text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((applicant, index) => (
              <tr 
                key={index} 
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                }`}
              >
                <td className="px-6 py-4">{applicant.name}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${
                    applicant.role === 'Mentor'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {applicant.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600 text-sm">{applicant.email}</td>
                <td className="px-6 py-4 text-gray-600 text-sm">{applicant.submittedOn}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-green-50 rounded-lg transition-colors text-green-600">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600">
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
