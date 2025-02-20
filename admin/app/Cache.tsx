/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Modal } from './Admin';
import { cacheBootstrap, cacheBootstrapReset, cacheSelectiveReset } from './lib/cacheBootstrap';
import { toast } from 'sonner';
import {
  ArrowRight,
  DatabaseBackup,
  DatabaseZap,
  ListRestart,
  Loader2,
  SquareStack,
} from 'lucide-react';
import { cacheGetAll } from './lib/cacheBootstrap';

const Cache = () => {
  const [isCacheBootstrapModelOpen, setIsCacheBootStrapModelOpen] = useState(false);
  const [isCacheResetModelOpen, setIsCacheResetModelOpen] = useState(false);
  const [isSeletiveCacheResetModelOpen, setIsSelectiveCacheResetModelOpen] = useState(false);
  const [cache, setCache] = useState<any>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDisableProd,setisDisableProd] = useState(false);
  const toggleSelection = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id],
    );
  };

  useEffect(() => {
    fetchCache();
  }, []);

  const fetchCache = async () => {
    setIsLoading(true);
    try {
      const response = await cacheGetAll();
      if (response?.cache_results?.length > 0) {
        setCache(response.cache_results);
        toast.success('Cache Fetched');
      } else {
        toast.error('No Cache Found');
        setCache([]);
      }
    } catch (error) {
      console.error('Error while fetching Cache', error);
      toast.error('Error while fetching Cache');
      setCache([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCacheSelectiveReset = async (cache_ids: number[]) => {
    setIsProcessing(true);
    try {
      const response = await cacheSelectiveReset(cache_ids);
      if (response.message) {
        toast.success(response.message);
        await fetchCache(); // Refresh the cache list
        setSelectedIds([]); // Clear selections after successful reset
      } else {
        toast.error('Error while Cache Bootstrap', response);
      }
      setIsSelectiveCacheResetModelOpen(false);
    } catch (error) {
      console.error('Error while selective cache', error);
      toast.error('Error while selective cache');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCacheBoostrap = async () => {
    setIsProcessing(true);
    try {
      const response = await cacheBootstrap();
      if (response.message) {
        toast.success(response.message);
        await fetchCache(); // Refresh after bootstrap
      } else {
        toast.error('Error while Cache Bootstrap');
      }
      setIsCacheBootStrapModelOpen(false);
    } catch (error) {
      console.error('Error while Cache Bootstrap', error);
      toast.error('Error while Cache Bootstrap');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCacheReset = async () => {
    setIsProcessing(true);
    try {
      const response = await cacheBootstrapReset();
      if (response.message) {
        toast.success(response.message);
        await fetchCache();
      } else {
        toast.error('Error while Cache Reset');
        await fetchCache();
      }
      setIsCacheResetModelOpen(false);
    } catch (error) {
      console.error('Error while Cache Reset', error);
      toast.error('Error while Cache reset');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 space-y-6 rounded-xl mb-10 shadow-md bg-light-primary dark:bg-dark-primary text-black dark:text-white">
      <h2 className="text-3xl font-bold border-b border-gray-300 dark:border-gray-700 pb-2 w-full relative">
        Data Insights{' '}
        <span className="text-red-600 text-xs font-normal px-1 absolute right-0 mt-4">
          * Please be cautious this action cannot be undone.
        </span>
      </h2>

      <ul className="space-y-4">
        {isDisableProd && <li className="flex items-center justify-between bg-light-primary dark:bg-dark-primary p-4 rounded-lg shadow">
          <span className="text-md font-medium flex flex-1 gap-1">
            <DatabaseZap size={20} /> Cache Bootstrap
          </span>
          <button
            onClick={() => setIsCacheBootStrapModelOpen(true)}
            disabled={isProcessing}
            className="px-2 py-2 text-white font-semibold bg-blue-500 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors rounded-lg shadow-md"
          >
            {isProcessing ? <Loader2 className="animate-spin" /> : <ArrowRight />}
          </button>
        </li>}
        {isDisableProd && <li className="flex items-center justify-between bg-light-primary dark:bg-dark-primary p-4 rounded-lg shadow">
          <span className="text-md font-medium flex flex-1 gap-1">
            <DatabaseBackup size={20} /> Cache Reset
          </span>
          <button
            onClick={() => setIsCacheResetModelOpen(true)}
            disabled={isProcessing}
            className="px-2 py-2 text-white font-semibold bg-blue-500 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors rounded-lg shadow-md"
          >
            {isProcessing ? <Loader2 className="animate-spin" /> : <ArrowRight />}
          </button>
        </li>}
      </ul>

      <div className="flex items-center space-y-0 justify-between bg-light-primary dark:bg-dark-primary p-4 rounded-lg shadow">
        <div className="flex items-center gap-4">
          <span className="text-md font-medium flex items-center gap-1">
            <SquareStack size={20} />
            Cache Selective Reset
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({cache.length} Questions • {selectedIds.length} Selected)
          </span>
        </div>

        <button
          onClick={() => setIsSelectiveCacheResetModelOpen(true)}
          disabled={selectedIds.length <= 0 || isProcessing}
          className="px-2 py-2 text-white font-semibold bg-blue-500 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors rounded-lg shadow-md"
        >
          {isProcessing ? <Loader2 className="animate-spin" /> : <ArrowRight />}
        </button>
      </div>

      <div className="bg-light-primary dark:bg-dark-primary p-4 top-[-4] rounded-lg shadow space-y-0">
        <div className="w-full flex justify-end items-center mb-5">
          <button
            onClick={() => setSelectedIds([])}
            disabled={selectedIds.length === 0}
            className="px-2 py-2 text-white font-semibold bg-blue-500 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors rounded-lg shadow-md"
          >
            <span className="text-xs font-medium flex items-center gap-1">
              <ListRestart size={15} /> Clear Selected
            </span>
          </button>
        </div>
        
        <div className="relative overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-300 dark:divide-dark-100">
                <thead className="bg-light-primary dark:bg-dark-primary sticky top-0 z-10">
                  <tr>
                    <th className="w-8 px-6 py-3 text-left">
                      <span className="sr-only">Select</span>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Index
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Question
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-light-primary min-h-10 dark:bg-dark-primary divide-y divide-gray-200 dark:divide-gray-700">
                  {cache.map((c: any, index: number) => (
                    <tr
                      key={c.cache_id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(c.cache_id)}
                          onChange={() => toggleSelection(c.cache_id)}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                        {c.user_query}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modals remain the same */}
      <Modal
        isOpen={isCacheBootstrapModelOpen}
        onClose={() => setIsCacheBootStrapModelOpen(false)}
        title="Confirm Bootstrap"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to bootstrap the cache?
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsCacheBootStrapModelOpen(false)}
              className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 dark:border-gray-500 dark:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => handleCacheBoostrap()}
              disabled={isProcessing}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Processing...
                </>
              ) : (
                'Continue'
              )}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isCacheResetModelOpen}
        onClose={() => setIsCacheResetModelOpen(false)}
        title="Confirm Reset"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to reset the cache?
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsCacheResetModelOpen(false)}
              className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 dark:border-gray-500 dark:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => handleCacheReset()}
              disabled={isProcessing}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Processing...
                </>
              ) : (
                'Continue'
              )}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isSeletiveCacheResetModelOpen}
        onClose={() => setIsSelectiveCacheResetModelOpen(false)}
        title="Confirm Reset"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to reset these items?
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Selected IDs: {selectedIds.join(', ')}
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsSelectiveCacheResetModelOpen(false)}
              className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 dark:border-gray-500 dark:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => handleCacheSelectiveReset(selectedIds)}
              disabled={isProcessing}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Processing...
                </>
              ) : (
                'Continue'
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Cache;