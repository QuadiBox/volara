import React from 'react'
import EarningsBarChart from './barchart'
import EngagementLineChart from './linechart'
import FancyDoughnutChart from './doughnut'
import { fetchAllDocuments } from '../db/firestoreService'

const Page = async () => {
    const tasks_from_db = await fetchAllDocuments('requests') || [];
    

    function getMostRequestedEngagement(data) {
        const engagementCounts = {};
      
        // Loop through each item in the array
        data.forEach((item) => {
          const platform = item.platform;
          const { planData } = item;
      
          // Initialize the platform if it doesn't exist in engagementCounts
          if (!engagementCounts[platform]) {
            engagementCounts[platform] = {};
          }
      
          // Count each engagement type within planData
          for (const [engagementType, count] of Object.entries(planData)) {
            if (!engagementCounts[platform][engagementType]) {
              engagementCounts[platform][engagementType] = 0;
            }
            engagementCounts[platform][engagementType] += count;
          }
        });
      
        // Find the most requested engagement type for each platform
        const mostRequested = {};
      
        for (const [platform, engagements] of Object.entries(engagementCounts)) {
          let maxType = null;
          let maxCount = 0;
      
          for (const [type, count] of Object.entries(engagements)) {
            if (count > maxCount) {
              maxCount = count;
              maxType = type;
            }
          }
      
          mostRequested[platform] = { engagement: maxType, requests: maxCount, type: platform };
        }
      
        return mostRequested;
    }

    const { engagement, requests, type } = Object.values(getMostRequestedEngagement(tasks_from_db))[0]
    
    function calculateTotalEngagements(data) {
        let totalEngagements = 0;
      
        data.forEach((item) => {
          // Sum all values in planData for this item
          const itemEngagementTotal = Object.values(item.planData).reduce((sum, value) => sum + value, 0);
          
          // Add this item's engagements to the overall total
          totalEngagements += itemEngagementTotal;
        });
      
        return totalEngagements;
    }

    function getMonthlyTotals(data) {
        const currentYear = new Date().getFullYear();
        const months = [
          "january", "february", "march", "april", "may", "june",
          "july", "august", "september", "october", "november", "december"
        ];
      
        // Initialize result object with 0 for each month
        const monthlyTotals = months.reduce((acc, month) => {
          acc[month] = 0;
          return acc;
        }, {});
      
        // Iterate through data and calculate totals for the current year
        data.forEach((item) => {
          const itemDate = new Date(item.date);
          if (itemDate.getFullYear() === currentYear) {
            const monthIndex = itemDate.getMonth(); // 0 = January, 1 = February, etc.
            const monthName = months[monthIndex];
            monthlyTotals[monthName] += item.amount;
          }
        });
      
        return monthlyTotals;
    }
      
    function sumAmountsByPlatform(data) {
        return data.reduce((totals, item) => {
          const platform = item.platform.toLowerCase(); // Ensure consistent case for platforms
          const amount = parseInt(item.amount, 10) || 0; // Parse the amount to an integer, default to 0 if invalid
          totals[platform] = (totals[platform] || 0) + amount; // Add the amount to the respective platform
          return totals;
        }, {});
    }

    const totalEngagementsNum = calculateTotalEngagements(tasks_from_db);

    const totalActiveTasks = tasks_from_db.filter((elem, idx) => elem?.status === "active");
    const totalPendingTasks = tasks_from_db.filter((elem, idx) => elem?.status === "pending");

    const monthlyTotals = getMonthlyTotals(tasks_from_db);
      
    const platformTotals = sumAmountsByPlatform(tasks_from_db);

    return (
        <div className='dashmainCntn overview'>
            <div className="toptop">
                <div className="unitStat">
                    <h3>Most requested engagement</h3>
                    <h2>{requests} <span>{type} {engagement}</span></h2>
                    <p>This month <span>+65.58%</span></p>
                </div>
                <div className="unitStat">
                    <h3>Total Impressions reached</h3>
                    <h2>{totalEngagementsNum.toLocaleString()} <span>Across all platforms</span></h2>
                    <p>This month <span>+65.58%</span></p>
                </div>
                <div className="unitStat">
                    <h3>Active Tasks</h3>
                    <h2>{totalActiveTasks.length} <span>Across all platforms</span></h2>
                    <p>This month <span>+65.58%</span></p>
                </div>
                <div className="unitStat">
                    <h3>Execution rate</h3>
                    <h2>{(totalActiveTasks.length/totalEngagementsNum).toFixed(2) * 100}% <span>Across all platforms</span></h2>
                    <p>This month <span>+65.58%</span></p>
                </div>
            </div>
            <div className="bottomCntn">
                <div className="lefty">
                    <div className="incometrack">
                        <h2>Earnings overview</h2>
                        <div className="chartCntn">
                            <EarningsBarChart dataset={monthlyTotals}></EarningsBarChart>
                        </div>
                    </div>
                    <div className="incometrack">
                        <h2>Most requested platforms</h2>
                        <div className="chartCntn">
                            <EngagementLineChart dataset={platformTotals}></EngagementLineChart>
                        </div>
                    </div>
                </div>
                <div className="righty">
                    <div className="doughnutChart">
                        <h2>Most engaged platforms</h2>
                        <div className="doughnutCntn">
                            <FancyDoughnutChart dataset={platformTotals}></FancyDoughnutChart>
                        </div>
                    </div>
                    <div className="doughnutChart">
                        <h2>Latest requests ({totalPendingTasks?.length})</h2>
                        <div className="requestsList">
                            {
                                totalPendingTasks?.length > 0 ? (
                                    totalPendingTasks?.map((elem, idx) => (
                                        <div className="unitrequest" key={`latestTasks${idx}`}>
                                            <img src={ elem?.image ? elem?.image : "/telegram.png"} alt="profile picture" />
                                            <div className="center">
                                                <h3>{elem?.userData?.fullname}</h3>
                                                <p>{elem?.userData?.email}</p>
                                            </div>
                                            <div className="center">
                                                <h3>{ elem?.date ? new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(elem?.date) : "Undefined"}</h3>
                                                <p>{ elem?.date ? new Intl.DateTimeFormat('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', }).format(elem?.date) : "Undefined"}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <h2>This is dataset is empty</h2>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page
