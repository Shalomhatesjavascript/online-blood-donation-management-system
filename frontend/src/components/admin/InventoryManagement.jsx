import React, { useState, useEffect } from 'react';
import { inventoryService } from '../../services/inventoryService';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import Alert from '../common/Alert';
import { Plus, Trash2, Package } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import AddBloodUnitModal from './AddBloodUnitModal';
const InventoryManagement = ({ onRefresh }) => {
const [inventory, setInventory] = useState([]);
const [loading, setLoading] = useState(true);
const [showAddModal, setShowAddModal] = useState(false);
const [alertMessage, setAlertMessage] = useState(null);
const [filter, setFilter] = useState('all');
useEffect(() => {
fetchInventory();
}, [filter]);
const fetchInventory = async () => {
try {
setLoading(true);
const params = filter !== 'all' ? { status: filter } : {};
const response = await inventoryService.getInventory(params);
setInventory(response.data);
} catch (error) {
setAlertMessage({
type: 'error',
message: 'Failed to load inventory'
});
} finally {
setLoading(false);
}
};
const handleDelete = async (unitId) => {
if (!confirm('Are you sure you want to delete this blood unit?')) return;
try {
  await inventoryService.deleteBloodUnit(unitId);
  setAlertMessage({
    type: 'success',
    message: 'Blood unit deleted successfully'
  });
  fetchInventory();
  onRefresh();
} catch (error) {
  setAlertMessage({
    type: 'error',
    message: 'Failed to delete blood unit'
  });
}
};
const handleUpdateStatus = async (unitId, newStatus) => {
try {
await inventoryService.updateBloodUnit(unitId, { status: newStatus });
setAlertMessage({
type: 'success',
message: 'Status updated successfully'
});
fetchInventory();
onRefresh();
} catch (error) {
setAlertMessage({
type: 'error',
message: 'Failed to update status'
});
}
};
const handleUnitAdded = () => {
setShowAddModal(false);
setAlertMessage({
type: 'success',
message: 'Blood unit added successfully!'
});
fetchInventory();
onRefresh();
};
return (
<Card className="p-6">
{alertMessage && (
<Alert
type={alertMessage.type}
message={alertMessage.message}
onClose={() => setAlertMessage(null)}
className="mb-4"
/>
)}
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
    <h2 className="text-xl font-bold text-gray-900">Blood Inventory</h2>

    <div className="flex flex-wrap gap-3">
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blood-red focus:ring-2 focus:ring-blood-red-light"
      >
        <option value="all">All Status</option>
        <option value="available">Available</option>
        <option value="used">Used</option>
        <option value="expired">Expired</option>
        <option value="discarded">Discarded</option>
      </select>

      <Button
        variant="primary"
        onClick={() => setShowAddModal(true)}
        className="flex items-center gap-2"
      >
        <Plus size={20} />
        Add Blood Unit
      </Button>
    </div>
  </div>

  {loading ? (
    <div className="text-center py-12">
      <div className="w-12 h-12 border-4 border-blood-red border-t-transparent rounded-full animate-spin mx-auto"></div>
    </div>
  ) : inventory.length === 0 ? (
    <div className="text-center py-12">
      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500 font-medium">No inventory items found</p>
      <p className="text-gray-400 text-sm mt-2 mb-4">
        Add blood units to get started
      </p>
      <Button
        variant="primary"
        onClick={() => setShowAddModal(true)}
        className="flex items-center gap-2 mx-auto"
      >
        <Plus size={20} />
        Add First Unit
      </Button>
    </div>
  ) : (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b-2 border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Blood Group</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Donation Date</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Expiration</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Storage</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Donor</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {inventory.map((unit, index) => (
            <tr
              key={unit.unit_id}
              className="hover:bg-gray-50 transition-colors animate-fadeIn"
              style={{ animationDelay: `${index * 0.03}s` }}
            >
              <td className="px-4 py-4">
                <div className="w-10 h-10 rounded-full bg-blood-red flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{unit.blood_group}</span>
                </div>
              </td>
              <td className="px-4 py-4 text-sm text-gray-900">{formatDate(unit.donation_date)}</td>
              <td className="px-4 py-4 text-sm text-gray-900">{formatDate(unit.expiration_date)}</td>
              <td className="px-4 py-4 text-sm text-gray-900">{unit.storage_location}</td>
              <td className="px-4 py-4 text-sm text-gray-600">
                {unit.Donor?.full_name || 'Unknown'}
              </td>
              <td className="px-4 py-4">
                <select
                  value={unit.status}
                  onChange={(e) => handleUpdateStatus(unit.unit_id, e.target.value)}
                  className={`
                    px-3 py-1 rounded-full text-xs font-semibold border-2 cursor-pointer
                    ${unit.status === 'available' ? 'bg-success-light border-success text-success-dark' :
                      unit.status === 'used' ? 'bg-medical-blue-light border-medical-blue text-medical-blue-dark' :
                      unit.status === 'expired' ? 'bg-danger-light border-danger text-danger-dark' :
                      'bg-gray-200 border-gray-400 text-gray-700'}
                  `}
                >
                  <option value="available">Available</option>
                  <option value="used">Used</option>
                  <option value="expired">Expired</option>
                  <option value="discarded">Discarded</option>
                </select>
              </td>
              <td className="px-4 py-4">
                <button
                  onClick={() => handleDelete(unit.unit_id)}
                  className="text-danger hover:text-danger-dark transition-colors p-2 rounded-lg hover:bg-danger-light"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}

  {showAddModal && (
    <AddBloodUnitModal
      onClose={() => setShowAddModal(false)}
      onSuccess={handleUnitAdded}
    />
  )}
</Card>
);
};
export default InventoryManagement;
