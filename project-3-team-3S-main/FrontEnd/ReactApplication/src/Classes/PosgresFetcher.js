import OrderClass from "./Orders";

/**
 * Used to help with api requests for db info
 * @class PostgresFetcher
 * @example
 * const myFetcher = new PostgresFetcher("API.Route/api");
 * myFetcher.Function();
 */
export default class PostgresFetcher {

    constructor(DefaultURl = "http://localhost:8080/api") {
        this.DefaultURl = DefaultURl+ "/db/request";
        this.MaxOrderIdURL = DefaultURl+ "/db/maxOrderId";
        this.OrderHistoryURL = DefaultURl + "/db/send/orderhistory";
        this.OrderItemsURL = DefaultURl + "/db/send/orderitems"
    }

    /**
     * Used to fetch data from table
     * @param {String} TableName 
     * @returns {JSON} data - output data from table
     */
    async GetAllRows(TableName) {
        try {
            const response = await fetch(`${this.DefaultURl}/${TableName}`);

            if(!(response.ok)) {
                throw new Error('Can\'t connect to the database api ');
            }

            const data = await response.json();
            
            return data.output;

        }
        catch(error) {
            console.error("Error getting table: " ,error);
            throw new Error("Failed to retrieve all rows in a table");
        }
    }

    /**
     * Gets data from specific column form a table
     * @param {String} TableName - Name of table
     * @param {String} ColumnName - Name of collumn
     * @returns {JSON} - Data from column
     */
    async GetColumn(TableName,ColumnName) {
        try {
        const response = await fetch(`${this.DefaultURl}/${TableName}/${ColumnName}`)
        if(!(response.ok)) {
            throw new Error(' Can\'t connect to database api');
        }

        const data = await response.json();
        return data.output[ColumnName];

        }
        catch(error) {
            console.error("Error getting table: " ,error);
            throw new Error("Failed to retrieve all rows in a table");
        }
    }
 
    /**
     * Gets data from a row in a table
     * @param {String} TableName = Name of table
     * @param {String} ColumnName - Name of column
     * @param {String} ConditonColumn - Name of condition
     * @param {String} CondtionValue - name of comparison value
     * @returns {JSON} - Data from rows
     */
    async GetCertainRows(TableName,ColumnName,ConditonColumn,CondtionValue) {

        try{
            const response = await fetch(`${this.DefaultURl}/${TableName}/${ColumnName}/${ConditonColumn}/${CondtionValue}`)

            if(!(response.ok)) {
                throw new Error(' Can\'t connect to database api');
            }

            const data = await response.json();
            return data.output[ColumnName];
    
            }
            catch(error) {
                console.error("Error getting table: " ,error);
                throw new Error("Failed to retrieve all rows in a table");
            }

    }

