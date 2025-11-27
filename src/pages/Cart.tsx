import { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useProductStore } from '@/store/productStore';
import { Button } from '@/components/ui/enhanced-button';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCartStore();
  const { products, fetchProducts, productsFetched } = useProductStore();
  const { toast } = useToast();

  useEffect(() => {
    if (!productsFetched) {
      fetchProducts();
    }
  }, [productsFetched, fetchProducts]);

  // The cart items already contain the product information
  const cartItems = items.map(cartItem => ({
    productId: cartItem.id,
    quantity: cartItem.quantity,
    product: cartItem
  }));

  const handleClearCart = () => {
    clearCart();
    toast({
      title: 'Cart cleared',
      description: 'All items have been removed from your cart',
    });
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
    toast({
      title: 'Item removed',
      description: 'The item has been removed from your cart',
    });
  };

  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;
    
    // Get the base URL for product links
    const baseUrl = window.location.origin;
    
    const itemsList = cartItems
      .map(item => {
        const productLink = `${baseUrl}/product/${item.product.id}`;
        return `• ${item.product.name} - RS ${item.product.price} x ${item.quantity} = RS ${(item.product.price * item.quantity).toFixed(2)}\nProduct Link: ${productLink}`;
      })
      .join('\n\n');
    
    const totalPrice = getTotalPrice();
    
    const message = `Hello! I'd like to place an order for the following items:\n\n${itemsList}\n\nTotal: RS ${totalPrice.toFixed(2)}\n\nPlease provide payment details and delivery information.`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = "923014539090"; // Using the same number as ProductDetail.tsx
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappLink, '_blank');
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        {cartItems.length > 0 && (
          <Button variant="destructive" onClick={handleClearCart}>
            <Trash2 className="mr-2 h-4 w-4" /> Clear Cart
          </Button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Add products to your cart to see them here</p>
          <Link to="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <tr key={item.productId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 mr-4">
                          <img 
                            className="h-10 w-10 rounded-md object-cover" 
                            src={item.product.image_url || (item.product.images && item.product.images.length > 0 ? item.product.images[0] : '/placeholder.svg')} 
                            alt={item.product.name} 
                          />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      RS {item.product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      RS {(item.product.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveItem(item.productId)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900 font-medium">RS {getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 my-4"></div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-900 font-bold">Total</span>
              <span className="text-gray-900 font-bold">RS {getTotalPrice().toFixed(2)}</span>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <InteractiveHoverButton
              text="WhatsApp"
              className="w-52 h-14 text-base bg-green-600 hover:bg-green-700 border-green-700 shadow-lg hover:shadow-xl transition-shadow duration-300"
              onClick={handleWhatsAppCheckout}
            />
            <p className="text-sm text-gray-500 mt-2">
              Click to send your order via WhatsApp for checkout
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;