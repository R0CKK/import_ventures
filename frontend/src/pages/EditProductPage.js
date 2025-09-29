import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../utils/axios';
import './AddProductPage.css';

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Product form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    images: [],
    stock: '',
    specifications: {},
    location: {
      port: '',
      city: '',
      state: '',
      country: ''
    },
    tags: []
  });

  // Categories for the dropdown
  const categories = [
    { value: '', label: 'Select a category' },
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

  // Load product data on component mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/products/${id}`);
        const product = response.data.data;
        
        setFormData({
          name: product.name || '',
          description: product.description || '',
          category: product.category || '',
          price: product.price || '',
          images: product.images || [],
          stock: product.stock || 0,
          specifications: product.specifications || {},
          location: {
            port: product.location?.port || '',
            city: product.location?.city || '',
            state: product.location?.state || '',
            country: product.location?.country || 'India'
          },
          tags: product.tags || []
        });
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested location object
    if (name.startsWith('location.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle tags input (comma separated)
  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setSuccess('');
      
      // Prepare form data for API
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0,
        tags: formData.tags.filter(tag => tag) // Remove empty tags
      };

      await axios.put(`/products/${id}`, productData);
      setSuccess('Product updated successfully!');
      
      // Redirect to products list after a delay
      setTimeout(() => {
        navigate('/seller/products');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product');
    }
  };

  // Define example JSON string for specifications field
  const specExample = `{
  "weight": "10kg",
  "dimensions": "50x30x20 cm",
  "material": "steel"
}`;

  if (loading) return <div className="text-center mt-6">Loading product...</div>;
  if (error) return <div className="text-center mt-6 text-red-500">Error: {error}</div>;

  return (
    <div className="add-product-page">
      <div className="container">
        <div className="form-container">
          <h1 className="form-title">Edit Product</h1>
          
          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success text-green-500 mb-4">{success}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                name="description"
                className="form-input"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            
            <div className="form-row">
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
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Stock Quantity</label>
                <input
                  type="number"
                  name="stock"
                  className="form-input"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Tags (comma separated)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.tags.join(', ')}
                  onChange={handleTagsChange}
                  placeholder="e.g. shipping, port, logistics"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Port/Location</label>
              <input
                type="text"
                name="location.port"
                className="form-input mb-2"
                value={formData.location.port}
                onChange={handleChange}
                placeholder="e.g. Jawaharlal Nehru Port, Mumbai"
              />
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    name="location.city"
                    className="form-input"
                    value={formData.location.city}
                    onChange={handleChange}
                    placeholder="City"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="location.state"
                    className="form-input"
                    value={formData.location.state}
                    onChange={handleChange}
                    placeholder="State"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="location.country"
                    className="form-input"
                    value={formData.location.country}
                    onChange={handleChange}
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Image URLs (comma separated)</label>
              <textarea
                name="images"
                className="form-input"
                rows="3"
                value={formData.images.join(', ')}
                onChange={(e) => setFormData({...formData, images: e.target.value.split(',').map(url => url.trim()).filter(url => url)})}
                placeholder="Enter image URLs separated by commas"
              ></textarea>
            </div>
            
            <div className="form-group">
              <label className="form-label">Specifications (JSON format)</label>
              <textarea
                name="specifications"
                className="form-input"
                rows="4"
                value={JSON.stringify(formData.specifications, null, 2)}
                onChange={(e) => {
                  try {
                    const specs = JSON.parse(e.target.value);
                    setFormData({...formData, specifications: specs});
                  } catch (e) {
                    // Handle invalid JSON - maybe set to empty object or show error
                  }
                }}
                placeholder='{"key": "value"}'
              ></textarea>
              <p className="text-muted text-sm mt-1">Enter specifications in JSON format. Example: <code>{specExample}</code></p>
            </div>
            
            <div className="form-group">
              <button type="submit" className="form-button">
                Update Product
              </button>
              <Link to="/seller/products" className="btn btn-outline ml-2">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;