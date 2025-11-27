import { useState, useEffect } from 'react';
import { fetchWorkflowStats } from '../services/api';

function Workflows() {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadWorkflows = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWorkflowStats();
      setWorkflows(data);
    } catch (err) {
      setError(err.message || 'Failed to load workflows');
      console.error('Error loading workflows:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkflows();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading workflows...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 font-semibold mb-2">Error Loading Workflows</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadWorkflows}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (workflows.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 text-lg">No workflows found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full px-1 py-8">
      <div className="mb-6 flex justify-between items-center px-2">
        <h1 className="text-3xl font-bold text-gray-800">Workflows</h1>
        <button
          onClick={loadWorkflows}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-3">
        {workflows.map((workflow) => {
          const workflowUrl = `https://n8n.bizaudit.site/workflow/${workflow.workflow_id}`;
          const tags = workflow.workflow_tags || [];

          return (
            <div
              key={workflow.workflow_id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-800 mb-1">
                      <a
                        href={workflowUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 hover:underline"
                      >
                        {workflow.workflow_name || 'Unnamed Workflow'}
                      </a>
                    </h2>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">ID:</span>{' '}
                      <a
                        href={workflowUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 hover:underline font-mono"
                      >
                        {workflow.workflow_id}
                      </a>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-2xl font-bold ${
                        workflow.running
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {workflow.running ? 'Running' : 'Not Running'}
                    </span>
                  </div>
                </div>

                {tags.length > 0 && (
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-sm text-gray-600 px-2">
        Showing {workflows.length} workflow{workflows.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}

export default Workflows;

