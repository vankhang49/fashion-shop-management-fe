import React, { useState, useEffect } from "react";
import { HeaderDashboard } from "../Header/HeaderDashboard";
import { SidebarDashboard } from "../Sidebar/SidebarDashboard";
import {
  getDailySalesRevenue,
  getDailySoldPricings,
  getMonthlySalesRevenue,
  getMonthlySoldPricings
} from "../../services/bill/bill-service";
import {Link, useParams} from "react-router-dom";
import {DashboardMain} from "../Dashboard/DashboardMain";

const Statistic = () => {
  const {role} = useParams();
  const [isShowSidebar, setIsShowSidebar] = useState(false);
  const [inputType, setInputType] = useState("date");
  const [soldPricings, setSoldPricings] = useState([]);
  const [time, setTime] = useState("");
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    if (inputType === "date") {
      setTime(`${year}-${month}-${day}`);
    } else if (inputType === "month") {
      setTime(`${year}-${month}`);
    }
    fetchData(time);
  }, []);

  const fetchData = async (time) => {
    try {
      let revenue, pricings;
      if (inputType === "date") {
        revenue = await getDailySalesRevenue(time);
        pricings = await getDailySoldPricings(time);
      } else if (inputType === "month") {
        revenue = await getMonthlySalesRevenue(time);
        pricings = await getMonthlySoldPricings(time);
      }
      if (revenue === 0 || pricings.length === 0) {
        setNoData(true);
      } else {
        setNoData(false);
        setTotalRevenue(revenue);
        setSoldPricings(pricings);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData(time);
  };

  return (
      <DashboardMain path={role} content={
            <div className="content-body">
              <div className="content-element">
                <div className="box-content bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-center m-5">Thống kê doanh thu theo ngày và tháng</h2>
                  <div className="flex justify-end mb-4">
                    <button
                        className={`btn-toggle ${
                            inputType === "date"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700"
                        } px-4 py-2 rounded-l-md focus:outline-none`}
                        onClick={() => setInputType("date")}
                    >
                      Ngày
                    </button>
                    <button
                        className={`btn-toggle ${
                            inputType === "month"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700"
                        } px-4 py-2 rounded-r-md focus:outline-none`}
                        onClick={() => setInputType("month")}
                    >
                      Tháng
                    </button>
                  </div>
                  <form className="form-operation space-y-6" onSubmit={handleSubmit}>
                    <div className="form-element">
                      <label
                          htmlFor={inputType}
                          className="max-w-24 w-1/5 block mb-2 text-md font-medium text-gray-900 dark:text-white"
                      >
                        {inputType === "date" ? "Ngày" : "Tháng"}
                      </label>
                      <input
                          type={inputType}
                          id={inputType}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                          onChange={handleTimeChange}
                          value={time} // Bind time value for controlled input
                          required
                      />
                    </div>
                    {noData ? (
                        <p className="text-red-500 text-center">Không có dữ liệu cho thời gian đã chọn</p>
                    ) : (
                        <>
                          <table className="table w-full mt-4 border-collapse border border-gray-300">
                            <thead>
                            <tr className="bg-gray-200">
                              <th className="border border-gray-300 px-4 py-2">Code</th>
                              <th className="border border-gray-300 px-4 py-2">Tên</th>
                              <th className="border border-gray-300 px-4 py-2">Tổng số lượng bán ra</th>
                              <th className="border border-gray-300 px-4 py-2">Giá tiền</th>
                            </tr>
                            </thead>
                            <tbody>
                            {soldPricings.slice(0, 10).map((pricing) => (
                                <tr key={pricing.pricingCode}>
                                  <td className="border border-gray-300 px-4 py-2">{pricing.pricingCode}</td>
                                  <td className="border border-gray-300 px-4 py-2">{pricing.pricingName}</td>
                                  <td className="border border-gray-300 px-4 py-2">{pricing.totalQuantity}</td>
                                  <td className="border border-gray-300 px-4 py-2">{pricing.price}</td>
                                </tr>
                            ))}
                            </tbody>
                          </table>
                          <div className="form-element">
                            <label className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Tổng thu</label>
                            <input
                                type="number"
                                value={totalRevenue}
                                disabled
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                            />
                          </div>
                        </>
                    )}
                    <div className="flex justify-center gap-x-4 mt-4">
                      <button
                          type="submit"
                          className="btn-submit px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      >
                        Xác nhận
                      </button>
                      <button
                          type="button"
                          className="btn-submit px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      >
                        <Link to={`/dashboard/${role}/statistic-by-chart`} style={{color:"white"}}>
                          Hiển thị biểu đồ
                        </Link>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
      }/>
  );
};

export default Statistic;