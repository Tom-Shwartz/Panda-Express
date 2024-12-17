import csv
import random
import datetime
import math

"""
    OrderID INTEGER,
    TotalCost DECIMAL(7,2),
    Items INTEGER[], 
    OrderDate DATE
"""

# vars for amount of weeks
weeks = 39

maxamountofmenuitems = 5329

totalorders = 0



#apply no weekend settings?
noweekends = True

# list of each order type

# with weekends: 191-233
# without weekends: 266-326
normalMinOrders = 266
normalMaxOrders = 326
normalOrderChance = 40


# with weekends: 250-300
# without weekends: 400-450

bigMinOrders = 400
bigMaxOrders = 450
bigOrderchance = 20

# start date
order_date = datetime.datetime(2024, 8, 15)

bigday = datetime.datetime(2024, 9, 27)

daynum = 1

orderNum = 0

# random number gen:
# orders per day between: 191-233
# money per sale: 9-17
# big day order: 250-300

# Open/create csv file to store data in 
with open ("data/OrderHistory.csv", "w", newline='') as file:
    writer = csv.writer(file)
    writer.writerow(["OrderID", "TotalCost", "Items", "OrderDate"])
    #writer = csv.writer(file, quoting=csv.QUOTE_NONE)
    # about $2750 in sales per day assuming ~$13 so about 212 orders a day
    # not accounting for weekends: ~$3850 a day. so 296 orders a day
    while (daynum <= 273):
        order_date = order_date.replace(hour=10, minute=0, second=0)
        MinOrders = normalMinOrders
        MaxOrders = normalMaxOrders
        OrderChance = normalOrderChance

        if order_date.date() == bigday.date():
            MinOrders = bigMinOrders
            MaxOrders = bigMaxOrders
            OrderChance = bigOrderchance
        # calculate how often an order needs to be placed
        orders = random.randint(MinOrders,MaxOrders)
        seconds_per_order = math.floor(60*(60/(orders/10)))
        if(order_date.weekday() < 5 or not(noweekends)):
            for k in range(orders): # 'orders' amount of orders in a day
                order_date += datetime.timedelta(seconds=seconds_per_order)
                orderList = []
                itemsOrdered = 1
                itemsOrderedChance = random.randint(0,OrderChance)
                if itemsOrderedChance == 18 or itemsOrderedChance == 19:
                    itemsOrdered = 2
                if itemsOrderedChance == 12:
                    itemsOrdered = 3
                for x in range(itemsOrdered):
                    orderList.append(random.randint(0,5329))
                totalorders += 1
                formatted_items = f'{{{", ".join(map(str, orderList))}}}'
                writer.writerow([orderNum, None, formatted_items, order_date])
                orderNum += 1
        order_date += datetime.timedelta(days=1)
        daynum += 1
        
        
print(totalorders)


    # loop 39 times for each week, with a another loop for each day, and yet another loop for each sale


