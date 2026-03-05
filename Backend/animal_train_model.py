import pandas as pd
from sklearn.tree import DecisionTreeClassifier
import pickle
from sklearn.ensemble import RandomForestClassifier

data = pd.read_csv("data/animal_disease_dataset.csv")

X = data.drop("Disease", axis=1)
X = pd.get_dummies(X)

y = data["Disease"]

model = RandomForestClassifier(
    n_estimators=300,
    max_depth=8,
    random_state=42
)
model.fit(X, y)

pickle.dump((model, X.columns), open("model.pkl", "wb"))

print("Model saved correctly!")