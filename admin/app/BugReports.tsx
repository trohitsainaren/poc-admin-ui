/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Eye, X, Image } from 'lucide-react';

interface Response {
  chat_id: number;
  agent_type: string;
  bug_type: string[];
  context: string[];
  description: string;
  file: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />
        <div className="relative w-full max-w-4xl rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

const Badge: React.FC<{ children: React.ReactNode; variant?: 'primary' | 'secondary' }> = ({ 
  children, 
  variant = 'primary' 
}) => (
  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
    ${variant === 'primary' 
      ? 'bg-blue-100 text-gray-800 dark:bg-blue-700 dark:text-blue-300'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
    {children}
  </span>
);

const BugReports = () => {
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);
  const [selectedResponse, setSelectedResponse] = useState<Response | null>(null);
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);


  const fallbackData: Response[] = [
    {
      chat_id: 998392,
      agent_type: "study",
      bug_type: ["functional issue", "performance issue"],
      context: ["answer", "graph", "podcasts"],
      description: "Example description",
      file: ``
    },
    {
      chat_id: 998393,
      agent_type: "study",
      bug_type: ["ui/ux issue", "compatibility issue"],
      context: ["courses", "sources", "other"],
      description: "Another example description",
      file: ``
    }
  ];

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await fetch('/api/responses');
        
        if (!response.ok) {
          throw new Error('Failed to fetch responses');
        }

        const data = await response.json();
        setResponses(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching responses:', err);
        setError('Failed to load responses. Showing sample data instead.');
        setResponses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, []);

  const handleFilePreview = (file: string) => {
    console.log(file);
    setSelectedFile(file);
    setShowFilePreview(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (responses.length === 0) {
    return (
      <div className="relative mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-black dark:text-white">
        Coming Soon..
      </h2>
    </div>
    );
  } 

  return (
  
    <div className="p-4">
    
      (responses.length === 0)  ? (
        <div className="relative mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-black dark:text-white">
        Coming Soon..
      </h2>
    </div>
      ) : (   
      <div className="bg-light-secondary dark:bg-dark-secondary rounded-lg shadow overflow-hidden border border-gray-300 dark:border-gray-800 ">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-200">
            <thead className="bg-gray-50 dark:bg-dark-primary/80">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Chat ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Agent Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Bug Types
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Context
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-primary/50 divide-y divide-gray-300 dark:divide-gray-600">
              {responses.map((response, index) => (
                <tr 
                  key={index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                    {response.chat_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                    {response.agent_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {response.bug_type.slice(0, 2).map((bug, i) => (
                        <Badge key={i} variant='secondary'>{bug}</Badge>
                      ))}
                      {response.bug_type.length > 2 && (
                        <Badge variant='secondary'>+{response.bug_type.length - 2}</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {response.context.slice(0, 2).map((ctx, i) => (
                        <Badge key={i} variant="secondary">{ctx}</Badge>
                      ))}
                      {response.context.length > 2 && (
                        <Badge variant="secondary">+{response.context.length - 2}</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedResponse(response)}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>)


      <Modal
        isOpen={!!selectedResponse}
        onClose={() => setSelectedResponse(null)}
        title="Response Details"
      >
        {selectedResponse && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Chat ID
                </h4>
                <p className="text-gray-900 dark:text-gray-100">
                  {selectedResponse.chat_id}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Agent Type
                </h4>
                <p className="text-gray-900 dark:text-gray-100">
                  {selectedResponse.agent_type}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Bug Types
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedResponse.bug_type.map((bug, index) => (
                  <Badge key={index}>{bug}</Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Context
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedResponse.context.map((ctx, index) => (
                  <Badge key={index} variant="secondary">{ctx}</Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Description
              </h4>
              <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                {selectedResponse.description}
              </p>
            </div>

            {selectedResponse.file && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  File
                </h4>
                <button
                  onClick={() => handleFilePreview(selectedResponse.file)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                >
                  <Image className="h-4 w-4" />
                  <span>View File</span>
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* File Preview Modal */}
      <Modal
        isOpen={showFilePreview}
        onClose={() => setShowFilePreview(false)}
        title="File Preview"
      >
        {selectedFile && (
          <div className="flex justify-center">
            <img 
              src={`data:image/png;base64,${selectedFile}`}
              alt="Preview"
              className="max-h-[70vh] w-auto"
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BugReports;