# Medical Insurance Charges Prediction

A machine learning web application that predicts annual medical insurance charges based on user-provided personal details. The project trains and compares five regression models, selects the best performer, and serves it through a Streamlit web interface.

## Project Structure

```
ml-projects/
├── insurance.csv          # Dataset (1,338 records, 7 features + target)
├── train.py               # Model training, evaluation & artifact generation
├── app.py                 # Streamlit web application
├── model_results.json     # Evaluation metrics for all models (generated)
├── best_model.pkl         # Saved best model pipeline (generated)
├── model_comparison.png   # Comparison bar charts (generated)
├── feature_importance.png # Feature importance plot (generated)
├── eda_plots/             # Exploratory data analysis plots (generated)
└── README.md              # This file
```

## Dataset

The **Insurance** dataset contains 1,338 records with the following columns:

| Column      | Type    | Description                              |
|-------------|---------|------------------------------------------|
| `age`       | int     | Age of primary beneficiary (18-64)       |
| `sex`       | str     | Insurance contractor gender (male/female)|
| `bmi`       | float   | Body mass index (kg/m²)                  |
| `children`  | int     | Number of children covered (0-5)         |
| `smoker`    | str     | Smoking status (yes/no)                  |
| `region`    | str     | US residential area                      |
| `charges`   | float   | Annual insurance charges (target)        |

The dataset is clean with **no missing values**.

## How to Run

### 1. Train the Models

```bash
python train.py
```

This script will:
- Load and analyze the dataset
- Generate EDA plots in `eda_plots/`
- Train and evaluate 5 regression models
- Save the best model as `best_model.pkl`
- Save evaluation results as `model_results.json`
- Generate comparison and feature importance plots

### 2. Launch the Web App

```bash
streamlit run app.py
```

Open the browser window that appears, enter your details, and click **Predict Charges**.

## Models Compared

| # | Model                 | MAE (USD) | RMSE (USD) | R²     |
|---|-----------------------|-----------|------------|--------|
| 1 | Linear Regression     | —         | —          | —      |
| 2 | Polynomial Regression | —         | —          | —      |
| 3 | Decision Tree         | —         | —          | —      |
| 4 | Random Forest         | —         | —          | —      |
| 5 | XGBoost               | —         | —          | —      |

> The exact metrics are populated by `train.py` and displayed in the web app's **Model Comparison** section.

## Preprocessing Pipeline

All models share the same preprocessing pipeline built with scikit-learn's `ColumnTransformer`:

1. **Numeric features** (`age`, `bmi`, `children`): Standardized with `StandardScaler`
2. **Categorical features** (`sex`, `smoker`, `region`): One-hot encoded with `OneHotEncoder(drop='first')`

This ensures consistent data transformation between training and inference.
