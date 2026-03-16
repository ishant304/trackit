import { useEffect } from 'react';
import { useState } from 'react';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showEditExpense, setShowEditExpense] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  // Filter states matching your API
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  // Categories from your backend
  const categories = [
    { value: 'all', label: 'All' },
    { value: 'rent', label: 'Rent' },
    { value: 'food', label: 'Food' },
    { value: 'travel', label: 'Travel' },
    { value: 'bills', label: 'Bills' },
    { value: 'misc', label: 'Misc' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'others', label: 'Others' }
  ];

  // TODO: Replace with actual API calls
  // Mock data matching your API response structure
  const [expenses] = useState([
    { _id: '1', amount: 1200, category: 'rent', description: 'Monthly rent payment', date: '2026-03-01' },
    { _id: '2', amount: 156.50, category: 'food', description: 'Weekly groceries from supermarket', date: '2026-03-07' },
    { _id: '3', amount: 89.30, category: 'bills', description: 'Electricity bill for February', date: '2026-03-05' },
    { _id: '4', amount: 15.99, category: 'entertainment', description: 'Netflix monthly subscription', date: '2026-03-03' },
    { _id: '5', amount: 65.00, category: 'travel', description: 'Gas station refuel', date: '2026-03-06' },
    { _id: '6', amount: 78.20, category: 'food', description: 'Restaurant dinner with friends', date: '2026-03-04' },
    { _id: '7', amount: 124.99, category: 'shopping', description: 'Online shopping - clothing', date: '2026-03-07' },
    { _id: '8', amount: 45.00, category: 'misc', description: 'Miscellaneous household items', date: '2026-03-02' },
  ]);

  // Mock summary data from /api/summary endpoint
  const [summary] = useState({
    countOfExpense: 8,
    totalExpense: 1774.98,
    averageExpense: 221.87,
    maxExpense: 1200,
    minExpense: 15.99
  });

  useEffect(()=>{

    getProfile();

  },[])

  const getProfile = async ()=>{

    try{

      const rawData = await fetch("https://trackit-xisc.onrender.com/api/user/profile",{
        method: "GET",
        credentials: "include"
      })

      const data = await rawData.json();
      
      console.log(data)
    }
    catch(err){
      console.error(err)
    }

  }

  // Mock category summary from /api/summary/category endpoint
  const [categorySummary] = useState([
    { _id: 'rent', totalExpense: 1200, countOfExpense: 1, averageExpense: 1200, maxExpense: 1200, minExpense: 1200 },
    { _id: 'food', totalExpense: 234.70, countOfExpense: 2, averageExpense: 117.35, maxExpense: 156.50, minExpense: 78.20 },
    { _id: 'shopping', totalExpense: 124.99, countOfExpense: 1, averageExpense: 124.99, maxExpense: 124.99, minExpense: 124.99 },
    { _id: 'bills', totalExpense: 89.30, countOfExpense: 1, averageExpense: 89.30, maxExpense: 89.30, minExpense: 89.30 },
    { _id: 'travel', totalExpense: 65.00, countOfExpense: 1, averageExpense: 65.00, maxExpense: 65.00, minExpense: 65.00 },
    { _id: 'misc', totalExpense: 45.00, countOfExpense: 1, averageExpense: 45.00, maxExpense: 45.00, minExpense: 45.00 },
    { _id: 'entertainment', totalExpense: 15.99, countOfExpense: 1, averageExpense: 15.99, maxExpense: 15.99, minExpense: 15.99 },
  ]);

  const [totalPages] = useState(1);

  // Filter expenses locally (in real app, filtering happens server-side via API)
  let filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || expense.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // TODO: Connect to your API endpoints
  const handleAddExpense = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const expenseData = {
      amount: parseFloat(formData.get('amount')),
      category: formData.get('category'),
      description: formData.get('description'),
      date: formData.get('date')
    };

    console.log('POST /api/expenses', expenseData);
    setShowAddExpense(false);
  };

  const handleUpdateExpense = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const expenseData = {
      amount: parseFloat(formData.get('amount')),
      category: formData.get('category'),
      description: formData.get('description'),
      date: formData.get('date')
    };

    console.log('PUT /api/expenses/' + editingExpense._id, expenseData);
    setShowEditExpense(false);
    setEditingExpense(null);
  };

  const handleDeleteExpense = async (id) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    console.log('DELETE /api/expenses/' + id);
  };

  const openEditModal = (expense) => {
    setEditingExpense(expense);
    setShowEditExpense(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryLabel = (value) => {
    const cat = categories.find(c => c.value === value);
    return cat ? cat.label : value;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">

      {/* Header */}
      <header className="border-b border-blue-100 shadow-sm sticky top-0 z-20 backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg rotate-3 hover:rotate-0 transition-transform">
                <span className="text-3xl">💰</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  TracKit
                </h1>
                <p className="text-sm text-gray-600 font-medium">Expense Dashboard</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddExpense(true)}
              className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl flex items-center space-x-2 transition shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
            >
              <span className="text-xl">➕</span>
              <span>Add Expense</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">🔍</span>
                  <input
                    type="text"
                    placeholder="Search by description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-medium"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center space-x-2 px-5 py-3 rounded-xl transition-all font-semibold ${showFilters
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'border-2 border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                >
                  <span className="text-xl">🎚️</span>
                  <span>Filters</span>
                </button>
                
              </div>

              {showFilters && (
                <div className="pt-4 border-t-2 border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">From Date</label>
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">To Date</label>
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-5 py-2.5 rounded-full font-semibold transition-all transform hover:scale-105 ${selectedCategory === category.value
                      ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300 shadow-sm'
                    }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Expenses List */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-blue-100">
              <div className="p-6 border-b-2 border-gray-100 bg-linear-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Expenses</h2>
                  <span className="text-sm font-semibold text-gray-600 bg-white px-3 py-1.5 rounded-full border-2 border-blue-200">
                    {filteredExpenses.length} results
                  </span>
                </div>
              </div>

              {/* Expense Items */}
              <div className="divide-y-2 divide-gray-100">
                {filteredExpenses.length === 0 ? (
                  <div className="p-12 text-center">
                    <span className="text-6xl mb-3 block">💵</span>
                    <p className="text-gray-500 font-medium">No expenses found</p>
                  </div>
                ) : (
                  filteredExpenses.map((expense) => (
                    <div key={expense._id} className="p-5 hover:bg-blue-50 transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border-2 border-blue-200">
                              <span className="mr-1">🏷️</span>
                              {getCategoryLabel(expense.category)}
                            </span>
                            <span className="text-sm text-gray-500 font-medium flex items-center">
                              <span className="mr-1">📅</span>
                              {formatDate(expense.date)}
                            </span>
                          </div>
                          <p className="text-gray-900 font-medium mb-1">{expense.description}</p>
                          <p className="text-2xl font-bold text-red-600">${expense.amount.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => openEditModal(expense)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition text-xl"
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteExpense(expense._id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition text-xl"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 border-t-2 border-gray-100 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center space-x-2 px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                    >
                      <span>◀️</span>
                      <span>Previous</span>
                    </button>
                    <span className="text-sm font-semibold text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="flex items-center space-x-2 px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                    >
                      <span>Next</span>
                      <span>▶️</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>





          {/* Sidebar - Category Summary from /api/summary/category */}
          <div className="space-y-6">

            {/* Expense Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900">Expense Stats</h2>
                <span className="text-2xl">📈</span>
              </div>

              <div className="space-y-4">

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-semibold text-gray-600">Total</span>
                  <span className="font-bold text-gray-900">${summary.totalExpense.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-semibold text-gray-600">Average</span>
                  <span className="font-bold text-gray-900">${summary.averageExpense.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-semibold text-gray-600">Highest</span>
                  <span className="font-bold text-gray-900">${summary.maxExpense.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-semibold text-gray-600">Lowest</span>
                  <span className="font-bold text-gray-900">${summary.minExpense.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-semibold text-gray-600">Total Expenses</span>
                  <span className="font-bold text-gray-900">{summary.countOfExpense}</span>
                </div>

              </div>
            </div>


            {/* Category Breakdown */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900">Category Summary</h2>
                <span className="text-2xl">📊</span>
              </div>

              <div className="space-y-4">
                {categorySummary.map((cat) => {
                  const percentage =
                    summary.totalExpense > 0
                      ? (cat.totalExpense / summary.totalExpense) * 100
                      : 0;

                  return (
                    <div
                      key={cat._id}
                      className="pb-4 border-b-2 border-gray-100 last:border-0"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                          {getCategoryLabel(cat._id)}
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          ${cat.totalExpense.toFixed(2)}
                        </span>
                      </div>

                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden mb-2">
                        <div
                          className="bg-linear-to-r from-blue-500 to-indigo-500 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 font-medium">
                          {percentage.toFixed(1)}% of total
                        </span>
                        <span className="text-gray-600 font-medium">
                          {cat.countOfExpense} expenses
                        </span>
                      </div>

                      <div className="mt-2 text-xs text-gray-500 font-medium">
                        Avg: ${cat.averageExpense.toFixed(2)} • Min: $
                        {cat.minExpense.toFixed(2)} • Max: $
                        {cat.maxExpense.toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>


            {/* Quick Info */}
            <div className="bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
              <h2 className="text-lg font-bold mb-4">Quick Info</h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-white/20">
                  <span className="text-blue-100 font-medium">Categories</span>
                  <span className="text-2xl font-bold">{categorySummary.length}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-white/20">
                  <span className="text-blue-100 font-medium">Top Category</span>
                  <span className="text-lg font-bold">
                    {getCategoryLabel(categorySummary[0]?._id || "N/A")}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-blue-100 font-medium">Page</span>
                  <span className="text-2xl font-bold">
                    {currentPage}/{totalPages}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add Expense</h2>
              <button
                onClick={() => setShowAddExpense(false)}
                className="text-gray-400 hover:text-gray-600 transition text-2xl"
              >
                ❌
              </button>
            </div>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Amount *</label>
                <input
                  type="number"
                  name="amount"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Category *</label>
                <select
                  name="category"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  required
                >
                  {categories.slice(1).map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Date *</label>
                <input
                  type="date"
                  name="date"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Description *</label>
                <textarea
                  name="description"
                  placeholder="What was this expense for?"
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none font-medium"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-bold transition shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Add Expense
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Expense Modal */}
      {showEditExpense && editingExpense && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Expense</h2>
              <button
                onClick={() => {
                  setShowEditExpense(false);
                  setEditingExpense(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition text-2xl"
              >
                ❌
              </button>
            </div>
            <form onSubmit={handleUpdateExpense} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Amount *</label>
                <input
                  type="number"
                  name="amount"
                  step="0.01"
                  defaultValue={editingExpense.amount}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Category *</label>
                <select
                  name="category"
                  defaultValue={editingExpense.category}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  required
                >
                  {categories.slice(1).map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Date *</label>
                <input
                  type="date"
                  name="date"
                  defaultValue={editingExpense.date}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Description *</label>
                <textarea
                  name="description"
                  defaultValue={editingExpense.description}
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none font-medium"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-bold transition shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Update Expense
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
