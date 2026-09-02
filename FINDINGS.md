# Insurance Charges Model Findings

## Goal

Build a web app that accepts customer details and predicts medical insurance charges, while comparing several regression models on the `insurance.csv` dataset.

## Dataset

- Rows: 1,338
- Target: `charges`
- Numeric inputs: `age`, `bmi`, `children`
- Categorical inputs: `sex`, `smoker`, `region`

## Modeling Approach

The project trains multiple regressors using a fixed 80/20 train-test split with `random_state=42`.

Preprocessing is handled with a scikit-learn `ColumnTransformer`:

- Numeric features are scaled for linear models.
- Categorical features are one-hot encoded with `drop="first"`.
- Tree-based models use encoded features without numeric scaling.

Compared models:

- Linear Regression
- Ridge Regression
- Polynomial Regression
- Decision Tree
- Random Forest
- Gradient Boosting
- XGBoost, when installed

## Results

The current run ranked models by test RMSE as follows:

| Rank | Model | MAE | RMSE | R2 |
|---:|---|---:|---:|---:|
| 1 | XGBoost | $2,455 | $4,297 | 0.881 |
| 2 | Gradient Boosting | $2,456 | $4,325 | 0.879 |
| 3 | Random Forest | $2,475 | $4,399 | 0.875 |
| 4 | Polynomial Regression | $2,776 | $4,555 | 0.866 |
| 5 | Decision Tree | $2,931 | $5,083 | 0.834 |
| 6 | Linear Regression | $4,181 | $5,796 | 0.784 |
| 7 | Ridge Regression | $4,193 | $5,800 | 0.783 |

## How To Interpret Results

The Streamlit app ranks models by test RMSE. Lower RMSE and MAE are better, while higher R2 is better.

For this dataset, ensemble tree methods outperform plain linear regression because insurance charges have strong non-linear effects, especially around smoking status, BMI, and age.

The strongest drivers in the best model are:

- Smoker status
- BMI
- Age
- Number of children
- Sex and region, with smaller effects in this run

## App Usage

Run the app with:

```bash
streamlit run app.py
```

Then enter:

- Age
- Sex
- BMI
- Number of children
- Smoker status
- Region
- Model choice

The app returns an estimated annual charge and shows the model comparison table.

## Notes

The prediction is a dataset-trained estimate, not an underwriting quote. It should be used for learning and model demonstration rather than financial or medical decision-making.
