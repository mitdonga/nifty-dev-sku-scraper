function CustomAttributesTab({ customAttributes }) {
  if (!customAttributes || Object.keys(customAttributes).length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No custom attributes available
      </div>
    );
  }

  const formatObjectToText = (obj, indent = 0) => {
    const indentStr = '  '.repeat(indent);
    const lines = [];

    Object.entries(obj).forEach(([key, val]) => {
      if (val === null || val === undefined) {
        lines.push(`${indentStr}${key}: null`);
      } else if (Array.isArray(val)) {
        if (val.length === 0) {
          lines.push(`${indentStr}${key}: []`);
        } else {
          lines.push(`${indentStr}${key}:`);
          val.forEach((item, index) => {
            if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
              lines.push(`${indentStr}  [${index}]:`);
              lines.push(formatObjectToText(item, indent + 2));
            } else if (Array.isArray(item)) {
              lines.push(`${indentStr}  [${index}]: [${item.join(', ')}]`);
            } else {
              lines.push(`${indentStr}  • ${String(item)}`);
            }
          });
        }
      } else if (typeof val === 'object') {
        lines.push(`${indentStr}${key}:`);
        lines.push(formatObjectToText(val, indent + 1));
      } else if (typeof val === 'boolean') {
        lines.push(`${indentStr}${key}: ${val ? 'Yes' : 'No'}`);
      } else {
        lines.push(`${indentStr}${key}: ${String(val)}`);
      }
    });

    return lines.join('\n');
  };

  const renderValue = (value) => {
    // Handle null or undefined
    if (value === null || value === undefined) {
      return <span className="text-gray-400 italic">null</span>;
    }

    // Handle arrays
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return <span className="text-gray-400 italic">Empty array</span>;
      }
      return (
        <ul className="list-disc list-inside space-y-1">
          {value.map((item, index) => (
            <li key={index} className="text-sm text-gray-900">
              {typeof item === 'object' && item !== null && !Array.isArray(item)
                ? (
                    <pre className="text-sm text-gray-900 rounded overflow-x-auto mt-1">
                      {formatObjectToText(item)}
                    </pre>
                  )
                : Array.isArray(item)
                ? `[${item.join(', ')}]`
                : String(item)}
            </li>
          ))}
        </ul>
      );
    }

    // Handle objects
    if (typeof value === 'object') {
      return (
        <pre className="text-sm text-gray-900 rounded overflow-x-auto whitespace-pre-wrap">
          {formatObjectToText(value)}
        </pre>
      );
    }

    // Handle booleans
    if (typeof value === 'boolean') {
      return (
        <span className={`text-sm font-medium ${value ? 'text-green-700' : 'text-gray-600'}`}>
          {value ? 'Yes' : 'No'}
        </span>
      );
    }

    // Handle strings and numbers
    return (
      <p className="text-sm text-gray-900 whitespace-pre-wrap">{String(value)}</p>
    );
  };

  return (
    <div className="space-y-4">
      {Object.entries(customAttributes).map(([key, value]) => {        
        return (
          <div key={key} className="border-b border-gray-100 pb-4 last:border-b-0">
            <div className="flex">
              <div className="w-1/3">
                <span className="text-sm font-semibold text-gray-700">{key}</span>
              </div>
              <div className="w-2/3">
                {renderValue(value)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CustomAttributesTab;

