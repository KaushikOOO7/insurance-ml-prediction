"""
Streamlit web app for predicting medical insurance charges.
"""

import json
import os
import pickle
from datetime import datetime

import streamlit as st
import pandas as pd
import numpy as np

st.set_page_config(
    page_title="Insurance Charges Predictor",
    page_icon="🩺",
    layout="centered",
)

MODEL_PATH = "best_model.pkl"
RESULTS_PATH = "model_results.json"
MODEL_COMPARISON_PLOT = "model_comparison.png"


@st.cache_resource


# --------------------------------------------------------------------------- #
# Header
# --------------------------------------------------------------------------- #
st.title("🩺 Medical Insurance Charges Predictor")
st.markdown(
    """
    Enter your details below to get an estimate of your annual insurance
    charges. The prediction is powered by a machine learning model trained
    on the *Insurance* dataset (1,338 records).
    """
)

# --------------------------------------------------------------------------- #
# Load artefacts
# --------------------------------------------------------------------------- #
if not os.path.exists(MODEL_PATH) or not os.path.exists(RESULTS_PATH):
    st.warning(
        "Model artefacts not found. Please run `python train.py` first to "
        "generate the model and results."
    )
    st.stop()

bundle, results = load_model_bundle()
model = bundle["model"]
model_name = bundle["model_name"]
feature_cols = bundle["feature_cols"]

# --------------------------------------------------------------------------- #
# Input form
# --------------------------------------------------------------------------- #
st.subheader("Your Details")

col1, col2 = st.columns(2)
with col1:
    age = st.number_input(
        "Age", min_value=18, max_value=100, value=30, step=1,
        help="Age of the primary beneficiary",
    )
    bmi = st.number_input(
        "BMI", min_value=10.0, max_value=60.0, value=28.0, step=0.1,
        help="Body Mass Index (weight kg / height m squared)",
    )
    children = st.slider(
        "Children", min_value=0, max_value=5, value=0,
        help="Number of dependent children covered by insurance",
    )
with col2:
    sex = st.radio("Sex", options=["male", "female"], horizontal=True)
    smoker = st.radio("Smoker", options=["yes", "no"], horizontal=True)
    region = st.selectbox("Region", options=["southwest", "southeast", "northwest", "northeast"], help="Residential area in the US")


# --------------------------------------------------------------------------- #
# Prediction
# --------------------------------------------------------------------------- #
if st.button("Predict Charges", type="primary", use_container_width=True):
    input_data = pd.DataFrame([{
        "age": age,
        "sex": sex,
        "bmi": bmi,
        "children": children,
        "smoker": smoker,
        "region": region,
    }])

    prediction = float(model.predict(input_data)[0])

    # ------------------------------------------------------------------ #
    # Results display
    # ------------------------------------------------------------------ #
    st.divider()
    st.subheader("Prediction Result")

    st.metric(
        label="Estimated Annual Charges",
        value=f"${prediction:,.2f}",
        delta=f"Model: {model_name}",
        delta_color="off",
    )

    summary_df = pd.DataFrame({
        "Feature": ["Age", "Sex", "BMI", "Children", "Smoker", "Region"],
        "Your Value": [age, sex, f"{bmi}", children, smoker, region],
    })
    st.table(summary_df)

    st.markdown("---")
    if smoker == "yes":
        st.info(
            "Smoking is the single most impactful factor driving insurance "
            "charges. Non-smokers typically pay significantly less."
        )
    if bmi >= 30:
        st.warning(
            "A BMI above 30 may increase charges, especially when combined "
            "with smoking."
        )
    st.caption(
        f"Prediction generated on {datetime.now().strftime('%B %d, %Y at %H:%M')} "
        f"using the {model_name} model."
    )

# --------------------------------------------------------------------------- #
# Model comparison (expandable)
# --------------------------------------------------------------------------- #
with st.expander("View Model Comparison"):
    st.markdown("### Performance of All Trained Models")
    st.markdown(
        "Metrics on held-out test set (20% of data)."
    )

    comparison_data = []
    for name, scores in results.items():
        comparison_data.append({
            "Model": name,
            "MAE": f"${scores['MAE']:,.2f}",
            "RMSE": f"${scores['RMSE']:,.2f}",
            "R2": f"{scores['R2']:.4f}",
        })
    comparison_df = pd.DataFrame(comparison_data)

    st.dataframe(comparison_df, use_container_width=True, hide_index=True)
    st.caption(
        f"{model_name} achieved the highest R2 score and was selected as "
        f"the production model."
    )

    if os.path.exists(MODEL_COMPARISON_PLOT):
        st.image(MODEL_COMPARISON_PLOT, caption="Model Comparison Charts")

    sex = st.radio("Sex", options=["male", "female"], horizontal=True)
    smoker = st.radio("Smoker", options=["yes", "no"], horizontal=True)
    region = st.selectbox(
        "Region",
        options=["southwest", "southeast", "northwest", "northeast"],
        help="Residential area in the US",
    )

def load_model_bundle():
    with open(MODEL_PATH, "rb") as f:
        bundle = pickle.load(f)
    with open(RESULTS_PATH, "r") as f:
        results = json.load(f)
    return bundle, results
