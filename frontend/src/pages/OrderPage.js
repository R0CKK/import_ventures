import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axios';
import './OrderPage.css';

const OrderPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/orders/${id}`);
        setOrder(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <div className="text-center mt-6">Loading order...</div>;
  if (error) {
    if (error.includes('Not authorized') || error.includes('401') || error.includes('403')) {
      return (
        <div className="text-center mt-6">
          <div className="text-red-500 mb-4">Access Denied</div>
          <p className="mb-4">You don't have permission to view this order. Orders can only be viewed by:</p>
          <ul className="list-disc list-inside text-left max-w-md mx-auto mb-4">
            <li>The <strong>buyer</strong> who placed the order</li>
            <li>The <strong>seller</strong> who listed the products in the order</li>
            <li>An <strong>admin</strong></li>
          </ul>
          {error.includes('401') ? (
            <p className="mb-4">Please <a href="/login" className="text-primary hover:underline">log in</a> to access your orders.</p>
          ) : (
            <p className="mb-4">You may need to log in as the correct account for this order.</p>
          )}
          <div className="text-sm text-muted">
            <p className="mb-2">Troubleshooting tips:</p>
            <ul className="list-disc list-inside text-left max-w-md mx-auto">
              <li>Check if you're logged in with the account that placed the order (buyer)</li>
              <li>OR check if you're logged in as the seller who listed the products in this order</li>
              <li>Remember: Having a 'seller' role doesn't mean you can access all orders - you must be the specific seller of the products in the order</li>
              <li>Try logging out and logging back in</li>
              <li>If you just placed this order, your session might have changed - try logging out and back in</li>
            </ul>
          </div>
        </div>
      );
    }
    return <div className="text-center mt-6 text-red-500">Error: {error}</div>;
  }
  // Check if the order is still loading or if fetchOrder hasn't completed yet
  if (!order && !loading && !error) return <div className="text-center mt-6">Order not found or you don't have permission to view it.</div>;

  return (
    <div className="order-page">
      <div className="container">
        <div className="d-flex justify-between items-center mb-6">
          <h1 className="section-title">Order Invoice</h1>
          <button 
            className="btn btn-outline"
            onClick={() => window.print()}
          >
            Print Invoice
          </button>
        </div>
        
        <div className="invoice-container bg-white p-8 rounded-lg shadow-lg border border-border max-w-4xl mx-auto">
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-8 border-b border-border pb-6">
            <div>
              <h2 className="text-2xl font-bold text-primary">Port Services Marketplace</h2>
              <p className="text-muted">123 Port Authority Street, Mumbai, Maharashtra, India - 400001</p>
              <p className="text-muted">Phone: +91 22 1234 5678 | Email: info@portmarketplace.com</p>
            </div>
            <div className="text-right">
              <h3 className="text-xl font-semibold mb-2">INVOICE</h3>
              <div className="text-lg"><strong>Order #:</strong> {order._id}</div>
              <div className="text-sm text-muted">Date: {new Date(order.createdAt).toLocaleDateString()}</div>
              <div className={`mt-2 px-3 py-1 rounded-full text-sm font-medium inline-block ${
                order.status === 'delivered' ? 'bg-green-500 text-white' :
                order.status === 'shipped' ? 'bg-blue-500 text-white' :
                order.status === 'processing' ? 'bg-yellow-500 text-white' :
                'bg-gray-500 text-white'
              }`}>
                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
              </div>
            </div>
          </div>
          
          {/* Billing and Shipping Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-semibold mb-3">Bill To:</h4>
              <div className="text-sm">
                <div className="font-medium">{order.user?.name || 'N/A'}</div>
                <div>{order.user?.email || 'N/A'}</div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-3">Ship To:</h4>
              <div className="text-sm">
                {order.shippingAddress ? (
                  <>
                    <div className="font-medium">{order.shippingAddress.fullName || 'N/A'}</div>
                    <div>{order.shippingAddress.address || 'N/A'}</div>
                    <div>{order.shippingAddress.city || 'N/A'} - {order.shippingAddress.postalCode || 'N/A'}</div>
                    <div>{order.shippingAddress.country || 'N/A'}</div>
                    <div className="mt-2 font-medium text-secondary">Port: {order.shippingAddress.port || 'N/A'}</div>
                  </>
                ) : (
                  <p>Shipping address not available</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Order Items */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4">Order Items</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3">Product</th>
                    <th className="text-right py-3">Price</th>
                    <th className="text-center py-3">Qty</th>
                    <th className="text-right py-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems && order.orderItems.length > 0 ? (
                    order.orderItems.map(item => (
                      <tr key={item._id || item.product} className="border-b border-border">
                        <td className="py-3">
                          <div className="flex items-center">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded mr-3" />
                            ) : (
                              <div className="w-10 h-10 bg-muted rounded flex items-center justify-center mr-3">
                                <i data-lucide="package" className="text-foreground"></i>
                              </div>
                            )}
                            <div>{item.name}</div>
                          </div>
                        </td>
                        <td className="text-right py-3">₹{item.price?.toLocaleString()}</td>
                        <td className="text-center py-3">{item.quantity}</td>
                        <td className="text-right py-3">₹{(item.price * item.quantity)?.toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-6">No items in this order.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-3">Payment Information</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="capitalize">{order.paymentMethod?.replace('_', ' ') || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span>{order.isPaid ? 'Paid' : 'Pending'}</span>
                </div>
                {order.isPaid && order.paidAt ? (
                  <div className="flex justify-between">
                    <span>Paid on:</span>
                    <span>{new Date(order.paidAt).toLocaleDateString()}</span>
                  </div>
                ) : order.isPaid ? null : (
                  <div className="flex justify-between">
                    <span>Paid on:</span>
                    <span>Pending</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-muted p-4 rounded">
              <h4 className="text-lg font-semibold mb-3">Order Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{order.itemsPrice?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>₹{order.taxPrice?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>₹{order.shippingPrice?.toLocaleString() || '0'}</span>
                </div>
                <div className="border-t border-border pt-2 mt-2 flex justify-between font-bold">
                  <span>Total:</span>
                  <span>₹{order.totalPrice?.toLocaleString() || '0'}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Seller Information */}
          <div className="mt-8 pt-6 border-t border-border">
            <h4 className="text-lg font-semibold mb-3">Seller Information</h4>
            <div className="text-sm">
              {order.seller ? (
                <div>
                  <div className="font-medium">{order.seller.name || 'N/A'}</div>
                  <div>{order.seller.email || 'N/A'}</div>
                  {order.seller.profile && (
                    <div className="mt-2">
                      {order.seller.profile.businessName && (
                        <div className="font-medium">{order.seller.profile.businessName}</div>
                      )}
                      {order.seller.profile.businessAddress && (
                        <div>{order.seller.profile.businessAddress}</div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p>Seller information not available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;