    /**
     * Used to send a custom sql query
     * @param {String} SQLQuery 
     * @param {String} ColumnName - Specify to get data from a specific column
     * @returns {JSON} - Data retured from query
     */
    async CustomSQL(SQLQuery, ColumnName = '') {
        //request that holds the custom query
        const request = {
            query: SQLQuery,
        };

        try {
            //have to use this to do custom sql statements
            const response = await fetch(this.DefaultURl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify(request),

            });

            if(!(response.ok)) {
                throw new Error(' Can\'t connect to database api');
            }
            
            const data = await response.json();
            console.log(data);

            if(ColumnName != '') {
              return data.output.map(row => row[ColumnName]);
            } 
            else {
              return data.output;
            }
        } 
        catch (error) {
            console.error("Error getting table: " ,error);
            throw new Error("Failed to retrieve all rows in a table");
        }
    }

    /**
     * Used to check the availability of an item
     * @param {String} ItemName 
     * @returns {Boolean} - Returns True if more than 1 of the item is available
     */
    async checkItemAvailability(ItemName) {
        let AvaiableBool = true;
        let query = ""

        try{
            query = `SELECT amount FROM menu_items WHERE food_name ='${ItemName}'`
            console.log("Query: ", query);
            const out = await this.CustomSQL(query);
            if(out[0].amount <= 0){
                AvaiableBool = false;
            }
        }
        catch(error){
            console.error("Error  checking availablility: " ,error);
        }

        return AvaiableBool;
    }

    /**
     * Used to check the availability of an entire order
     * @param {OrderClass[]} OrderClass 
     * @returns {Stringp[]} - List of items that are out of stock in the order
     */
    async checkOrderAvailable(OrderClass){
        let ItemNames = [];
        let ItemCounts = [];
        let ItemsOut = [];

        // Get a count of each food item in an order
        for(let i = 0; i < OrderClass.length; i++){
            console.log("order count: ", i);
            let EntreeList = OrderClass[i].EntreeList;
            let SideList = OrderClass[i].SideList;
            let Appetizer = OrderClass[i].Appetizer;
            let Drink = OrderClass[i].Drink;

            // Add Entrees 
            if(OrderClass[i].EntreeSize !== 0) {
                for(let j = 0; j < OrderClass[i].EntreeSize; j++){
                    const itemPos = ItemNames.indexOf(EntreeList[j]);
                    if(itemPos !== -1){
                        let count = ItemCounts[itemPos];
                        count += 1;
                        ItemCounts[itemPos] = count;
                    }
                    else{
                        ItemNames.push(EntreeList[j]);
                        ItemCounts.push(1);
                    }
                }
            }

            // Add Sides
            if(OrderClass[i].SideSize !== 0) {
                for(let j = 0; j < OrderClass[i].SideSize; j++){
                    const itemPos = ItemNames.indexOf(SideList[j]);
                    if(itemPos !== -1){
                        let count = ItemCounts[itemPos];
                        count += 1;
                        ItemCounts[itemPos] = count;
                    }
                    else{
                        ItemNames.push(SideList[j]);
                        ItemCounts.push(1);
                    }
                }
            }
            
            // Add Appetizer
            if(Appetizer){
                const itemPos = ItemNames.indexOf(Appetizer);
                    if(itemPos !== -1){
                        let count = ItemCounts[itemPos];
                        count += 1;
                        ItemCounts[itemPos] = count;
                    }
                    else{
                        ItemNames.push(Appetizer);
                        ItemCounts.push(1);
                    }
            }

            // Add Drink
            if(Drink){
                const itemPos = ItemNames.indexOf(Appetizer);
                    if(itemPos !== -1){
                        let count = ItemCounts[itemPos];
                        count += 1;
                        ItemCounts[itemPos] = count;
                    }
                    else{
                        ItemNames.push(Appetizer);
                        ItemCounts.push(1);
                    }
            }

        }

        // Check if theres enough of each food item
        for(let i = 0; i < ItemNames.length; i++){
            let requiredAmount = ItemCounts[i];
            let query = ""
            try{
                query = `SELECT amount FROM menu_items WHERE food_name='${ItemNames[i]}'`
                const out = await this.CustomSQL(query);
                if(out[0].amount < requiredAmount){
                    ItemsOut.push(ItemNames[i]);
                }
            }
            catch(error){
                console.error("Error  checking availablility: " ,error, " \n Query: ", query);        
            }
        }

        // Send a list of food items that there are not enough of. 
        console.log(ItemsOut);
        return ItemsOut;
    }

    /**
     * Used to update the combo_items table
     * @param {string} item_name - name of the item 
     * @param {float} price - price of the item
     * @param {int} comboid - associated comboid
     */
    async SendCombo(item_name, price , comboid){
        // get the next avaiable item id

        let query = "";
        // send sql query to add the item 
        try{
            query = `INSERT INTO combo_items (item_name, comboid, base_price) VALUES('${item_name}', ${comboid}, ${price})`;
            const out = await this.CustomSQL(query);
        }
        catch(error){
            console.error("Error posting combo_item: ", error, " ", query);
        }
    }

    /**
     * Used to update the db with the incoming order
     * @param {OrderClass[]} OrderClass - list of all ordered items
     * @param {float} Price - Total cost of the order
     */
    async SendOrder(OrderClass, Price) {
        let orderid = -1;


        // Get orderid
        try{
            const response = await fetch(`${this.MaxOrderIdURL}`);

            if(!(response.ok)) {
                throw new Error('OrderID: Can\'t connect to database api');
            }
            const data = await response.json();
            console.log("max orderid data: ", data);
            console.log("raw max orderid: ", data.output[0].max);
            orderid = data.output[0].max + 1;
            console.log("max orderid: ", orderid);  
        }
        catch(error) {
            console.error("Error getting table: " ,error);
            throw new Error("Failed to retrieve all rows in a table");
        }

        // update order_list table
        if (Array.isArray(OrderClass) && OrderClass.length > 0){
            // Create Order History Entry
            try{
                const response = await fetch(`${this.OrderHistoryURL}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        orderid: orderid,
                        totalCost: Price
                    })
                });
    
                if(!(response.ok)) {
                    throw new Error('OrderHistory: Can\'t connect to database api');
                }
            }
            catch(error) {
                console.error("Error getting table: " ,error);
                throw new Error("OrderHistory: Failed to retrieve all rows in a table");
            }


            for(let i = 0; i < OrderClass.length; i++){
                let Type = OrderClass[i].Type;  
                let EntreeList = OrderClass[i].EntreeList;
                let SideList = OrderClass[i].SideList;
                let Appetizer = OrderClass[i].Appetizer;
                let Drink = OrderClass[i].Drink;
                let price = OrderClass[i].Price;
                const testitemid = -1;
                let comboid = -1;
                console.log(Type);
                // get the combo id for the order item
                try{
                    let query = 'SELECT MAX(comboid) FROM combo_items;'
                    const out = await this.CustomSQL(query);
                    comboid = out[0].max+1;
                }
                catch(error){
                    console.error("Error getting MAX combo ids: " ,error);
                }

                console.log("Combo ID: ", comboid);

                // add item to order list
                const response = await fetch(`${this.OrderItemsURL}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        orderid: orderid,
                        type: Type,
                        item: comboid
                    })
                });
                if(!(response.ok)) {
                    console.log("Error EntreeList Query ");
                    throw new Error('EntreeList: Can\'t connect to database api');
                }
    
                // add items to combo items
                if (Array.isArray(EntreeList) && EntreeList.length > 0){
                    for(let j = 0; j < EntreeList.length; j++){
                        this.SendCombo(EntreeList[j], price, comboid);   
                    }   
                }
                if (Array.isArray(SideList) && SideList.length > 0){
                    for(let k = 0; k < SideList.length; k++){
                        let maxid = this.SendCombo(SideList[k], price, comboid) 
                    }
                }
                if (Drink) {
                    this.SendCombo(Drink, price, comboid);
                }
                if (Appetizer){
                    this.SendCombo(Appetizer, price, comboid);
                }
            }
        }
        else {
            console.log("orderclass empty")
        }
        
    }


}