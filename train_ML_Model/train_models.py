"""
Train ml models and save them as joblib in train_ML_Model/models/
KNN - learning path recommender
RandomForest - grade predictor
NaiveBayes (MultinomialNB + TfidfVectorizer) - well-being analysis
Transformer (T5) - exam paper generation saved via save_pretrained

Usage:
python train_models.py

Requirements:
pip install scikit-learn joblib transformers torch

"""
import os
import json
from pathlib import Path
from sklearn.neighbors import KNeighborsClassifier
from sklearn.ensemble import RandomForestRegressor
from sklearn.naive_bayes import MultinomialNB
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import train_test_split
import joblib

# Optional: Hugging Face transformer
try:
    from transformers import T5ForConditionalGeneration, T5Tokenizer
    HAS_TRANSFORMERS = True
except Exception:
    HAS_TRANSFORMERS = False

OUT_DIR = Path(__file__).resolve().parent / 'models'
OUT_DIR.mkdir(parents=True, exist_ok=True)

# ----- Utility: Save mapping ----
TOPICS = ['Mathematics', 'Physics', 'Computer Science', 'English', 'History']
LEVELS = ['beginner', 'intermediate', 'advanced']

topic_to_idx = {t: i for i, t in enumerate(TOPICS)}
level_to_idx = {l: i for i, l in enumerate(LEVELS)}

mappings = {
    'topics': TOPICS,
    'levels': LEVELS
}
with open(OUT_DIR / 'mappings.json', 'w') as f:
    json.dump(mappings, f)

# ----- KNN: Learning Path Recommender -----
# We'll create a small dataset mapping (topic_idx, level_idx) -> path_id
path_ids = [0, 1, 2, 3, 4]  # five possible paths
X_knn = []
y_knn = []
for t_idx in range(len(TOPICS)):
    for l_idx in range(len(LEVELS)):
        for p in path_ids:
            # Create a cluster around a path for demonstration
            feat = [t_idx + (p * 0.01), l_idx + (p * 0.02)]
            X_knn.append(feat)
            y_knn.append(p)

knn = KNeighborsClassifier(n_neighbors=3)
knn.fit(X_knn, y_knn)
joblib.dump(knn, OUT_DIR / 'knn_recommender.pkl')
print('Saved KNN recommender ->', OUT_DIR / 'knn_recommender.pkl')

# Create simple path definitions
learning_paths = {
    0: {'steps': ['Intro', 'Practice Basics', 'Quiz']},
    1: {'steps': ['Foundations', 'Hands-on', 'Project']},
    2: {'steps': ['Theory', 'Problem Solving', 'Final Test']},
    3: {'steps': ['Overview', 'Deep Dive', 'Capstone']},
    4: {'steps': ['Beginner', 'Intermediate', 'Advanced']}    
}
with open(OUT_DIR / 'learning_paths.json', 'w') as f:
    json.dump(learning_paths, f)



















# ----- RandomForest: Predict Grades -----
# We'll generate synthetic student features and corresponding grades
import numpy as np
np.random.seed(42)
num_samples = 500
X_rf = np.random.rand(num_samples, 5)  # 5 features: attendance, avg_score, homework_completion, etc
# Grades between 50 and 100
y_rf = 50 + (X_rf.sum(axis=1) / 5) * 50 + np.random.randn(num_samples) * 3
rf = RandomForestRegressor(n_estimators=50, random_state=42)
rf.fit(X_rf, y_rf)
joblib.dump(rf, OUT_DIR / 'rf_grade_predictor.pkl')
print('Saved RandomForest regressor ->', OUT_DIR / 'rf_grade_predictor.pkl')


















# ----- Naive Bayes: Well Being Analysis -----
# We'll create synthetic text samples labeled as 'positive', 'neutral' or 'negative'
samples = [
    ('I feel great and have enough energy', 'positive'),
    ('I am happy and content', 'positive'),
    ('I feel ok but a bit tired', 'neutral'),
    ('I am stressed due to exams', 'negative'),
    ('I feel overwhelmed and depressed', 'negative'),
    ('I had a good sleep and feel energetic', 'positive'),
]
# Duplicate to create more samples
texts = [t for t, lbl in samples] * 30
labels = [lbl for t, lbl in samples] * 30

vec = TfidfVectorizer()
X_nb = vec.fit_transform(texts)
nb = MultinomialNB()
nb.fit(X_nb, labels)
# Save pipeline
joblib.dump(vec, OUT_DIR / 'nb_tfidf_vectorizer.pkl')
joblib.dump(nb, OUT_DIR / 'nb_wellbeing_classifier.pkl')
print('Saved Naive Bayes model and vectorizer ->', OUT_DIR / 'nb_wellbeing_classifier.pkl')

# ----- BERT-like: T5 text generator for exam paper generation -----
if HAS_TRANSFORMERS:
    print('Transformers available, preparing T5 generator...')
    model_name = 't5-small'
    tokenizer = T5Tokenizer.from_pretrained(model_name)
    model = T5ForConditionalGeneration.from_pretrained(model_name)
    bert_dir = OUT_DIR / 'bert_model'
    bert_dir.mkdir(exist_ok=True)
    model.save_pretrained(bert_dir)
    tokenizer.save_pretrained(bert_dir)
    print('Saved T5 model ->', bert_dir)
else:
    print('Transformers not installed; skipping BERT/T5 model training. You can still train by installing transformers and torch.')

print('All models saved to:', OUT_DIR)
print('Done')
