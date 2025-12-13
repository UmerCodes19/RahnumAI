# Train and Load ML Models

This project includes a training script for ML models used by the backend AI endpoints. The training script will write model files to `train_ML_Model/models` which the Django backend loads at startup.

## Dependencies
The following packages must be installed in your backend environment before running training:

- scikit-learn
- joblib
- transformers (optional, for T5) + torch
- sentencepiece (optional, for tokenizer)

To install these dependencies:

```
cd backend
pip install -r requirements.txt
```

The backend `requirements.txt` already contains the ML libraries needed.

## Training the models
Run the training script to generate joblib and model artifacts:

```
python train_ML_Model/train_models.py
```

This will create the following files under `train_ML_Model/models`:

- `knn_recommender.pkl` — KNN for learning path
- `learning_paths.json` — Mapping of path id -> path data
- `rf_grade_predictor.pkl` — RandomForest regressor
- `nb_tfidf_vectorizer.pkl` — TF-IDF vectorizer for text
- `nb_wellbeing_classifier.pkl` — Naive Bayes classifier
- `bert_model/` — Optional T5 model saved via `save_pretrained` if transformations are installed

## Restart the backend
The backend loads models at import time (when `main.views` is imported). After training and generating the models above, restart the Django server to load the models:

```
# from your workspace root
cd backend
python manage.py runserver
```

Use the AI model status endpoint to verify the models are loaded:

```
GET /api/ai/models/status/

# Example success response
{ "knn": true, "random_forest": true, "nb_model": true, "transformers": false }
```

If any model fails to load, check for errors in logs and ensure the model files exist and the Python environment includes the necessary libraries.

## Integration notes
- The backend AI endpoints will fall back to default responses if the necessary models or artifacts are not present.
- If you wish to retrain or update the ML models, re-run `train_ML_Model/train_models.py` and restart the server.
- For production deployments, consider training and exporting models separately and placing them into `/train_ML_Model/models` during deployment.

