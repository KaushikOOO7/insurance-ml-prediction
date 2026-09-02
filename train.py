"""Model training: EDA, 5-model comparison, save best model."""
import json, os, pickle
import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np, pandas as pd, seaborn as sns
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, PolynomialFeatures, StandardScaler
from sklearn.tree import DecisionTreeRegressor
from xgboost import XGBRegressor

DATA_PATH, MODEL_PATH, RESULTS_PATH = "insurance.csv", "best_model.pkl", "model_results.json"
PLOT_PATH = "model_comparison.png"
EDA_DIR = "eda_plots"
NUM = ["age", "bmi", "children"]
CAT = ["sex", "smoker", "region"]
COLS = NUM + CAT
os.makedirs(EDA_DIR, exist_ok=True)

data = pd.read_csv(DATA_PATH)
print(f"Loaded: {data.shape[0]} rows, {data.shape[1]} cols | Missing: {data.isnull().sum().sum()}")
print(f"\nCharges: mean=${data.charges.mean():,.0f} median=${data.charges.median():,.0f} max=${data.charges.max():,.0f}")

def eda():
    for col, c, t in [("age","skyblue","Age"),("bmi","red","BMI"),("charges","green","Charges")]:
        fig, ax = plt.subplots(figsize=(8,4))
        sns.histplot(data[col], bins=30, kde=True, color=c, ax=ax)
        ax.set_title(f"{t} Distribution"); ax.set_xlabel(t); ax.set_ylabel("Count")
        fig.tight_layout(); fig.savefig(os.path.join(EDA_DIR,f"{col}.png"), dpi=150); plt.close(fig)
    fig, ax = plt.subplots(figsize=(8,4))
    sns.boxplot(x="smoker", y="charges", data=data, hue="smoker", ax=ax)
    ax.set_title("Charges by Smoker Status"); fig.tight_layout()
    fig.savefig(os.path.join(EDA_DIR,"charges_by_smoker.png"), dpi=150); plt.close(fig)
    fig, ax = plt.subplots(figsize=(8,5))
    sns.boxplot(x="bmi", y="charges", data=data, hue="smoker", palette="Set2", ax=ax)
    ax.set_title("BMI vs Charges (by Smoker)"); fig.tight_layout()
    fig.savefig(os.path.join(EDA_DIR,"bmi_vs_charges.png"), dpi=150); plt.close(fig)
    fig, ax = plt.subplots(figsize=(6,5))
    sns.heatmap(data[["age","bmi","children","charges"]].corr(), annot=True, fmt=".2f", cmap="coolwarm", square=True, ax=ax)
    ax.set_title("Correlation Heatmap"); fig.tight_layout()
    fig.savefig(os.path.join(EDA_DIR,"correlation.png"), dpi=150); plt.close(fig)
    for col, t in [("region","Region"),("sex","Sex")]:
        fig, ax = plt.subplots(figsize=(8,4))
        sns.boxplot(x=col, y="charges", data=data, hue=col, ax=ax)
        ax.set_title(f"Charges by {t}"); fig.tight_layout()
        fig.savefig(os.path.join(EDA_DIR,f"charges_by_{col}.png"), dpi=150); plt.close(fig)
    print(f"  Saved EDA plots to {EDA_DIR}/")

eda()
X, y = data[COLS], data["charges"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print(f"\nTrain: {X_train.shape}  Test: {X_test.shape}")

pre = ColumnTransformer(transformers=[
    ("num", StandardScaler(), NUM),
    ("cat", OneHotEncoder(drop="first", sparse_output=False, handle_unknown="ignore"), CAT),
])
