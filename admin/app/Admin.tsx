import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Pencil,
  Trash,
  Search,
  ChevronDown,
  X,
  ChevronLeft,
  ChevronRight,

  
} from 'lucide-react';
import {
  getAllSeedQuestions,
  createSeedQuestion,
  updateSeedQuestion,
  deleteSeedQuestions,
} from './lib/getSeedQuestions';
import { toast } from 'sonner';

interface ApiResponse {
  seed_questions: SeedQuestion[];
  page: number;
  per_page: number;
  total_pages: number;
  total_records: number;
}

interface SeedQuestion {
  id: string;
  question: string;
  tenant_id?: string;
  agent_type: string;
  created_at: string;
  modified_at?: string;
}

const AGENT_TYPE_MAPPING = {
  'Study Agent': 'study',
  'Insights Agent': 'insights',
  // 'SecOps Agent': 'secops',
  'Demo Agent': 'demo',
} as const;



type AgentType = keyof typeof AGENT_TYPE_MAPPING;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-light-primary dark:bg-dark-secondary rounded-lg w-full max-w-md p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold dark:text-white">{title}</h2>
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
  );
};

const DEFAULT_PER_PAGE = 5;
const DEBOUNCE_DELAY = 300;

const Admin = () => {
  const [selectedAgentType, setSelectedAgentType] =
    useState<AgentType>('Study Agent');
  const [searchQuery, setSearchQuery] = useState('');
  const [questions, setQuestions] = useState<SeedQuestion[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<SeedQuestion | null>(
    null,
  );
  const [deletingQuestion, setDeletingQuestion] = useState<SeedQuestion | null>(
    null,
  );
  const [newQuestion, setNewQuestion] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const fetchQuestions = async (
    page: number,
    itemsPerPage: number,
    query: string,
  ) => {
    setIsLoading(true);
    try {
      const apiAgentType = AGENT_TYPE_MAPPING[selectedAgentType].toLowerCase();
      const response = await getAllSeedQuestions(
        apiAgentType,
        page,
        itemsPerPage,
        query,
      );
      const data = response as ApiResponse;

      setQuestions(data.seed_questions);
      setTotalPages(data.total_pages);
      setCurrentPage(data.page);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to fetch questions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchQuestions(currentPage, perPage, searchQuery);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [selectedAgentType, searchQuery, currentPage, perPage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAdd = async () => {
    if (!newQuestion.trim()) {
      toast.error('Please enter a valid question');
      return;
    }

    try {
      const apiAgentType = AGENT_TYPE_MAPPING[selectedAgentType];
      await createSeedQuestion(apiAgentType, newQuestion.trim());
      toast.success('Question added successfully');
      setIsAddModalOpen(false);
      setNewQuestion('');
      fetchQuestions(1, perPage, searchQuery);
    } catch (error) {
      console.error('Error creating question:', error);
      toast.error('Failed to add question');
    }
  };

  const handleUpdate = async () => {
    if (!editingQuestion?.question.trim()) {
      toast.error('Please enter a valid question');
      return;
    }

    try {
      const apiAgentType = AGENT_TYPE_MAPPING[selectedAgentType];
      await updateSeedQuestion(
        apiAgentType,
        editingQuestion.question,
        editingQuestion.id,
      );
      toast.success('Question updated successfully');
      setIsEditModalOpen(false);
      setEditingQuestion(null);
      fetchQuestions(currentPage, perPage, searchQuery);
    } catch (error) {
      console.error('Error updating question:', error);
      toast.error('Failed to update question');
    }
  };

  const handleDelete = async () => {
    const apiAgentType = AGENT_TYPE_MAPPING[selectedAgentType];
    if (!deletingQuestion?.question.trim()) {
      toast.error('Please enter a valid question');
      return;
    }
    try {
      await deleteSeedQuestions(apiAgentType, deletingQuestion.id);
      toast.success('Question deleted sucessfully');
      setIsDeleteModalOpen(false);
      setDeletingQuestion(null);
      fetchQuestions(currentPage, perPage, searchQuery);
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Failed to delete question');
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  const agentTypes = Object.keys(AGENT_TYPE_MAPPING) as AgentType[];

  return (
    <div className="p-6 space-y-6 bg-light-primary dark:bg-dark-secondary text-black dark:text-white">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center rounded-md">
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-between w-48 px-4 py-2 text-sm border rounded-md bg-light-primary dark:bg-dark-primary border-gray-300 dark:border-gray-600 dark:text-white"
          >
            {selectedAgentType}
            <ChevronDown className="h-4 w-4 ml-2" />
          </button>
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute w-48 mt-1 bg-light-primary dark:bg-dark-primary rounded-md z-50 border border-gray-300 dark:border-gray-600"
            >
              {agentTypes.map((type) => (
                <div
                  key={type}
                  className="px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white cursor-pointer"
                  onClick={() => {
                    setSelectedAgentType(type);
                    setIsDropdownOpen(false);
                    setSearchQuery('');
                    setCurrentPage(1);
                    setPerPage(5);
                  }}
                >
                  {type}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full sm:w-64 border rounded-md dark:bg-dark-primary dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            New
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-300 dark:border-gray-800">
        <table className="min-w-full divide-y divide-gray-300 dark:divide-dark-100">
          <thead className="bg-light-primary/80 dark:bg-dark-primary/80">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Question
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-24">
                Actions
              </th>
            </tr>
          </thead>
          {isLoading ? (
            <div className="h-20 p-3 flex items-center justify-center">
             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 dark:border-blue-400" />
            </div>
          ) : (
            <tbody className="bg-light-primary/50 dark:bg-dark-primary/50 divide-y divide-gray-300 dark:divide-gray-600">
              {(questions || [])
                .sort((a, b) => {
                  // Safely handle undefined modified_at
                  const getModifiedTime = (item: { modified_at?: string }) =>
                    item.modified_at ? new Date(item.modified_at).getTime() : 0;

                  return getModifiedTime(b) - getModifiedTime(a);
                })
                .map((question) => (
                  <tr
                    key={question.id}
                    className="hover:bg-gray-50 dark:hover:bg-dark-primary/40"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                      {question.question}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingQuestion(question);
                            setIsEditModalOpen(true);
                          }}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDeletingQuestion(question);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          )}
        </table>
        <div className="flex items-center justify-between px-6 py-3 bg-light-primary dark:bg-dark-primary border-t border-gray-300 dark:border-gray-700">
          <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
            <span>
              Page {currentPage} of {totalPages}
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <p>Per Page:</p>
            <select
              value={perPage}
              onChange={(e) => handlePerPageChange(Number(e.target.value))}
              className="dark:bg-dark-primary dark:text-white border-gray-300 dark:border-gray-600 rounded-md p-2"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
            </select>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-2 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-2 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Question"
      >
        <div className="space-y-4">
          <textarea
            value={newQuestion}
            onChange={(e) => {
              if (e.target.value.length <= 160) {
                setNewQuestion(e.target.value);
              }
            }}
            placeholder="Enter your question... (Max 160 characters)"
            className="w-full px-3 py-2 border rounded-md dark:bg-dark-primary bg-light-primary dark:border-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            maxLength={160}
          />
          <div className="text-right text-sm text-gray-500 dark:text-gray-400">
            {newQuestion.length}/160 characters
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-500 dark:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={newQuestion.trim().length === 0}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingQuestion(null);
        }}
        title="Edit Question"
      >
        <div className="space-y-4">
          <textarea
            value={editingQuestion?.question || ''}
            onChange={(e) =>
              setEditingQuestion((prev) => {
                if (e.target.value.length <= 160) {
                  return prev ? { ...prev, question: e.target.value } : null;
                }
                return prev;
              })
            }
            placeholder="Enter your question... (Max 160 characters)"
            className="w-full px-3 py-2 border rounded-md dark:bg-dark-primary bg-light-primary dark:border-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            maxLength={160}
          />
          <div className="text-right text-sm text-gray-500 dark:text-gray-400">
            {editingQuestion?.question.length || 0}/160 characters
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingQuestion(null);
              }}
              className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 dark:border-gray-500 dark:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={!editingQuestion?.question.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingQuestion(null);
        }}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete this question? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setDeletingQuestion(null);
              }}
              className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 dark:border-gray-500 dark:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // TODO: Implement delete functionality
                setIsDeleteModalOpen(false);
                setDeletingQuestion(null);
                handleDelete();
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Admin;
