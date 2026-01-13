import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import categoryService from '../../services/categoryService'

const AdminCategories = () => {
  const { token } = useSelector((state) => state.auth)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '📚',
    color: '#3B82F6',
    isActive: true,
    difficulty: 'mixed'
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  
  const fetchCategories = async () => {
    try {
      setLoading(true)
      const { data } = await categoryService.getCategories()
      setCategories(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching categories:', error)
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
  const { name, value, type, checked } = e.target
  
  setFormData(prev => {
    let newState = { ...prev, [name]: type === 'checkbox' ? checked : value };
    
    // 🛑 CRITICAL FIX: Generate slug whenever the 'name' changes
    if (name === 'name') {
      newState.slug = generateSlug(value);
    }
    
    return newState;
  });
}

 
  const handleSubmit = async (e) => {
  e.preventDefault()
  try {
    if (editingCategory) {
      // Update existing category
      await categoryService.updateCategory(editingCategory._id, formData, token)
    } else {
      // Create new category
      await categoryService.createCategory(formData, token)
    }
    
    fetchCategories() // Refresh the list
    setShowModal(false)
    setEditingCategory(null)
    setFormData({
      name: '',
      description: '',
      icon: '',
      isActive: true
    })
  } catch (error) {
    console.error('Error saving category:', error)
  }
}
  const handleEdit = (category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
      icon: category.icon,
      isActive: category.isActive,
      slug: category.slug
    })
    setShowModal(true)
  }

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      try {
        await categoryService.deleteCategory(categoryId, token)
        await fetchCategories() // Refresh the list
      } catch (error) {
        console.error('Error deleting category:', error)
      }
    }
  }

  const handleToggleStatus = async (categoryId, currentStatus) => {
    try {
      await categoryService.updateCategory(
        categoryId, 
        { isActive: !currentStatus },
        token
      )
      await fetchCategories() // Refresh the list
    } catch (error) {
      console.error('Error toggling category status:', error)
    }
  }
  const generateSlug = (name) => {
    if (!name) return '';
    return name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove all non-word chars
        .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and dashes with a single dash
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
  }
  const openCreateModal = () => {
    setEditingCategory(null)
    setFormData({
      name: '',
      description: '',
      icon: '',
      isActive: true
    })
    setShowModal(true)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Manage Categories
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create and manage quiz categories
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            style={{ borderLeft: `4px solid ${category.color}` }}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${
              !category.isActive ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <span className="text-3xl mr-3">{category.icon}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {category.questionsCount} questions
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  category.isActive
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {category.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {category.description}
            </p>

            <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Created: {new Date(category.createdAt).toLocaleDateString()}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(category)}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleToggleStatus(category.id)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm ${
                  category.isActive
                    ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {category.isActive ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter category name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter category description"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Icon (Emoji)
                </label>
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter an emoji (e.g., 🧠)"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category Color
                </label>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="color"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      required
                      className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 p-1"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      required
                      pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="#3B82F6"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Enter a hex color code (e.g., #3B82F6)
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['mixed', 'easy', 'medium', 'hard'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, difficulty: level }))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors
                        ${formData.difficulty === level
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Active (visible to users)
                  </span>
                </label>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingCategory ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCategories