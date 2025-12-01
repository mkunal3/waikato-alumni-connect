import { FileText, Download } from 'lucide-react';

const resources = [
  { title: 'Data Science Roadmap', type: 'PDF', size: '2.4 MB' },
  { title: 'Resume Template', type: 'DOCX', size: '156 KB' },
  { title: 'Beginner ML Projects Guide', type: 'PDF', size: '1.8 MB' },
];

export function ResourcesCard() {
  return (
    <div className="bg-white rounded-[16px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
      <h3 className="text-gray-900 mb-5">Downloadable Resources</h3>
      
      <div className="space-y-3">
        {resources.map((resource, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between p-4 bg-gray-50 rounded-[12px] hover:bg-red-50 hover:border-[#D50000] border border-transparent transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-500 group-hover:text-[#D50000]" />
              <div>
                <p className="text-gray-900 text-sm group-hover:text-[#D50000]">{resource.title}</p>
                <p className="text-gray-500 text-xs">{resource.type} · {resource.size}</p>
              </div>
            </div>
            <Download className="w-4 h-4 text-gray-400 group-hover:text-[#D50000]" />
          </div>
        ))}
      </div>
    </div>
  );
}
