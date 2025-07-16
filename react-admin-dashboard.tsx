import React, { useState, useEffect } from 'react';

// Mock data
const mockOrganizations = [
  { id: 1, name: 'Acme Corp', description: 'Technology company', isActive: true, authType: 'AD' },
  { id: 2, name: 'Global Industries', description: 'Manufacturing company', isActive: true, authType: 'function' },
  { id: 3, name: 'StartupXYZ', description: 'Innovative startup', isActive: false, authType: 'AD' },
  { id: 4, name: 'Enterprise Solutions', description: 'Enterprise software', isActive: true, authType: 'function' },
  { id: 5, name: 'Tech Innovations', description: 'R&D company', isActive: true, authType: 'AD' }
];

const mockCommands = [
  { id: 1, label: 'Deploy Application', description: 'Deploy application to production', isActive: true },
  { id: 2, label: 'Restart Service', description: 'Restart system service', isActive: true },
  { id: 3, label: 'Backup Database', description: 'Create database backup', isActive: false },
  { id: 4, label: 'Update Configuration', description: 'Update system configuration', isActive: true },
  { id: 5, label: 'Monitor Health', description: 'Check system health', isActive: true }
];

const mockSettings = [
  { id: 1, key: 'failureMessage', value: 'Operation failed. Please try again.', type: 'text' },
  { id: 2, key: 'warningFields', value: 'timeout,memory', type: 'text' },
  { id: 3, key: 'timeout', value: '30', type: 'number' },
  { id: 4, key: 'displayDebug', value: 'true', type: 'boolean' },
  { id: 5, key: 'siteName', value: 'Admin Dashboard', type: 'text' }
];

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [organizations, setOrganizations] = useState(mockOrganizations);
  const [commands, setCommands] = useState(mockCommands);
  const [settings, setSettings] = useState(mockSettings);

  // Navigation component
  const Navigation = () => (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <div className="space-x-4">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className={`px-4 py-2 rounded ${currentPage === 'dashboard' ? 'bg-blue-800' : 'hover:bg-blue-700'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentPage('organizations')}
            className={`px-4 py-2 rounded ${currentPage.includes('organization') ? 'bg-blue-800' : 'hover:bg-blue-700'}`}
          >
            Organizations
          </button>
          <button
            onClick={() => setCurrentPage('commands')}
            className={`px-4 py-2 rounded ${currentPage.includes('command') ? 'bg-blue-800' : 'hover:bg-blue-700'}`}
          >
            Commands
          </button>
          <button
            onClick={() => setCurrentPage('settings')}
            className={`px-4 py-2 rounded ${currentPage.includes('setting') ? 'bg-blue-800' : 'hover:bg-blue-700'}`}
          >
            Settings
          </button>
        </div>
      </div>
    </nav>
  );

  // Landing Page
  const LandingPage = () => (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Welcome to Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
              O
            </div>
            <h3 className="text-xl font-semibold">Organizations</h3>
          </div>
          <p className="text-gray-600 mb-4">Manage your organizations, view details, and control access settings.</p>
          <button
            onClick={() => setCurrentPage('organizations')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            View Organizations
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
              C
            </div>
            <h3 className="text-xl font-semibold">Commands</h3>
          </div>
          <p className="text-gray-600 mb-4">Manage system commands, publish settings, and monitor execution.</p>
          <button
            onClick={() => setCurrentPage('commands')}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            View Commands
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
              S
            </div>
            <h3 className="text-xl font-semibold">Settings</h3>
          </div>
          <p className="text-gray-600 mb-4">Configure system settings, timeouts, and debug options.</p>
          <button
            onClick={() => setCurrentPage('settings')}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            View Settings
          </button>
        </div>
      </div>
    </div>
  );

  // Generic List Component
  const DataList = ({ title, data, columns, onView, onEdit, onDelete, onAdd, searchFields }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('');
    const [sortDirection, setSortDirection] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const filteredData = data.filter(item =>
      searchFields.some(field =>
        item[field]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    const sortedData = [...filteredData].sort((a, b) => {
      if (!sortField) return 0;
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

    const handleSort = (field) => {
      if (sortField === field) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortField(field);
        setSortDirection('asc');
      }
    };

    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button
            onClick={onAdd}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add New
          </button>
        </div>
        
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.field}
                    onClick={() => handleSort(column.field)}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    {column.label}
                    {sortField === column.field && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={column.field} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {column.type === 'boolean' ? (
                        <span className={`px-2 py-1 rounded text-xs ${
                          item[column.field] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item[column.field] ? 'Active' : 'Inactive'}
                        </span>
                      ) : (
                        item[column.field]
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => onView(item)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onEdit(item)}
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex justify-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === i + 1 ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  };

  // Generic Form Component
  const FormPage = ({ title, fields, initialData, onSave, onCancel, isTabbed = false }) => {
    const [formData, setFormData] = useState(initialData || {});
    const [errors, setErrors] = useState({});
    const [activeTab, setActiveTab] = useState(0);

    const handleSubmit = (e) => {
      e.preventDefault();
      const newErrors = {};
      
      fields.forEach(field => {
        if (field.required && !formData[field.name]) {
          newErrors[field.name] = `${field.label} is required`;
        }
      });

      if (Object.keys(newErrors).length === 0) {
        onSave(formData);
      } else {
        setErrors(newErrors);
      }
    };

    const handleChange = (name, value) => {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    };

    const renderField = (field) => {
      const commonProps = {
        id: field.name,
        value: formData[field.name] || '',
        onChange: (e) => handleChange(field.name, e.target.value),
        className: `w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          errors[field.name] ? 'border-red-500' : 'border-gray-300'
        }`
      };

      switch (field.type) {
        case 'text':
          return <input type="text" {...commonProps} />;
        case 'textarea':
          return <textarea {...commonProps} rows={3} />;
        case 'select':
          return (
            <select {...commonProps}>
              <option value="">Select...</option>
              {field.options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );
        case 'boolean':
          return (
            <input
              type="checkbox"
              id={field.name}
              checked={formData[field.name] || false}
              onChange={(e) => handleChange(field.name, e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
          );
        case 'number':
          return <input type="number" {...commonProps} />;
        default:
          return <input type="text" {...commonProps} />;
      }
    };

    const tabs = isTabbed ? 
      fields.reduce((acc, field) => {
        const tabIndex = field.tab || 0;
        if (!acc[tabIndex]) acc[tabIndex] = { name: field.tabName || 'Tab', fields: [] };
        acc[tabIndex].fields.push(field);
        return acc;
      }, {}) : null;

    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Back
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit}>
            {isTabbed && tabs ? (
              <div>
                <div className="border-b border-gray-200 mb-4">
                  <nav className="-mb-px flex space-x-8">
                    {Object.entries(tabs).map(([index, tab]) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setActiveTab(parseInt(index))}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === parseInt(index)
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {tab.name}
                      </button>
                    ))}
                  </nav>
                </div>
                <div className="space-y-4">
                  {tabs[activeTab]?.fields.map(field => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                        {field.required && <span className="text-red-500">*</span>}
                      </label>
                      {renderField(field)}
                      {errors[field.name] && (
                        <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {fields.map(field => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                      {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {renderField(field)}
                    {errors[field.name] && (
                      <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-end space-x-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Generic View Component
  const ViewPage = ({ title, data, fields, onEdit, onBack }) => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="space-x-4">
          <button
            onClick={() => onEdit(data)}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Edit
          </button>
          <button
            onClick={onBack}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Back
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          {fields.map(field => (
            <div key={field.name} className="flex">
              <div className="w-1/3">
                <span className="font-medium text-gray-700">{field.label}:</span>
              </div>
              <div className="w-2/3">
                {field.type === 'boolean' ? (
                  <span className={`px-2 py-1 rounded text-xs ${
                    data[field.name] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {data[field.name] ? 'Active' : 'Inactive'}
                  </span>
                ) : (
                  <span className="text-gray-900">{data[field.name] || 'N/A'}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Organization specific components
  const organizationColumns = [
    { field: 'id', label: 'ID' },
    { field: 'name', label: 'Name' },
    { field: 'description', label: 'Description' },
    { field: 'authType', label: 'Auth Type' },
    { field: 'isActive', label: 'Status', type: 'boolean' }
  ];

  const organizationFields = [
    { name: 'name', label: 'Name', type: 'text', required: true, tab: 0, tabName: 'Basic Information' },
    { name: 'description', label: 'Description', type: 'textarea', required: true, tab: 0, tabName: 'Basic Information' },
    { name: 'isActive', label: 'Active', type: 'boolean', tab: 0, tabName: 'Basic Information' },
    { name: 'authType', label: 'Authorization Type', type: 'select', required: true, tab: 1, tabName: 'Authorization',
      options: [
        { value: 'AD', label: 'AD Group' },
        { value: 'function', label: 'Function' }
      ]
    }
  ];

  // Command specific components
  const commandColumns = [
    { field: 'id', label: 'ID' },
    { field: 'label', label: 'Label' },
    { field: 'description', label: 'Description' },
    { field: 'isActive', label: 'Status', type: 'boolean' }
  ];

  const commandFields = [
    { name: 'label', label: 'Label', type: 'text', required: true, tab: 0, tabName: 'Command Details' },
    { name: 'description', label: 'Description', type: 'textarea', required: true, tab: 0, tabName: 'Command Details' },
    { name: 'isActive', label: 'Active', type: 'boolean', tab: 0, tabName: 'Command Details' },
    { name: 'published', label: 'Published', type: 'boolean', tab: 1, tabName: 'Publish Settings' },
    { name: 'publishNotes', label: 'Publish Notes', type: 'textarea', tab: 1, tabName: 'Publish Settings' }
  ];

  // Settings specific components
  const settingsColumns = [
    { field: 'id', label: 'ID' },
    { field: 'key', label: 'Key' },
    { field: 'value', label: 'Value' },
    { field: 'type', label: 'Type' }
  ];

  const settingsFields = [
    { name: 'key', label: 'Key', type: 'text', required: true, tab: 0, tabName: 'Basic Settings' },
    { name: 'type', label: 'Type', type: 'select', required: true, tab: 0, tabName: 'Basic Settings',
      options: [
        { value: 'text', label: 'Text' },
        { value: 'number', label: 'Number' },
        { value: 'boolean', label: 'Boolean' }
      ]
    },
    { name: 'value', label: 'Value', type: 'text', required: true, tab: 1, tabName: 'Value Configuration' },
    { name: 'description', label: 'Description', type: 'textarea', tab: 1, tabName: 'Value Configuration' }
  ];

  // State management for current view
  const [viewData, setViewData] = useState(null);
  const [editData, setEditData] = useState(null);

  // CRUD operations
  const handleSave = (data, type) => {
    if (data.id) {
      // Update existing
      if (type === 'organization') {
        setOrganizations(prev => prev.map(org => org.id === data.id ? data : org));
      } else if (type === 'command') {
        setCommands(prev => prev.map(cmd => cmd.id === data.id ? data : cmd));
      } else if (type === 'setting') {
        setSettings(prev => prev.map(setting => setting.id === data.id ? data : setting));
      }
    } else {
      // Create new
      const newId = Math.max(...(type === 'organization' ? organizations : 
                                 type === 'command' ? commands : settings).map(item => item.id)) + 1;
      const newItem = { ...data, id: newId };
      
      if (type === 'organization') {
        setOrganizations(prev => [...prev, newItem]);
      } else if (type === 'command') {
        setCommands(prev => [...prev, newItem]);
      } else if (type === 'setting') {
        setSettings(prev => [...prev, newItem]);
      }
    }
    
    setCurrentPage(type === 'organization' ? 'organizations' : 
                   type === 'command' ? 'commands' : 'settings');
    setEditData(null);
  };

  const handleDelete = (id, type) => {
    if (confirm('Are you sure you want to delete this item?')) {
      if (type === 'organization') {
        setOrganizations(prev => prev.filter(org => org.id !== id));
      } else if (type === 'command') {
        setCommands(prev => prev.filter(cmd => cmd.id !== id));
      } else if (type === 'setting') {
        setSettings(prev => prev.filter(setting => setting.id !== id));
      }
    }
  };

  // Render current page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <LandingPage />;
      
      case 'organizations':
        return (
          <DataList
            title="Organizations"
            data={organizations}
            columns={organizationColumns}
            searchFields={['name', 'description', 'authType']}
            onView={(item) => { setViewData(item); setCurrentPage('organization-view'); }}
            onEdit={(item) => { setEditData(item); setCurrentPage('organization-edit'); }}
            onDelete={(id) => handleDelete(id, 'organization')}
            onAdd={() => { setEditData(null); setCurrentPage('organization-add'); }}
          />
        );
      
      case 'organization-view':
        return (
          <ViewPage
            title="Organization Details"
            data={viewData}
            fields={organizationFields}
            onEdit={(item) => { setEditData(item); setCurrentPage('organization-edit'); }}
            onBack={() => setCurrentPage('organizations')}
          />
        );
      
      case 'organization-add':
      case 'organization-edit':
        return (
          <FormPage
            title={currentPage === 'organization-add' ? 'Add Organization' : 'Edit Organization'}
            fields={organizationFields}
            initialData={editData}
            onSave={(data) => handleSave(data, 'organization')}
            onCancel={() => setCurrentPage('organizations')}
            isTabbed={true}
          />
        );
      
      case 'commands':
        return (
          <DataList
            title="Commands"
            data={commands}
            columns={commandColumns}
            searchFields={['label', 'description']}
            onView={(item) => { setViewData(item); setCurrentPage('command-view'); }}
            onEdit={(item) => { setEditData(item); setCurrentPage('command-edit'); }}
            onDelete={(id) => handleDelete(id, 'command')}
            onAdd={() => { setEditData(null); setCurrentPage('command-add'); }}
          />
        );
      
      case 'command-view':
        return (
          <ViewPage
            title="Command Details"
            data={viewData}
            fields={commandFields}
            onEdit={(item) => { setEditData(item); setCurrentPage('command-edit'); }}
            onBack={() => setCurrentPage('commands')}
          />
        );
      
      case 'command-add':
      case 'command-edit':
        return (
          <FormPage
            title={currentPage === 'command-add' ? 'Add Command' : 'Edit Command'}
            fields={commandFields}
            initialData={editData}
            onSave={(data) => handleSave(data, 'command')}
            onCancel={() => setCurrentPage('commands')}
            isTabbed={true}
          />
        );
      
      case 'settings':
        return (
          <DataList
            title="Settings"
            data={settings}
            columns={settingsColumns}
            searchFields={['key', 'value', 'type']}
            onView={(item) => { setViewData(item); setCurrentPage('setting-view'); }}
            onEdit={(item) => { setEditData(item); setCurrentPage('setting-edit'); }}
            onDelete={(id) => handleDelete(id, 'setting')}
            onAdd={() => { setEditData(null); setCurrentPage('setting-add'); }}
          />
        );
      
      case 'setting-view':
        return (
          <ViewPage
            title="Setting Details"
            data={viewData}
            fields={settingsFields}
            onEdit={(item) => { setEditData(item); setCurrentPage('setting-edit'); }}
            onBack={() => setCurrentPage('settings')}
          />
        );
      
      case 'setting-add':
      case 'setting-edit':
        return (
          <FormPage
            title={currentPage === 'setting-add' ? 'Add Setting' : 'Edit Setting'}
            fields={settingsFields}
            initialData={editData}
            onSave={(data) => handleSave(data, 'setting')}
            onCancel={() => setCurrentPage('settings')}
            isTabbed={true}
          />
        );
      
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main>
        {renderCurrentPage()}
      </main>
    </div>
  );
};

export default App;