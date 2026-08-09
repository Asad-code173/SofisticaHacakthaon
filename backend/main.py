from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import ast
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("dns_xgboost_model.pkl")

print("Number of features in the model:", model.n_features_in_)


# Load label encoder
label_encoder = joblib.load("label_encoder.pkl")

print("Classes in the label encoder:", label_encoder.classes_)
print("Type of the model:", type(model))
print("Number of classes in the label encoder:", len(label_encoder.classes_))


# ==================================================
# REQUEST SCHEMA
# ==================================================

class DNSRequest(BaseModel):

    rr: float

    A_frequency: int
    NS_frequency: int
    CNAME_frequency: int
    SOA_frequency: int
    NULL_frequency: int
    PTR_frequency: int
    HINFO_frequency: int
    MX_frequency: int
    TXT_frequency: int
    AAAA_frequency: int
    SRV_frequency: int
    OPT_frequency: int

    rr_type: str
    rr_count: int
    rr_name_entropy: float
    rr_name_length: int

    distinct_ns: int
    distinct_ip: str
    unique_country: str
    unique_asn: str
    distinct_domains: str
    reverse_dns: str
    a_records: int
    unique_ttl: str

    ttl_mean: float
    ttl_variance: float


# ==================================================
# PREPROCESSING FUNCTIONS
# ==================================================

def count_rr_types(value):

    try:
        parsed = ast.literal_eval(value)

        if isinstance(parsed, set):
            return len(parsed - {None})

        return 0

    except Exception:
        return 0


def count_items(value):

    try:
        parsed = ast.literal_eval(value)

        if isinstance(parsed, (set, list, tuple)):

            if isinstance(parsed, set):
                return len(parsed - {None})

            return len(parsed)

        return 0

    except Exception:
        return 0


def count_domains(value):

    try:
        parsed = ast.literal_eval(value)

        if isinstance(parsed, dict):

            count = 0

            for domains in parsed.values():

                if isinstance(domains, (set, list, tuple)):
                    count += len(domains)

            return count

        return 0

    except Exception:
        return 0


def ttl_count(value):

    try:
        parsed = ast.literal_eval(value)

        if isinstance(parsed, list):
            return len(parsed)

        return 0

    except Exception:
        return 0


# ==================================================
# ROOT ENDPOINT
# ==================================================

@app.get("/")
def root():

    return {
        "message": "AI based DNS security system"
    }


# ==================================================
# PREDICTION ENDPOINT
# ==================================================

@app.post("/predict")
def predict_dns(data: DNSRequest):

    # Convert request to dictionary
    dns_data = data.model_dump()

    # Create DataFrame
    df = pd.DataFrame([dns_data])


    # --------------------------------------------------
    # Feature engineering
    # --------------------------------------------------

    # 1. DNS record type count
    df["rr_type_count"] = df["rr_type"].apply(
        count_rr_types
    )

    # 2. Country count
    df["country_count"] = df["unique_country"].apply(
        count_items
    )

    # 3. ASN count
    df["asn_count"] = df["unique_asn"].apply(
        count_items
    )

    # 4. Domain count
    df["domain_count"] = df["distinct_domains"].apply(
        count_domains
    )

    # 5. Reverse DNS features
    df["reverse_dns_exists"] = (
        df["reverse_dns"].str.lower() != "unknown"
    ).astype(int)

    df["reverse_dns_length"] = (
        df["reverse_dns"].str.len()
    )

    # 6. TTL count
    df["ttl_count"] = df["unique_ttl"].apply(
        ttl_count
    )


    # --------------------------------------------------
    # EXACT 17 FEATURES USED BY XGBOOST
    # --------------------------------------------------

    selected_features = [

        "rr",

        "A_frequency",

        "PTR_frequency",

        "TXT_frequency",

        "rr_count",

        "rr_name_entropy",

        "rr_name_length",

        "distinct_ns",

        "ttl_mean",

        "ttl_variance",

        "rr_type_count",

        "country_count",

        "asn_count",

        "domain_count",

        "reverse_dns_exists",

        "reverse_dns_length",

        "ttl_count"
    ]


    # Create model input
    X = df[selected_features]


    # --------------------------------------------------
    # PREDICTION
    # --------------------------------------------------

    prediction = model.predict(X)[0]

    prediction = int(prediction)


    # --------------------------------------------------
    # PROBABILITIES
    # --------------------------------------------------

    probabilities = model.predict_proba(X)[0]


    # Confidence of predicted class
    confidence = float(probabilities[prediction])


    # --------------------------------------------------
    # DECODE LABEL
    # --------------------------------------------------

    predicted_label = label_encoder.inverse_transform(
        [prediction]
    )[0]


    # --------------------------------------------------
    # ALL CLASS PROBABILITIES
    # --------------------------------------------------

    class_probabilities = {}

    for class_id, probability in enumerate(probabilities):

        class_label = label_encoder.inverse_transform(
            [class_id]
        )[0]

        class_probabilities[str(class_label)] = round(
            float(probability),
            4
        )


    # --------------------------------------------------
    # RESPONSE
    # --------------------------------------------------

    return {

        "prediction": prediction,

        "label": str(predicted_label),

        "confidence": round(
            confidence,
            4
        ),

        "probabilities": class_probabilities,

        "message": (
            f"DNS traffic classified as "
            f"{predicted_label}"
        )
    }