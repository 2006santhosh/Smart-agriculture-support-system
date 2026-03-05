import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import pickle

# =========================
# LOAD DATA
# =========================

train = pd.read_csv("data/Train.csv")
test = pd.read_csv("data/Test.csv")

# remove unwanted index column
train = train.drop(columns=["Unnamed: 0"], errors="ignore")
test = test.drop(columns=["Unnamed: 0"], errors="ignore")

print("Columns:", train.columns)

# =========================
# FEATURES & TARGET
# =========================

X_train = train.drop("Crop", axis=1)
y_train = train["Crop"]

X_test = test.drop("Crop", axis=1)
y_test = test["Crop"]

# =========================
# ENCODE CROP NAMES
# =========================

le = LabelEncoder()
y_train = le.fit_transform(y_train)
y_test = le.transform(y_test)

# =========================
# TRAIN MODEL
# =========================

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)

# =========================
# TEST ACCURACY
# =========================

predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)

print("\nModel Accuracy:", round(accuracy * 100, 2), "%")

# =========================
# SAVE MODEL
# =========================

with open("crop_model.pkl", "wb") as f:
    pickle.dump((model, le), f)

print("\nModel saved successfully!")