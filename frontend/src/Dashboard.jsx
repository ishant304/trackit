import { useEffect } from 'react';
import { useState } from 'react';
import logo from "./assets/image.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDownWideShort, faBagShopping, faCalendar, faCalendarDays, faCar, faChartLine, faChartSimple, faChevronLeft, faChevronRight, faCircleExclamation, faCircleNotch, faExclamationTriangle, faFileInvoice, faFilm, faHouse, faPen, faPlus, faRotateLeft, faSackXmark, faSliders, faSpinner, faTag, faTrash, faUser, faUtensils, faWallet, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showEditExpense, setShowEditExpense] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false)
  const [expenseToDelete, setExpenseToDelete] = useState()
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [user, setUser] = useState()
  const [expense, setExpense] = useState([])
  const [expenseSummary, setExpenseSummary] = useState()
  const [categorySummary, setCategorySummary] = useState()

  const [expenseLoader, setExpenseLoader] = useState()
  const [expenseError, setExpenseError] = useState()
  const [loader, setLoader] = useState(false)

  const [totalPages, setTotalPages] = useState(1);
  const [totalExpense, setTotalExpense] = useState(1)
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    sort: "latest",
    time: "all",
    fromDate: "",
    toDate: ""
  });

  const navigate = useNavigate();

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

  useEffect(() => {
    getProfile();
    getExpenseSummary();
    getCategorySummary();
  }, [])

  useEffect(() => {
    getExpenses()
  }, [currentPage,filters])

  const getProfile = async () => {

    try {

      const rawData = await fetch("https://trackit-xisc.onrender.com/api/user/profile", {
        method: "GET",
        credentials: "include"
      })

      const data = await rawData.json();

      setUser(data.user)

    }
    catch (err) {
      console.error(err)
    }

  }

  const getExpenses = async () => {

    setExpenseLoader(true)
    setExpenseError(false)

    const queryObj = {}

    if(currentPage){
      queryObj.page = currentPage
    }
    if(filters.sort){
      queryObj.sort = filters.sort
    }

    const query = new URLSearchParams(queryObj).toString()

    console.log(query)

    console.log(queryObj)


    try {

      const rawData = await fetch(`https://trackit-xisc.onrender.com/api/expense?${query}`, {
        method: "GET",
        credentials: "include"
      })

      if (!rawData.ok) {
        throw new Error("Server error");
      }
      const data = await rawData.json()

      setTotalPages(data.totalPage)

      setExpense(data.expenses)
      setTotalExpense(data.totalExpense)
      setExpenseLoader(false)

    }
    catch (err) {
      console.error(err)
      setExpenseError(true)
    }

  }

  const getExpenseSummary = async () => {

    const rawData = await fetch("https://trackit-xisc.onrender.com/api/stats/summary", {
      method: "GET",
      credentials: "include"
    })

    const data = await rawData.json()

    setExpenseSummary(data.data)

  }

  const getCategorySummary = async () => {

    const rawData = await fetch("https://trackit-xisc.onrender.com/api/stats/category", {
      method: "GET",
      credentials: "include"
    })

    const data = await rawData.json()

    setCategorySummary(data.data)

  }


  const getCategoryIcon = (category) => {
    const icons = {
      food: faUtensils,
      travel: faCar,
      entertainment: faFilm,
      shopping: faBagShopping,
      rent: faHouse,
      bills: faFileInvoice,
      misc: faTag
    };
    return icons[category] || faTag;
  }


  let filteredExpenses = expense.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || expense.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.amount = parseFloat(data.amount)
    console.log(data)

    try {
      setLoader(true)

      const rawData = await fetch("https://trackit-xisc.onrender.com/api/expense", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      })
      if (!rawData.ok) {
        throw new Error("Expense not posted on server");
      }
      await getExpenses()
    }
    catch (err) {
      console.error(err)
    }
    finally {
      setLoader(false)
    }
    setShowAddExpense(false);
  };


  const openEditModal = (expense) => {
    setEditingExpense(expense);
    setShowEditExpense(true);
  };

  const handleUpdateExpense = async (e) => {
    e.preventDefault();
    const rawFormData = new FormData(e.target);
    const formData = Object.fromEntries(rawFormData.entries())
    formData.amount = parseFloat(formData.amount)
    console.log(formData)

    try {
      setLoader(true)

      const resp = await fetch(`https://trackit-xisc.onrender.com/api/expense/${editingExpense._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      })

      if (!resp.ok) {
        throw new Error("Can not edit the response");
      }

      await getExpenses()
    }
    catch (err) {
      console.error(err)
    }
    finally {
      setShowEditExpense(false);
      setEditingExpense(null);
    }
  };

  const handleDeleteExpense = async (id) => {
    setDeleteModal(true);
    setExpenseToDelete(id)
  };

  const handleCancelDelete = async () => {
    setDeleteModal(false)
  }

  const handleConfirmDelete = async () => {

    if (!expenseToDelete) return;

    try {
      setLoader(true)

      const resp = await fetch(`https://trackit-xisc.onrender.com/api/expense/${expenseToDelete}`, {
        method: "DELETE",
        credentials: "include"
      })

      if (!resp.ok) {
        throw new Error("Failed to delete expense");
      }

      await getExpenses()
    }
    catch (err) {
      console.error(err)
    }
    finally {
      setLoader(false)
      setDeleteModal(false)
      setExpenseToDelete(null)
    }

  }

  const handleLogout = async () => {

    try {

      setLoader(true)

      const resp = await fetch("https://trackit-xisc.onrender.com/api/user/logout", {
        method: "GET",
        credentials: "include"
      })

      if (!resp.ok) {
        throw new Error("Unable to logout");
      }

      const cookedResp = await resp.json()

      console.log(cookedResp)

      setLoader(false)
      navigate("/")

    }
    catch (err) {
      console.error(err)
    }

  }

  useEffect(() => {
    const interval = setInterval(async () => {

      const res = await fetch("https://trackit-xisc.onrender.com")
      const data = await res.text()

    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

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

      <header className="border-b border-blue-100 shadow-sm sticky top-0 z-20 backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 sm:w-16 flex items-center justify-center rotate-3 hover:rotate-0 transition-transform">
                <img src={logo} alt="logo" />
              </div>
              <div>
                <p className="sm:text-2xl text-xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  TracKit
                </p>
                <p className="sm:text-sm text-xs text-gray-600 font-medium">Expense Dashboard</p>
              </div>
            </div>

            <div className="flex flex-row justify-center">

              <button
                onClick={() => setShowAddExpense(true)}
                className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white sm:px-6 px-3 rounded-xl flex items-center space-x-2 transition shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold sm:text-base text-sm py-2.5"
              >
                <span className="text-base sm:text-xl"><FontAwesomeIcon icon={faPlus} /></span>
                <span>Add Expense</span>
              </button>
              <div className="relative">

                <button
                  onClick={() => setOpenUserMenu(!openUserMenu)}
                  className="ml-3.5 w-12 h-12 rounded-full overflow-hidden 
                  border border-blue-200 
                  hover:ring-2 hover:ring-blue-500 
                  transition duration-200"
                >
                  <FontAwesomeIcon icon={faUser} className='text-xl text-blue-400' />
                </button>

                {openUserMenu && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50">

                    <div className="flex items-center gap-3 pb-3 border-b border-gray-100">

                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                        {user?.username[0].toUpperCase()}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {user?.username}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user?.name}
                        </p>
                      </div>

                    </div>

                    <div className="mt-3 text-sm text-gray-600">
                      <p className="text-xs text-gray-400 mb-1">
                        Account created
                      </p>

                      <p className="font-medium">
                        {new Date(user?.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        })}
                      </p>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="mt-4 w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 rounded-lg text-sm font-semibold transition"
                    >
                      {
                        loader && (
                          <>
                            <FontAwesomeIcon icon={faCircleNotch} spin className='mr-1.5' />
                          </>
                        )
                      }
                      Logout
                    </button>

                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">

              <div className="flex-1 flex items-center gap-2 px-4 py-2.5 border-2 border-gray-200 rounded-xl hover:border-blue-400 transition">
                <FontAwesomeIcon icon={faArrowDownWideShort} className="text-blue-500" />
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters((prev) => ({ ...prev, sort: e.target.value }))}
                  className="w-full bg-transparent outline-none font-medium text-gray-700 cursor-pointer"
                >
                  <option value="latest">Newest First</option>
                  <option value="high">Highest Amount</option>
                  <option value="low">Lowest Amount</option>
                </select>
              </div>

              <div className="flex-1 flex items-center gap-2 px-4 py-2.5 border-2 border-gray-200 rounded-xl hover:border-blue-400 transition">
                <FontAwesomeIcon icon={faCalendarDays} className="text-blue-500" />
                <select
                  value={filters.time}
                  onChange={(e) => setFilters(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full bg-transparent outline-none font-medium text-gray-700 cursor-pointer"
                >
                  <option value="all">All Time</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">This Month</option>
                  <option value="last 30d">Last Month</option>
                </select>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all border-2 ${showFilters
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <FontAwesomeIcon icon={faSliders} />
                Advanced Filters
              </button>

            </div>

            {showFilters && (
              <div className="mt-6 pt-5 border-t-2 border-gray-100 flex flex-col sm:flex-row gap-4 items-end">

                <div className="flex-1 w-full">
                  <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={filters.fromDate}
                    onChange={(e) => setFilters(prev => ({ ...prev, fromDate: e.target.value }))}
                    max={new Date().toLocaleDateString("en-CA")}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="flex-1 w-full">
                  <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={filters.toDate}
                    onChange={(e) => setFilters(prev => ({ ...prev, toDate: e.target.value }))}
                    max={new Date().toLocaleDateString("en-CA")}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="flex-1 w-full">
                  <button
                    onClick={() => setFilters({
                      sort: "latest",
                      time: "all",
                      fromDate: "",
                      toDate: ""
                    })}
                    className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold 
                    transition-all duration-150 hover:bg-gray-50 active:scale-95"
                  >
                    <FontAwesomeIcon
                      icon={faRotateLeft}
                      className="transition-transform duration-200 group-active:rotate-180"
                    />
                    Clear
                  </button>
                </div>

              </div>
            )}

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
                    {totalExpense} results
                  </span>
                </div>
              </div>

              {/* Expense Items */}
              {expenseLoader ? (
                <div className="p-10 flex flex-col items-center justify-center gap-4">

                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50">
                    <FontAwesomeIcon
                      icon={faCircleNotch}
                      spin
                      className="text-blue-500 text-2xl"
                    />
                  </div>

                  <div className="text-center">
                    <p className="text-gray-800 text-xl font-semibold">
                      Fetching your expenses…
                    </p>
                    <p className="text-gray-400 text-base mt-1 animate-pulse">
                      Preparing your dashboard
                    </p>
                  </div>

                </div>
              ) : expenseError ?
                (
                  <div className="p-10 flex flex-col items-center justify-center gap-4">

                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50">
                      <FontAwesomeIcon
                        icon={faCircleExclamation}
                        className="text-blue-400 text-xl"
                      />
                    </div>

                    <div className="text-center">
                      <p className="text-gray-800 font-semibold">
                        Couldn’t load your expenses
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        The server might be waking up. Try again in a moment.
                      </p>
                    </div>

                    <button
                      onClick={getExpenses}
                      className="mt-2 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition"
                    >
                      Retry
                    </button>

                  </div>
                ) :
                (
                  <div className="divide-y-2 divide-gray-100">
                    {filteredExpenses.length === 0 ? (
                      <div className="p-12 flex flex-col items-center justify-center text-center">

                        <div className="relative mb-4">
                          <div className="absolute inset-0 rounded-full bg-linear-to-r from-blue-200 to-indigo-200 blur-md opacity-60"></div>
                          <div className="relative w-14 h-14 flex items-center justify-center rounded-full bg-white border border-blue-100 shadow-sm">
                            <FontAwesomeIcon icon={faSackXmark} className="text-blue-500 text-xl" />
                          </div>
                        </div>

                        <p className="text-gray-800 font-semibold text-lg">
                          No expense found
                        </p>

                        <p className="text-gray-400 text-sm mt-1">
                          Start adding expenses to see them here
                        </p>

                        <button
                          onClick={() => setShowAddExpense(true)}
                          className="mt-5 px-5 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-md"
                        >
                          <FontAwesomeIcon icon={faPlus} /> Add Expense
                        </button>

                      </div>
                    ) : (
                      filteredExpenses.map((expense) => (
                        <div key={expense._id} className="group relative bg-white rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 overflow-hidden">

                          <div className="p-6 pl-8">
                            <div className="flex items-start justify-between gap-4">

                              <div className="flex-1 min-w-0">

                                <div className="flex items-center gap-3 mb-3 flex-wrap">
                                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                    <FontAwesomeIcon icon={getCategoryIcon(expense.category)} />
                                    {getCategoryLabel(expense.category)}
                                  </span>
                                  <span className="text-sm text-gray-500 font-medium flex items-center gap-1.5">

                                    <time dateTime={expense.date}>{formatDate(expense.date)}</time>
                                  </span>
                                </div>

                                <p className="text-gray-800 font-medium mb-3 text-base leading-relaxed">
                                  {expense.description || (
                                    <span className="text-gray-400 italic">No description provided</span>
                                  )}
                                </p>

                                <div className="flex items-baseline gap-2">
                                  <span className="text-3xl font-bold text-blue-500  bg-clip-text ">
                                    ₹{new Intl.NumberFormat("en-IN", {
                                      maximumFractionDigits: 0
                                    }).format(expense.amount)}
                                  </span>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-start gap-2 shrink-0">
                                <button
                                  onClick={() => openEditModal(expense)}
                                  className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition"
                                >
                                  <FontAwesomeIcon icon={faPen} className="text-base" />
                                </button>

                                <button
                                  onClick={() => handleDeleteExpense(expense._id)}
                                  className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition"
                                >
                                  <FontAwesomeIcon icon={faTrash} className="text-base" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )

              }




              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 border-t-2 border-gray-100 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center space-x-2 px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                    >
                      <span><FontAwesomeIcon icon={faChevronLeft} /></span>
                      <span>Previous</span>
                    </button>
                    <span className="text-sm font-semibold text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="flex items-center space-x-2 px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                    >
                      <span>Next</span>
                      <span><FontAwesomeIcon icon={faChevronRight} /></span>
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
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-50 text-blue-500">
                  <FontAwesomeIcon className='text-xl' icon={faChartLine} />
                </div>
              </div>

              <div className="space-y-4">

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-semibold text-gray-600">Total</span>
                  <span className="font-bold text-gray-900">₹{expenseSummary?.totalExpense.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-semibold text-gray-600">Average</span>
                  <span className="font-bold text-gray-900">₹{expenseSummary?.averageExpense.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-semibold text-gray-600">Highest</span>
                  <span className="font-bold text-gray-900">₹{expenseSummary?.maxExpense.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-semibold text-gray-600">Lowest</span>
                  <span className="font-bold text-gray-900">₹{expenseSummary?.minExpense.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-semibold text-gray-600">Total Expenses</span>
                  <span className="font-bold text-gray-900">{expenseSummary?.countOfExpense}</span>
                </div>

              </div>
            </div>


            {/* Category Breakdown */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900">Category Summary</h2>
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-50 text-blue-500">
                  <FontAwesomeIcon className='text-xl' icon={faChartSimple} />
                </div>
              </div>

              <div className="space-y-4">
                {categorySummary?.map((cat) => {
                  const percentage =
                    expenseSummary?.totalExpense > 0
                      ? (cat?.totalExpense / expenseSummary?.totalExpense) * 100
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
                          ₹{cat.totalExpense.toFixed(2)}
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
                        Avg: ₹{cat.averageExpense.toFixed(2)} • Min: ₹
                        {cat.minExpense.toFixed(2)} • Max: ₹
                        {cat.maxExpense.toFixed(2)}
                      </div>
                    </div>
                  );
                })}
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
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Amount *</label>
                <input
                  type="number"
                  name="amount"
                  step="1"
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
                  max={new Date().toLocaleDateString("en-CA")}
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
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-bold transition shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {
                  loader && (
                    <>
                      <FontAwesomeIcon icon={faCircleNotch} spin className='mr-1.5' />
                    </>
                  )
                }
                Add Expense
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Confirm delete modal */}
      {
        deleteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">

              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Delete Expense
                </h2>
                <button
                  onClick={handleCancelDelete}
                  className="text-gray-400 hover:text-gray-600 transition text-xl"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>

              <div className="text-center mb-6">

                <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-blue-50 mb-3">
                  <FontAwesomeIcon icon={faTrash} className="text-blue-500 text-xl" />
                </div>

                <p className="text-gray-800 font-semibold">
                  Are you sure you want to delete this expense?
                </p>

                <p className="text-gray-400 text-sm mt-1">
                  This action cannot be undone
                </p>
              </div>

              <div className="flex gap-3">

                <button
                  onClick={handleCancelDelete}
                  className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 py-2.5 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-md hover:shadow-lg flex items-center justify-center"
                >
                  {loader && (
                    <FontAwesomeIcon icon={faCircleNotch} spin className="mr-2" />
                  )}
                  Delete
                </button>

              </div>

            </div>
          </div>
        )
      }

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
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <form onSubmit={handleUpdateExpense} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Amount *</label>
                <input
                  type="number"
                  name="amount"
                  step="1"
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
                  defaultValue={new Date(editingExpense.date).toISOString().split("T")[0]}
                  max={new Date().toLocaleDateString("en-CA")}
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
                {loader && (
                  <FontAwesomeIcon icon={faCircleNotch} spin className="mr-2" />
                )}
                Update Expense
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
