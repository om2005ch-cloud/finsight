import joblib

model = joblib.load("category_model.pkl")
vectorizer = joblib.load("vectorizer.pkl")

test_examples = [
    "Ordered chicken biryani from a new place",
    "Paid for cab from home to office",
    "Bought a new pair of jeans",
    "Monthly internet bill",
    "Watched a movie with friends",
    "Went to dentist for checkup",
    "Withdrew cash from ATM",
    "Recharged phone with 599 plan",
]

vec = vectorizer.transform(test_examples)
predictions = model.predict(vec)

for text, pred in zip(test_examples, predictions):
    print(f"{text}  →  {pred}")