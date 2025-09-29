import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import './AddProductPage.css';

const AddProductPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'port-services',
    price: '',
    stock: 0,
    images: [],
    specifications: {},
    location: { port: '', city: '', state: '', country: 'India' },
    tags: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  const categories = [
    { value: 'port-services', label: 'Port Services' },
    { value: 'customs-clearance', label: 'Customs Clearance' },
    { value: 'container-handling', label: 'Container Handling' },
    { value: 'freight-forwarding', label: 'Freight Forwarding' },
    { value: 'warehousing', label: 'Warehousing' },
    { value: 'logistics', label: 'Logistics' },
    { value: 'documentation', label: 'Documentation' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'other', label: 'Other' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));
  };

  const handleSpecChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value
      }
    }));
  };

  const handleTagChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({
      ...prev,
      tags: tags
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const productData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock)
      };

      const response = await axios.post('/products', productData);
      setSuccess('Product created successfully!');
      
      // Redirect to products list after a short delay
      setTimeout(() => {
        navigate('/seller/products');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-page">
      <div className="container">
        <h1 className="section-title text-center mb-6">Add New Product</h1>
        
        <div className="form-container mx-auto">
          {error && (
            <div className="bg-red-500 text-white p-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-500 text-white p-3 rounded mb-4">
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-4">
              <label className="form-label">Product Name *</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter product name"
              />
            </div>
            
            <div className="form-group mb-4">
              <label className="form-label">Description *</label>
              <textarea
                name="description"
                className="form-input"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Enter product description"
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  name="category"
                  className="form-input"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  className="form-input"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="Enter price"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="form-label">Stock Quantity</label>
                <input
                  type="number"
                  name="stock"
                  className="form-input"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  placeholder="Enter stock quantity"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Tags</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.tags.join(', ')}
                  onChange={handleTagChange}
                  placeholder="Enter tags separated by commas"
                />
                <p className="text-sm text-muted mt-1">Separate tags with commas</p>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="font-semibold mb-3">Location Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Port</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.location.port}
                    onChange={(e) => handleLocationChange('port', e.target.value)}
                    placeholder="Enter port name"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.location.city}
                    onChange={(e) => handleLocationChange('city', e.target.value)}
                    placeholder="Enter city"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.location.state}
                    onChange={(e) => handleLocationChange('state', e.target.value)}
                    placeholder="Enter state"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.location.country}
                    onChange={(e) => handleLocationChange('country', e.target.value)}
                    placeholder="Enter country"
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Specifications</h3>
              <p className="text-sm text-muted mb-3">Add key-value pairs for product specifications (e.g., Duration, Capacity, etc.)</p>
              
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="form-group">
                    <label className="form-label">Key</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., Duration"
                      onKeyUp={(e) => {
                        if (e.key === 'Enter') {
                          const valueInput = document.querySelector('input[placeholder="e.g., 2 hours"]');
                          handleSpecChange(e.target.value, valueInput?.value || '');
                          e.target.value = '';
                          if (valueInput) valueInput.value = '';
                        }
                      }}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Value</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., 2 hours"
                      onKeyUp={(e) => {
                        if (e.key === 'Enter') {
                          const keyInput = document.querySelector('input[placeholder="e.g., Duration"]');
                          handleSpecChange(keyInput?.value || '', e.target.value);
                          if (keyInput) keyInput.value = '';
                          e.target.value = '';
                        }
                      }}
                    />
                  </div>
                </div>
                
                {/* Render existing specifications */}
                {Object.entries(formData.specifications).map(([key, value]) => (
                  <div key={key} className="d-flex justify-between items-center bg-muted p-3 rounded">
                    <div>
                      <span className="font-medium">{key}:</span> {value}
                    </div>
                    <button 
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => {
                        const newSpecs = { ...formData.specifications };
                        delete newSpecs[key];
                        setFormData(prev => ({
                          ...prev,
                          specifications: newSpecs
                        }));
                      }}
                    >
                      <i data-lucide="x"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              type="submit" 
              className="form-button"
              disabled={loading}
            >
              {loading ? 'Creating Product...' : 'Create Product'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;