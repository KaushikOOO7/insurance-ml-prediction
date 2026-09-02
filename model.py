from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, PolynomialFeatures, StandardScaler
from sklearn.tree import DecisionTreeRegressor

try:
    from xgboost import XGBRegressor
except ImportError:  # pragma: no cover - optional dependency for lighter installs
    XGBRegressor = None


DATA_PATH = Path(__file__).with_name("insurance.csv")
TARGET = "charges"
NUMERIC_FEATURES = ["age", "bmi", "children"]
CATEGORICAL_FEATURES = ["sex", "smoker", "region"]
RANDOM_STATE = 42


@dataclass(frozen=True)
class TrainingResult:
    models: dict[str, Pipeline]
    metrics: pd.DataFrame
    feature_importance: pd.DataFrame
    train_shape: tuple[int, int]
    test_shape: tuple[int, int]


def load_data(path: Path = DATA_PATH) -> pd.DataFrame:
    """Load and lightly validate the insurance charges dataset."""
    data = pd.read_csv(path)
    expected_columns = set(NUMERIC_FEATURES + CATEGORICAL_FEATURES + [TARGET])
    missing_columns = expected_columns.difference(data.columns)
    if missing_columns:
        missing = ", ".join(sorted(missing_columns))
        raise ValueError(f"Dataset is missing required columns: {missing}")
    return data


def make_preprocessor(scale_numeric: bool = True) -> ColumnTransformer:
    numeric_transformer = StandardScaler() if scale_numeric else "passthrough"
    return ColumnTransformer(
        transformers=[
            ("numeric", numeric_transformer, NUMERIC_FEATURES),
            (
                "categorical",
                OneHotEncoder(drop="first", handle_unknown="ignore", sparse_output=False),
                CATEGORICAL_FEATURES,
            ),
        ]
    )


def build_models() -> dict[str, Pipeline]:
    models: dict[str, Pipeline] = {
        "Linear Regression": Pipeline(
            steps=[
                ("preprocess", make_preprocessor(scale_numeric=True)),
                ("model", LinearRegression()),
            ]
        ),
        "Ridge Regression": Pipeline(
            steps=[
                ("preprocess", make_preprocessor(scale_numeric=True)),
                ("model", Ridge(alpha=1.0)),
            ]
        ),
        "Polynomial Regression": Pipeline(
            steps=[
                ("preprocess", make_preprocessor(scale_numeric=True)),
                ("polynomial", PolynomialFeatures(degree=2, include_bias=False)),
                ("model", Ridge(alpha=5.0)),
            ]
        ),
        "Decision Tree": Pipeline(
            steps=[
                ("preprocess", make_preprocessor(scale_numeric=False)),
                ("model", DecisionTreeRegressor(max_depth=5, random_state=RANDOM_STATE)),
            ]
        ),
        "Random Forest": Pipeline(
            steps=[
                ("preprocess", make_preprocessor(scale_numeric=False)),
                (
                    "model",
                    RandomForestRegressor(
                        n_estimators=300,
                        min_samples_leaf=3,
                        random_state=RANDOM_STATE,
                        n_jobs=-1,
                    ),
                ),
            ]
        ),
        "Gradient Boosting": Pipeline(
            steps=[
                ("preprocess", make_preprocessor(scale_numeric=False)),
                (
                    "model",
                    GradientBoostingRegressor(
                        n_estimators=250,
                        learning_rate=0.05,
                        max_depth=3,
                        random_state=RANDOM_STATE,
                    ),
                ),
            ]
        ),
    }

    if XGBRegressor is not None:
        models["XGBoost"] = Pipeline(
            steps=[
                ("preprocess", make_preprocessor(scale_numeric=False)),
                (
                    "model",
                    XGBRegressor(
                        n_estimators=250,
                        learning_rate=0.05,
                        max_depth=3,
                        subsample=0.9,
                        colsample_bytree=0.9,
                        objective="reg:squarederror",
                        random_state=RANDOM_STATE,
                    ),
                ),
            ]
        )

    return models


def train_and_compare(data: pd.DataFrame | None = None) -> TrainingResult:
    if data is None:
        data = load_data()

    X = data[NUMERIC_FEATURES + CATEGORICAL_FEATURES]
    y = data[TARGET]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=RANDOM_STATE
    )

    trained_models: dict[str, Pipeline] = {}
    rows: list[dict[str, float | str]] = []

    for name, model in build_models().items():
        model.fit(X_train, y_train)
        predictions = model.predict(X_test)
        rmse = float(np.sqrt(mean_squared_error(y_test, predictions)))
        rows.append(
            {
                "Model": name,
                "MAE": float(mean_absolute_error(y_test, predictions)),
                "RMSE": rmse,
                "R2": float(r2_score(y_test, predictions)),
            }
        )
        trained_models[name] = model

    metrics = pd.DataFrame(rows).sort_values("RMSE", ascending=True).reset_index(drop=True)
    feature_importance = get_feature_importance(
        trained_models[metrics.loc[0, "Model"]], metrics.loc[0, "Model"]
    )

    return TrainingResult(
        models=trained_models,
        metrics=metrics,
        feature_importance=feature_importance,
        train_shape=X_train.shape,
        test_shape=X_test.shape,
    )


def predict_charge(model: Pipeline, details: dict[str, object]) -> float:
    input_frame = pd.DataFrame([details], columns=NUMERIC_FEATURES + CATEGORICAL_FEATURES)
    return float(model.predict(input_frame)[0])


def get_feature_importance(model: Pipeline, model_name: str) -> pd.DataFrame:
    estimator = model.named_steps["model"]
    if not hasattr(estimator, "feature_importances_"):
        return pd.DataFrame(columns=["Feature", "Importance", "Model"])

    preprocessor = model.named_steps["preprocess"]
    feature_names = preprocessor.get_feature_names_out()
    clean_names = [name.split("__", 1)[-1] for name in feature_names]

    return (
        pd.DataFrame(
            {
                "Feature": clean_names,
                "Importance": estimator.feature_importances_,
                "Model": model_name,
            }
        )
        .sort_values("Importance", ascending=False)
        .reset_index(drop=True)
    )

