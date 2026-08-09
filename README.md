# DNS Traffic Classification & Detection System

## What I Built

We built an AI-powered DNS traffic classification MVP that uses an **XGBoost machine learning model** to analyze DNS traffic features and classify them into seven categories: **benign, audio, compressed, executable, image, text, and video**.

The ML model is integrated into a **FastAPI backend** and connected to a **Next.js frontend**, creating a complete end-to-end application rather than just a standalone machine learning model.

## What Problem Does My  MVP Address?

DNS traffic can contain a large amount of information that is difficult to analyze manually. Identifying the type of traffic from DNS-related features can be time-consuming, especially when dealing with large amounts of network data.

Our MVP addresses this problem by automatically analyzing DNS traffic features and providing a classification result through a simple web interface. This gives users a faster way to understand the type of traffic represented by a DNS feature record.

## How Does My Solution Work?

The user can paste a DNS feature record or select a sample from the provided dataset through the web interface.

The system then follows this pipeline:

**DNS Feature Data → Feature Processing → XGBoost Model → FastAPI API → Next.js Frontend → Classification Result**

The backend receives the DNS features, processes them into the format expected by the trained model, and generates a prediction along with probability information. The frontend then displays the predicted category, confidence, and probability distribution in an easy-to-understand interface.

## What Would I  Improve With More Time?

With more development time, my primary focus would be **improving the machine learning model's accuracy and its performance across all classes**.

The current dataset is imbalanced, and the model performs better on the majority class than on some minority classes. We would therefore:

* Collect more representative samples for minority classes.
* Perform deeper feature engineering and feature selection.
* Experiment with different machine learning algorithms and hyperparameters.
* Improve handling of class imbalance.
* Evaluate the model using metrics such as macro F1-score and balanced accuracy in addition to overall accuracy.
* Add more DNS-specific security features to improve class separation.

We would also extend the MVP toward **real-time DNS traffic analysis**, where DNS traffic could be captured automatically, features extracted, and classifications generated continuously instead of requiring users to manually provide feature data.
