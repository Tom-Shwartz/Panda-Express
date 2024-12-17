import React from "react";


/**
 * Creates an object for a selected item 
 * @class OrderClass
 * @example 
 * const myOrder = new OrderClass("Type", 12.23, ["item1", "item2", ...], ["item1", "item2", ...], "Item", "Item");
 * myOrder.Type;
 */
class OrderClass {
    static id_count = 0;

    /**
     * Constructs the Order item object
     * @param {String} Type - Type of the order
     * @param {float} Price - Price of the order
     * @param {String[]} EntreeList - List of Entrees in order
     * @param {String[]} SideList - List of sides in order
     * @param {String} Appetizer - Appetizer in order
     * @param {String} Drink - Drink in order
     */
    constructor(Type = "", Price = 0,EntreeList = [], SideList = [], Appetizer = "", Drink = ""){
        this.Type = Type;
        this.EntreeSize = EntreeList.length;
        this.SideSize = SideList.length;
        this.EntreeList = EntreeList;
        this.SideList = SideList;
        this.Appetizer = Appetizer;
        this.Price = Price;
        this.Drink = Drink;

        OrderClass.id_count += 1;
        this.id = OrderClass.id_count;
    }

    /**
     * Resets the global id counter for each OrderClass object
     */
    resetID(){
        OrderClass.id_count = 0;
    }

    
    /**
     * Gets either the Appetizer or Drink of the object
     * @returns {String}
     */ 
    getExtras(){
        if (this.Drink === ""){
            return this.Appetizer;
        }
        else{
            return this.Drink;
        }
    }

    /**
     * Prints into the console all data contained in the OrderClass object
     */
    print() {
        console.log(`
        ID: ${this.id}
        Type: ${this.Type}
        --------
        Entree Size: ${this.EntreeSize}
        Entrees: ${this.EntreeList}
        --------
        Side Size: ${this.SideSize}
        Sides: ${this.SideList}
        --------
        Drink: ${this.Drink}
        --------
        Appetizer: ${this.Appetizer}
        --------
        Price: ${this.Price}
            `);
    }

    /**
     * Compares this OrderClass to another
     * @param {OrderClass} otherOrder - order to compare against
     * @returns {boolean} - If the two orders are the same, returns true, otherwise false
     */
    equals(otherOrder) {
        if (!(otherOrder instanceof OrderClass)) {
            return false;
        }
        return JSON.stringify(this.Type) === JSON.stringify(otherOrder.Type) &&
               this.Price === otherOrder.Price &&
               JSON.stringify(this.Appetizer) === JSON.stringify(otherOrder.Appetizer) &&
               this.Drink === otherOrder.Drink &&
               this.Count === otherOrder.Count &&
               this.EntreeSize === otherOrder.EntreeSize &&
               this.SideSize === otherOrder.SideSize &&
               JSON.stringify(this.EntreeList) === JSON.stringify(otherOrder.EntreeList) &&
               JSON.stringify(this.SideList) === JSON.stringify(otherOrder.SideList);
    }

}

export default OrderClass;