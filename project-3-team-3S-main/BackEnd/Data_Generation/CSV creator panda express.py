

import csv as csv
import numpy as np
import math as mth
from itertools import combinations_with_replacement

# math formula used c(n+(k-1), k) to account for repeats
#combinations that are used to calculate the number of iterations needed
bowl_possible = mth.comb(4, 1) * mth.comb(13, 1)
plate_possible = mth.comb(5, 2) * mth.comb(13, 2)
bigger_plate_possible = mth.comb(5, 2) * mth.comb(15,3)
Entrees_possible = 3 * 13
Sides_possible = 2 * 4

Entrees=[ "Original Orange Chicken",
         "Black Pepper Sirloin Steak",
         "Honey Walnut Shrimp",
         "Teriyaki Chicken",
         "Broccoli Beef",
         "Kung Pao Chicken",
         "Honey Sesame Chicken Breast",
         "Beijing Beef",
         "Mushroom Chicken",
         "SweetFire Chicken Breast",
         "String Bean Chicken Breast",
         "Black Pepper Chicken"
         ]
Sides = [ "Super Greens",
          "Chow Mein",
          "Fried Rice",
          "White Rice"
        ]

#possible combinations lists will have to flatten to make writing to csv easier
BowlEntree_comb = list(combinations_with_replacement(Entrees, 1))
BowlSide_comb = list(combinations_with_replacement(Sides,1))
PlateSide_comb = list(combinations_with_replacement(Sides,2))
PlateEntree_comb = list(combinations_with_replacement(Entrees,2))
BigPlateEntree_comb = list(combinations_with_replacement(Entrees,3))








with open('menuitems.csv','w',newline='',) as file:

    file = csv.writer(file,)

    # TODO: get all permutations, loop over nearest multiple of the highest digit and assign item ids and types and entrees based on
    # TODO: where they land

    header = ["ItemId",
              "Type_",
              "BasePrice",
              "items"
              ]
    file.writerow(header)


    for i in range(0,bowl_possible):

        price = 8.30
        if(BowlEntree_comb[i%12][0] == "Honey Walnut Shrimp" or
                BowlEntree_comb[i%12][0] == "Black Pepper Sirloin Steak" ):
            price = 9.80

        file.writerow([i,
                       'Bowl',
                       price,
                       "{" + BowlEntree_comb[i % 12][0] + "," + BowlSide_comb[i % 4][0] + "}"
                       ])

    for i in range(bowl_possible, bowl_possible + plate_possible):

        price = 9.80
        if (PlateEntree_comb[(i-bowl_possible) % 78][0] == "Honey Walnut Shrimp" or
                PlateEntree_comb[(i-bowl_possible) % 78][1] == "Honey Walnut Shrimp" or
                PlateEntree_comb[(i-bowl_possible) % 78][0] == "Black Pepper Sirloin Steak" or
                PlateEntree_comb[(i-bowl_possible) % 78][1] == "Black Pepper Sirloin Steak"):
            price = 11.30

        file.writerow([i,
                       "Plate",
                       price,
                       "{" + PlateEntree_comb[(i-bowl_possible) % 78][0] + "," +
                       PlateEntree_comb[(i-bowl_possible) % 78][1] + "," +
                       PlateSide_comb[(i-bowl_possible) % 10][0] + "," +
                       PlateSide_comb[(i-bowl_possible) % 10][1] + "}"
                       ])

    for i in range(plate_possible, plate_possible + bigger_plate_possible):
        price = 11.30
        if (BigPlateEntree_comb[i % 364][0] == "Honey Walnut Shrimp" or
                BigPlateEntree_comb[i % 364][1] == "Honey Walnut Shrimp" or
                BigPlateEntree_comb[i % 364][2] == "Honey Walnut Shrimp" or
                BigPlateEntree_comb[i % 364][0] == "Black Pepper Sirloin Steak" or
                BigPlateEntree_comb[i % 364][1] == "Black Pepper Sirloin Steak" or
                BigPlateEntree_comb[i % 364][2] == "Black Pepper Sirloin Steak"):
            price = 12.70

        file.writerow([i,
                       'Larger Plate',
                       price,
                       "{" + BigPlateEntree_comb[i % 364][0] + "," + BigPlateEntree_comb[i % 364][1] + "," +
                       BigPlateEntree_comb[i % 364][2] + "," +
                       PlateSide_comb[i % 10][0] + "," +
                       PlateSide_comb[i % 10][1] +  "}"
                       ],)
    for i in range (5330, 5366):
        size = i % 3
        print( (i-5330)//3 )
        if size == 0:
            price = 5.20
            type_ = 'Entree Small'
        elif size == 1:
            price = 8.50
            type_ = 'Entree Medium'
        elif size == 2:
            price = 11.20
            type_ = 'Entree Large'


        if( Entrees[ (i-5330)//3 ] == "Honey Walnut Shrimp" or
                Entrees[ (i-5330)//3 ] == "Black Pepper Sirloin Steak"):

            price = price + 1.50

        file.writerow([i,
                      type_,
                      price,
                       "{"+Entrees[(i-5330)//3] + "}",
                       ])
    for i in range(5366, 5374):
        size = i % 2

        if size == 0:
            price = 4.40
            type_ = 'Side Medium'
        elif size == 1:
            price = 5.40
            type_ = 'Side Large'



        file.writerow([i,
                      type_,
                      price,
                      "{"+ Sides[(i-5366)//2] + "}",
                       ])












