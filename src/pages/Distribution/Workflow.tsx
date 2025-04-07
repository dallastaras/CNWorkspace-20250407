import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { 
  ArrowLeft,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Bot,
  Truck
} from 'lucide-react';

// Add workflow status type
type WorkflowStatus = 'review' | 'picking' | 'consolidation' | 'delivery' | 'completed';

// Add storage location type
interface StorageLocation {
  category: string;
  location: string;
}

// Update item interface to include storage info
interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  available: number;
  storage: StorageLocation;
  picked?: boolean;
}

// Update order interface
interface Order {
  id: string;
  schoolName: string;
  managerName: string;
  itemCount: number;
  status: 'pending' | 'approved' | 'rejected' | 'delivered';
  submittedAt: string;
  items: OrderItem[];
  workflowStatus: WorkflowStatus;
  delivered?: boolean;
  received?: boolean;
}

const Workflow = () => {
  const navigate = useNavigate();
  const darkMode = useStore((state) => state.darkMode);
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus>('review');
  const [pickedItems, setPickedItems] = useState<Record<string, boolean>>({});
  const [deliveredSchools, setDeliveredSchools] = useState<Record<string, boolean>>({});
  const [receivedSchools, setReceivedSchools] = useState<Record<string, boolean>>({});

  // Mock data with storage locations
  const orders: Order[] = [
    {
      id: '1',
      schoolName: 'Cybersoft High',
      managerName: 'Sarah Johnson',
      itemCount: 4,
      status: 'approved',
      submittedAt: '2025-02-10T08:30:00Z',
      workflowStatus: 'review',
      items: [
        { 
          id: '1', 
          name: 'Whole Grain Bread', 
          quantity: 150, 
          unit: 'loaves', 
          available: 400,
          storage: { category: 'Dry Goods', location: 'A1-23' }
        },
        { 
          id: '2', 
          name: 'Fresh Apples', 
          quantity: 500, 
          unit: 'pieces', 
          available: 1200,
          storage: { category: 'Produce', location: 'P2-15' }
        },
        { 
          id: '3', 
          name: 'Milk Cartons', 
          quantity: 1000, 
          unit: 'units', 
          available: 2500,
          storage: { category: 'Refrigerated', location: 'R3-45' }
        },
        { 
          id: '4', 
          name: 'Chicken Patties', 
          quantity: 400, 
          unit: 'pieces', 
          available: 1000,
          storage: { category: 'Frozen', location: 'F1-12' }
        }
      ]
    }
  ];

  // Group items by storage category for picking
  const itemsByStorage = useMemo(() => {
    const grouped = new Map<string, OrderItem[]>();
    
    orders.forEach(order => {
      order.items.forEach(item => {
        const category = item.storage.category;
        if (!grouped.has(category)) {
          grouped.set(category, []);
        }
        grouped.get(category)!.push({
          ...item,
          picked: pickedItems[`${order.id}-${item.id}`]
        });
      });
    });

    return Array.from(grouped.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [orders, pickedItems]);

  const handlePickItem = (orderId: string, itemId: string) => {
    setPickedItems(prev => ({
      ...prev,
      [`${orderId}-${itemId}`]: true
    }));
  };

  const handleDelivery = (orderId: string) => {
    setDeliveredSchools(prev => ({
      ...prev,
      [orderId]: true
    }));
  };

  const handleReceipt = (orderId: string) => {
    setReceivedSchools(prev => ({
      ...prev,
      [orderId]: true
    }));
  };

  const allItemsPicked = useMemo(() => {
    return orders.every(order => 
      order.items.every(item => 
        pickedItems[`${order.id}-${item.id}`]
      )
    );
  }, [orders, pickedItems]);

  const allOrdersDelivered = useMemo(() => {
    return orders.every(order => deliveredSchools[order.id]);
  }, [orders, deliveredSchools]);

  const allOrdersReceived = useMemo(() => {
    return orders.every(order => receivedSchools[order.id]);
  }, [orders, receivedSchools]);

  const renderWorkflowStep = () => {
    switch (workflowStatus) {
      case 'review':
        return (
          <div className="space-y-6">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
              <h2 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Stock Review
              </h2>
              {orders[0].items.map((item) => (
                <div key={item.id} className="mb-4">
                  <div className="flex justify-between items-center">
                    <span className={darkMode ? 'text-white' : 'text-gray-900'}>{item.name}</span>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {item.quantity} / {item.available} {item.unit}
                    </span>
                  </div>
                </div>
              ))}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setWorkflowStatus('picking')}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Proceed to Picking
                </button>
              </div>
            </div>
          </div>
        );

      case 'picking':
        return (
          <div className="space-y-6">
            {itemsByStorage.map(([category, items]) => (
              <div key={category} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
                <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {category}
                </h3>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={`${item.id}`} className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {item.name}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Location: {item.storage.location}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {item.quantity} {item.unit}
                        </span>
                        <button
                          onClick={() => handlePickItem(item.id, item.id)}
                          disabled={item.picked}
                          className={`px-3 py-1.5 rounded-lg text-sm ${
                            item.picked
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                              : 'bg-indigo-600 text-white hover:bg-indigo-700'
                          }`}
                        >
                          {item.picked ? 'Picked' : 'Pick'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {allItemsPicked && (
              <div className="flex justify-end">
                <button
                  onClick={() => setWorkflowStatus('consolidation')}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Start Consolidation
                </button>
              </div>
            )}
          </div>
        );

      case 'consolidation':
        return (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
                <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {order.schoolName}
                </h3>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {item.name}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {item.quantity} {item.unit}
                        </p>
                      </div>
                      {pickedItems[`${order.id}-${item.id}`] && (
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          darkMode ? 'bg-green-400/10 text-green-400' : 'bg-green-100 text-green-700'
                        }`}>
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Ready
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex justify-end">
              <button
                onClick={() => setWorkflowStatus('delivery')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Start Delivery
              </button>
            </div>
          </div>
        );

      case 'delivery':
        return (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {order.schoolName}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {order.items.length} items
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleDelivery(order.id)}
                      disabled={deliveredSchools[order.id]}
                      className={`px-3 py-1.5 rounded-lg text-sm ${
                        deliveredSchools[order.id]
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {deliveredSchools[order.id] ? 'Delivered' : 'Mark Delivered'}
                    </button>
                    <button
                      onClick={() => handleReceipt(order.id)}
                      disabled={!deliveredSchools[order.id] || receivedSchools[order.id]}
                      className={`px-3 py-1.5 rounded-lg text-sm ${
                        receivedSchools[order.id]
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                          : !deliveredSchools[order.id]
                          ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {receivedSchools[order.id] ? 'Received' : 'Confirm Receipt'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {allOrdersDelivered && allOrdersReceived && (
              <div className="flex justify-end">
                <button
                  onClick={() => setWorkflowStatus('completed')}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Complete Distribution
                </button>
              </div>
            )}
          </div>
        );

      case 'completed':
        return (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6 text-center`}>
            <CheckCircle2 className={`w-12 h-12 mx-auto mb-4 ${
              darkMode ? 'text-green-400' : 'text-green-600'
            }`} />
            <h2 className={`text-xl font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Distribution Completed
            </h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              All orders have been successfully delivered and received.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/distribution')}
            className={`flex items-center space-x-2 ${
              darkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Distribution</span>
          </button>
          <div className={`w-px h-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
          <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Distribution Workflow
          </h1>
        </div>
      </div>

      {/* Workflow progress */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
        <div className="flex justify-between">
          {['review', 'picking', 'consolidation', 'delivery', 'completed'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`flex flex-col items-center ${
                index < ['review', 'picking', 'consolidation', 'delivery', 'completed'].indexOf(workflowStatus)
                  ? 'opacity-50'
                  : ''
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === workflowStatus
                    ? 'bg-indigo-600 text-white'
                    : darkMode
                    ? 'bg-gray-700 text-gray-400'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {index + 1}
                </div>
                <span className={`text-xs mt-1 capitalize ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {step}
                </span>
              </div>
              {index < 4 && (
                <div className={`w-24 h-px mx-2 ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Render current workflow step */}
      {renderWorkflowStep()}
    </div>
  );
};

export default Workflow;