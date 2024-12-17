import React, { useState } from 'react';
import './CSS/ManagerInterface.css';
import Orders from './ManagerOrder';
import Reports from './ManagerReports';
import ManageEmployee from './ManageEmployee';
import ManageSales from './ManageSales';
import ManageInventory from './ManageInventory';

/**
 * React component for the Manager Interface.
 * 
 * This component provides a navigation menu for managers to access various sections such as Orders,
 * Inventory, Employees, Sales, and Reports. It dynamically renders the appropriate content based
 * on the selected tab.
 * 
 * @component
 * @returns {JSX.Element} The rendered ManagerInterface component.
 */
function ManagerInterface() {
  const [activeTab ,setTab] = useState(null);

  /**
   * Renders the content based on the currently selected tab.
   * 
   * @returns {JSX.Element} The component corresponding to the active tab.
   */
  const renderContent = () => {
    switch (activeTab) {
        case 'Orders':
            return <Orders/>;
         case 'Inventory':
           return <ManageInventory/>;
        case 'Employee':
            return <ManageEmployee/>;
        case 'Sales':
            return <ManageSales/>;    
        case 'Report':
            return <Reports/>
        default:
            return <ManageEmployee/>;
    }
};

  return (
    <div className="manager-interface">
      <aside className="navibar">
        <button onClick={() => setTab('Orders')}>ORDERS</button>
        <button onClick={() => setTab('Inventory')}>INVENTORY</button>
        <button onClick={() => setTab('Employee')}>EMPLOYEES</button>
        <button onClick={() => setTab('Sales')}>SALES/PRICING</button>
        <button onClick={() => setTab('Report')}>Reports</button>
      </aside>


      <div className='display-content'> 
        {renderContent()}
      </div>


    </div>
  );
}

export default ManagerInterface;