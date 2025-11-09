function AttributesTab({ attributes }) {
  if (!attributes || Object.keys(attributes).length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No attributes available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(attributes).map(([key, value]) => {        
        return (
          <div key={key} className="border-b border-gray-100 pb-4 last:border-b-0">
            <div className="flex">
              <div className="w-1/3">
                <span className="text-sm font-semibold text-gray-700">{key}</span>
              </div>
              <div className="w-2/3">
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{String(value)}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default AttributesTab;

