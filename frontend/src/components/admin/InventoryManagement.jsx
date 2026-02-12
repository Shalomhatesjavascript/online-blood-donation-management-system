import React, { useState, useEffect } from "react";
import { inventoryService } from "../../services/inventoryService";
import { useToast } from "../../context/ToastContext"; // FIXED IMPORT
import Card from "../common/Card";
import Button from "../common/Button";
import ConfirmModal from "../common/ConfirmModal";
import { Plus, Trash2, Package, Download } from "lucide-react";
import { formatDate } from "../../utils/helpers";
import AddBloodUnitModal from "./AddBloodUnitModal";
import { exportToCSV } from "../../utils/exportCSV";

const InventoryManagement = ({ onRefresh }) => {
  const toast = useToast();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, [filter]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const params = filter !== "all" ? { status: filter } : {};
      const response = await inventoryService.getInventory(params);
      setInventory(response.data);
    } catch (error) {
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (unit) => {
    setUnitToDelete(unit);
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await inventoryService.deleteBloodUnit(unitToDelete.unit_id);
      toast.success("Blood unit deleted successfully");
      setShowConfirmDelete(false);
      setUnitToDelete(null);
      fetchInventory();
      onRefresh();
    } catch (error) {
      toast.error("Failed to delete blood unit");
    } finally {
      setDeleting(false);
    }
  };

  const handleUpdateStatus = async (unitId, newStatus) => {
    try {
      await inventoryService.updateBloodUnit(unitId, { status: newStatus });
      toast.success("Status updated successfully");
      fetchInventory();
      onRefresh();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleUnitAdded = () => {
    setShowAddModal(false);
    toast.success("Blood unit added successfully!");
    fetchInventory();
    onRefresh();
  };

  const handleExport = () => {
    if (inventory.length === 0) {
      toast.warning("No inventory to export");
      return;
    }

    const headers = [
      { key: "unit_id", label: "Unit ID" },
      { key: "blood_group", label: "Blood Group" },
      { key: "donation_date", label: "Donation Date" },
      { key: "expiration_date", label: "Expiration Date" },
      { key: "storage_location", label: "Storage Location" },
      { key: "Donor.full_name", label: "Donor Name" },
      { key: "Donor.phone", label: "Donor Phone" },
      { key: "status", label: "Status" },
    ];

    exportToCSV(inventory, "blood_inventory", headers);
    toast.success("Inventory exported successfully!");
  };

  return (
    <>
      <Card className="p-6">
        {/* Header Section - ALWAYS VISIBLE */}
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
              variant="success"
              onClick={handleExport}
              className="flex items-center gap-2"
              disabled={inventory.length === 0}
            >
              <Download size={20} />
              Export CSV
            </Button>

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

        {/* Content Section */}
        {loading ? (
          // LOADING SPINNER
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-blood-red border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading inventory...</p>
          </div>
        ) : inventory.length === 0 ? (
          // EMPTY STATE
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No inventory items found</p>
            <p className="text-gray-400 text-sm mt-2 mb-4">
              {filter !== "all"
                ? `No units with status "${filter}"`
                : "Add blood units to get started"}
            </p>
            {filter === "all" && (
              <Button
                variant="primary"
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 mx-auto"
              >
                <Plus size={20} />
                Add First Unit
              </Button>
            )}
          </div>
        ) : (
          // INVENTORY TABLE
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Blood Group
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Donation Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Expiration
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Storage
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Donor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Actions
                  </th>
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
                        <span className="text-white font-bold text-sm">
                          {unit.blood_group}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {formatDate(unit.donation_date)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {formatDate(unit.expiration_date)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {unit.storage_location}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {unit.Donor?.full_name || "Unknown"}
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={unit.status}
                        onChange={(e) =>
                          handleUpdateStatus(unit.unit_id, e.target.value)
                        }
                        className={`
                          px-3 py-1 rounded-full text-xs font-semibold border-2 cursor-pointer
                          ${
                            unit.status === "available"
                              ? "bg-success-light border-success text-success-dark"
                              : unit.status === "used"
                                ? "bg-medical-blue-light border-medical-blue text-medical-blue-dark"
                                : unit.status === "expired"
                                  ? "bg-danger-light border-danger text-danger-dark"
                                  : "bg-gray-200 border-gray-400 text-gray-700"
                          }
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
                        onClick={() => handleDeleteClick(unit)}
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
      </Card>

      {/* Add Blood Unit Modal */}
      {showAddModal && (
        <AddBloodUnitModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleUnitAdded}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && unitToDelete && (
        <ConfirmModal
          isOpen={showConfirmDelete}
          onClose={() => {
            setShowConfirmDelete(false);
            setUnitToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Delete Blood Unit"
          message={`Are you sure you want to delete this ${unitToDelete.blood_group} blood unit from ${unitToDelete.storage_location}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          loading={deleting}
        />
      )}
    </>
  );
};

export default InventoryManagement;