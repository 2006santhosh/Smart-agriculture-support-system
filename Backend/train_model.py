import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import pickle
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import pickle

# Load data
data = pd.read_csv("data/crop_data.csv")

# Encode season (text → number)
le = LabelEncoder()
data["season_encoded"] = le.fit_transform(data["season"])

# Features & target
X = data.drop(["label", "season"], axis=1)
y = data["label"]

# Train model
model = RandomForestClassifier()
model.fit(X, y)

# Save model + encoder
with open("model.pkl", "wb") as f:
    pickle.dump((model, le), f)

print("Model trained with season successfully!")
