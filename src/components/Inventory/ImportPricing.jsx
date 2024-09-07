import React, { useState, useEffect, useCallback } from "react";
import {jwtDecode} from "jwt-decode";
import "./ImportPricing.scss";
import { HeaderDashboard } from "../Header/HeaderDashboard";
import { SidebarDashboard } from "../Sidebar/SidebarDashboard";
import { getPricingList, createReceipt, updatePricingQuantity } from "../../services/pricing/PricingService";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useParams} from "react-router-dom";
import {DashboardMain} from "../Dashboard/DashboardMain";

const ImportPricing = () => {
  const {role} = useParams();
  const [isShowSidebar, setIsShowSidebar] = useState(false);
  const [receipt, setReceipt] = useState({});
  const [pricings, setPricings] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await getReceipt();
      await fetchPricingList();
    };
    fetchData();
  }, []);

  useEffect(() => {
    setIsConfirmed(selectedItems.length > 0);
  }, [selectedItems]);

  const getReceipt = async () => {
    const token = localStorage.getItem("token");
    const receipt = await createReceipt(token);
    setReceipt(receipt);
    const decoded = jwtDecode(token);
    setReceipt({ ...receipt, username: decoded.username });
  };

  const fetchPricingList = async () => {
    const token = localStorage.getItem("token");
    const list = await getPricingList(token);
    setPricings(list);
  };

  const callbackFunction = (childData) => {
    setIsShowSidebar(childData);
  };

  const handleSelect = (event) => {
    const selectedPricingId = parseInt(event.target.value);
    const selectedPricing = pricings.find((p) => p.pricingId === selectedPricingId);
    if (selectedPricing && !selectedItems.some((item) => item.pricingId === selectedPricingId)) {
      setSelectedItems([...selectedItems, { ...selectedPricing, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (id, quantity) => {
    setSelectedItems(selectedItems.map(item =>
        item.pricingId === id ? { ...item, quantity: quantity } : item
    ));
  };

  const handleRemove = (id) => {
    setSelectedItems(selectedItems.filter(item => item.pricingId !== id));
  };

  const handleConfirm = useCallback(async () => {
    try {
      setReceipt(prevReceipt => ({ ...prevReceipt, pricingList: selectedItems }));
      const token = localStorage.getItem("token");
      await updatePricingQuantity(token, { ...receipt, pricingList: selectedItems });
      toast.success('Xác nhận thành công!');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  }, [selectedItems, receipt]);

  const handleClearAll = () => {
    setSelectedItems([]);
  };

  return (
      <DashboardMain path={role} content={
            <div className="content-body mt-14">
              <div className="content-element">
                <div className="flex justify-center">
                  <form className="m-5 w-full">
                    <h2 className="text-center">Nhập liệu</h2>
                    <div className="flex justify-center m-5 gap-16">
                      <label
                          htmlFor="billId"
                          className="max-w-24 w-1/5 block mb-2 text-md font-medium text-gray-900 dark:text-white"
                      >
                        Mã phiếu
                      </label>
                      <input
                          id="billId"
                          type="text"
                          value={receipt.receiptId}
                          disabled
                          className="w-3/5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                    </div>
                    <div className="flex justify-center m-5 gap-16">
                      <label
                          htmlFor="inputPerson"
                          className="max-w-24 w-1/5 block mb-2 text-md font-medium text-gray-900 dark:text-white"
                      >
                        Người nhập
                      </label>
                      <input
                          id="inputPerson"
                          type="text"
                          value={receipt.username}
                          disabled
                          className="w-3/5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                    </div>
                    <div className="flex justify-center m-5 gap-16">
                      <label
                          htmlFor="date"
                          className="max-w-24 w-1/5 block mb-2 text-md font-medium text-gray-900 dark:text-white"
                      >
                        Ngày/tháng/năm
                      </label>
                      <input
                          id="date"
                          type="text"
                          value={receipt.date}
                          disabled
                          className="w-3/5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                    </div>
                    <div className="flex justify-center m-5 gap-16">
                      <label
                          htmlFor="date"
                          className="max-w-24 w-1/5 block mb-2 text-md font-medium text-gray-900 dark:text-white"
                      >
                        Hàng hóa
                      </label>
                      <select
                          id="countries"
                          className="w-3/5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          onChange={handleSelect}
                      >
                        <option value="">Chọn hàng hóa</option>
                        {pricings && pricings.map((pricing) => (
                            <option key={pricing.pricingId} value={pricing.pricingId}>{pricing.pricingName}</option>
                        ))}
                      </select>
                    </div>

                    <div className="relative">
                      <table className="table w-full text-center">
                        <thead>
                        <tr>
                          <th className="p">Id</th>
                          <th>Mã hàng</th>
                          <th className="emp-name">Tên hàng</th>
                          <th>Size</th>
                          <th>Đơn giá</th>
                          <th>Màu sắc</th>
                          <th>Số lượng</th>
                          <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {selectedItems.map((item) => (
                            <tr key={item.pricingId}>
                              <td>{item.pricingId}</td>
                              <td>{item.pricingCode}</td>
                              <td>{item.pricingName}</td>
                              <td>{item.size}</td>
                              <td>{item.price}</td>
                              <td>{item.color.colorName}</td>
                              <td>
                                <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => handleQuantityChange(item.pricingId, e.target.value)}
                                    className="block w-full p-1 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
                                />
                              </td>
                              <td>
                                <button
                                    type="button"
                                    onClick={() => handleRemove(item.pricingId)}
                                    className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-2 py-2 text-center me-2 mb-2"
                                >
                                  Hủy
                                </button>
                              </td>
                            </tr>
                        ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex justify-center gap-x-4 mt-4">
                      <button
                          type="button"
                          onClick={handleConfirm}
                          disabled={!isConfirmed}
                          className={`text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-2 py-2 text-center me-2 mb-2 ${!isConfirmed ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        Xác nhận
                      </button>
                      <button
                          type="button"
                          onClick={handleClearAll}
                          className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-2 py-2 text-center me-2 mb-2"
                      >
                        Xóa toàn bộ
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
      }/>
  );
};

export default ImportPricing;
