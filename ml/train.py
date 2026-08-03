import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib

# Load the dataset
df = pd.read_csv("transactions_dataset.csv")

# Split into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(
    df["description"], df["category"], test_size=0.2, random_state=42, stratify=df["category"]
)

# Convert text into numbers (TF-IDF)
vectorizer = TfidfVectorizer(ngram_range=(1, 2))
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

# Train the classifier
model = LogisticRegression(max_iter=1000)
model.fit(X_train_vec, y_train)

# Evaluate
predictions = model.predict(X_test_vec)
print(classification_report(y_test, predictions))

# Save both the model and the vectorizer
joblib.dump(model, "category_model.pkl")
joblib.dump(vectorizer, "vectorizer.pkl")
print("Model saved.")