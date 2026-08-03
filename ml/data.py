import pandas as pd
import random

templates = {
    "Food": [
        "Swiggy order", "Zomato food delivery", "McDonald's meal", "Domino's pizza order",
        "KFC lunch", "Starbucks coffee", "Local restaurant dinner", "Cafe breakfast",
        "Grocery shopping BigBasket", "Vegetable market", "Milk and eggs", "Dmart groceries",
        "Street food chaat", "Biryani order", "Ice cream parlour", "Bakery items",
        "Pizza hut order", "Burger king meal", "Subway sandwich", "Chinese food takeout",
        "South indian tiffin", "Dhaba food", "Momos stall", "Juice shop",
        "Sweet shop mithai", "Grocery online order", "Fruits vendor", "Cake order birthday",
        "Food court mall", "Canteen lunch", "Tea stall", "Paratha breakfast",
    ],
    "Transport": [
        "Uber ride to college", "Ola cab booking", "Petrol pump fuel", "Metro card recharge",
        "Bus ticket", "Train ticket IRCTC", "Auto rickshaw fare", "Parking fee",
        "Rapido bike ride", "Toll payment", "Car service", "Bike repair",
        "Diesel refill", "Flight ticket booking", "Cab to airport", "Bike fuel",
        "Car wash", "Vehicle insurance renewal", "Taxi fare", "Railway platform ticket",
        "Ride share pool", "Bike rental", "Car rental", "Traffic challan payment",
    ],
    "Shopping": [
        "Amazon order", "Flipkart purchase", "Myntra clothes", "Nike shoes",
        "Zara shirt", "H&M shopping", "Electronics store", "Mobile phone case",
        "Home decor items", "Furniture purchase", "Books order", "Stationery shopping",
        "Laptop accessories", "Headphones purchase", "Watch online order", "Sunglasses shopping",
        "Perfume purchase", "Jewellery store", "Bag purchase", "Shoes online order",
        "Home appliance purchase", "Kitchen items", "Gift shopping", "Toy store purchase",
    ],
    "Bills": [
        "Electricity bill payment", "Water bill", "Mobile recharge Jio", "WiFi bill Airtel",
        "Gas cylinder booking", "DTH recharge", "Maintenance charges", "Rent payment",
        "Credit card bill", "Insurance premium", "Broadband bill", "Landline bill",
        "House tax payment", "Society maintenance", "Electricity meter recharge", "Postpaid bill payment",
        "Loan EMI payment", "Water tanker payment", "Cable TV bill", "Gas pipeline bill",
    ],
    "Entertainment": [
        "Netflix subscription", "Spotify premium", "Movie tickets PVR", "BookMyShow booking",
        "Gaming purchase Steam", "PlayStation game", "Concert tickets", "Amusement park",
        "YouTube premium", "Amazon Prime subscription", "Hotstar subscription", "Bowling alley",
        "Arcade games", "Music concert", "Standup comedy show", "Theatre play tickets",
        "Video game console", "Mobile game purchase", "Zoo entry ticket", "Water park entry",
    ],
    "Health": [
        "Doctor consultation", "Pharmacy medicine", "Hospital bill", "Dental checkup",
        "Gym membership", "Yoga class", "Health supplements", "Eye checkup",
        "Physiotherapy session", "Lab test", "Blood test", "Vaccination",
        "Skin specialist visit", "Health insurance premium", "Protein powder purchase", "Medical store",
        "X-ray scan", "Ambulance charges", "Health checkup package", "Optician glasses",
    ],
    "Other": [
        "ATM withdrawal", "Bank charges", "Gift for friend", "Donation",
        "Salon haircut", "Laundry service", "Miscellaneous expense", "Repair service",
        "Cash withdrawal", "Bank transfer fee", "Charity contribution", "Spa treatment",
        "Tailoring service", "Courier charges", "Photocopy printout", "Pet supplies",
        "Plumber service", "Electrician charges", "Cleaning service", "Late fee payment",
    ],
}

rows = []
for category, examples in templates.items():
    for desc in examples:
        rows.append({"description": desc, "category": category})
        rows.append({"description": desc.lower(), "category": category})
        # add a version with a random order/reference number, common in real transactions
        rows.append({"description": f"{desc} #{random.randint(1000,9999)}", "category": category})

df = pd.DataFrame(rows)
df = df.sample(frac=1, random_state=42).reset_index(drop=True)
df.to_csv("transactions_dataset.csv", index=False)
print("Dataset created:", df.shape)
print(df["category"].value_counts())