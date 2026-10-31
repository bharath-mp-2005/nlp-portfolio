# Natural Language Processing Portfolio

**Course:** CSI4001 – Natural Language Processing and Computational Linguistics  
**Institution:** Vellore Institute of Technology (VIT), Vellore  
**Faculty:** Prof. Dr. Sharmila Banu  
**Student:** Bharath ([@bharath-mp-2005](https://github.com/bharath-mp-2005))  

---

## 📖 Overview

This repository hosts the complete academic and practical portfolio for **CSI4001: Natural Language Processing and Computational Linguistics**. It showcases hands-on computational linguistics theory, algorithmic implementations, interactive web demonstrations, multilingual NLP explorations (Tamil, Malayalam, Hindi, and English), an Android application inspired by in-class concepts, and a complete machine learning research project on **Context-Aware Cyberbullying Detection**.

---

## 🌟 Portfolio Sections & Activities

### 1. Interactive Computational Linguistics Demos
* **Introductory Multilingual Profile:** Exploration of language structures across Tamil (தமிழ்), Malayalam (മലയാളം), Hindi (हिन्दी), and English.
* **Minimum Edit Distance (Levenshtein Distance):**
  * Interactive dynamic programming grid computing insertion, deletion, and substitution costs with traceback path rendering.
  * Includes original handwritten step-by-step mathematical derivation (`img/edit-distance.jpeg`).
* **Viterbi Algorithm (Hidden Markov Model POS Tagging):**
  * Interactive trellis visualization computing the most likely part-of-speech tag sequence for *"killer, crazy, clown, problem"*.
  * Shows forward step-by-step state likelihoods and backpointer decoding.
  * Includes original handwritten trellis calculation (`img/viterbi.jpeg`).
* **Tamil Morphotactics (Finite State Transducer):**
  * Rule-based morpheme ordering for Tamil nouns (`Stem + Plural + Case`), demonstrating morphotactic constraints and grammatical vs. ungrammatical affix permutations using noun stem *வீடு* (veedu).
  * Includes handwritten notes (`img/morphotactics.jpeg`).
* **Translation & Metaphor Analysis:**
  * Semantic transfer and metaphorical mapping of *"His mind is a computer"* across English, Tamil, Malayalam, and Hindi.

---

### 2. Jupyter Notebook Activities
* **Inaugural Addresses Analysis (`31 Jul 2026`):**
  * Lexical diversity, frequency distributions, word clouds, and comparative analysis of 5 US Presidents' speeches using Python and NLTK.
  * Embedded PDF view and downloadable document (`assets/pdf/git-activity-31-07-2026.pdf`).
* **Name Classifier & Bag-of-Words Similarity (`21 Aug 2026`):**
  * Naïve Bayes classification on gender identification via character n-grams and last-letter morphological cues.
  * Bag-of-Words feature extraction and cosine similarity between sentence pairs.
  * Embedded PDF view and downloadable document (`assets/pdf/git-activity-21-08-2026.pdf`).

---

### 3. Vibha Radio (Android Application)
Inspired by **Radio Garden**, which was introduced in class by Prof. Dr. Sharmila Banu, **Vibha Radio** is a custom Android app built to explore live global audio broadcasts:
* **3D Globe Interface:** Spin a 3D Earth globe to discover 685+ global radio stations.
* **Directory & Search:** Browse over 2,500 live stations filtered by country, tag, and language.
* **Regional Favorites:** Quick access to bookmarked regional stations (Tamil AIR, Kodai FM, etc.).
* **APK Distribution:** Downloadable directly from the site via `assets/app/vibha-radio.apk`.

---

### 4. Course Project: Context-Aware Cyberbullying Detection
Traditional cyberbullying detectors analyze isolated messages, frequently misclassifying context-dependent speech, sarcasm, or defensive counter-speech. This project designs a **context-aware detection pipeline** that jointly models the preceding message and the current response.

* **Dataset:** Contextual Abuse Dataset (CAD) by Vidgen et al. (*NAACL 2021*, DOI: [10.5281/zenodo.4881008](https://doi.org/10.5281/zenodo.4881008)), containing 27,494 contextual entries.
* **Label Mapping:** Binary classification mapped into `SAFE` (Neutral, CounterSpeech) and `ABUSIVE` (Explicit / Implicit / Deperson Abuse, Identity-Directed, Affiliation-Directed).
* **Feature Engineering:** TF-IDF with 10,000 maximum features and unigram/bigram ranges (`ngram_range=(1, 2)`).
* **Classification Models:** Balanced Logistic Regression (`class_weight='balanced'`, `C=1.0`, `solver='lbfgs'`).
  * **Baseline Model:** Evaluates current message alone.
  * **Context-Aware Model:** Evaluates combined sequence (`previous_message + " " + current_message`).
* **Multilingual Translation Integration:** Automatic script detection for Tamil (`\u0B80`–`\u0BFF`) and Malayalam (`\u0D00`–`\u0D7F`) with translation into English before tokenization via `deep-translator`.
* **Deliverables Included:**
  * Complete report & design writeup directly on the website.
  * Presentation slides (`assets/project/project-ppt.pdf`).
  * Demonstration video playback (`assets/project/demo-video.mp4`).

---

## 📂 Project Structure

```text
site/
├── assets/
│   ├── app/
│   │   └── vibha-radio.apk          # Android APK package (~53.6 MB)
│   ├── pdf/
│   │   ├── git-activity-31-07-2026.pdf
│   │   └── git-activity-21-08-2026.pdf
│   ├── project/
│   │   ├── demo-video.mp4           # Project demonstration video
│   │   └── project-ppt.pdf          # Presentation slide deck
│   └── vendor/
│       └── pdfjs/                   # Mozilla PDF.js viewer scripts
├── css/
│   └── style.css                    # Responsive custom design system
├── fonts/                           # Self-hosted typography (Bricolage Grotesque, Noto Sans)
├── img/                             # Handwritten notes, screenshots & photography
│   ├── class-photo.jpg
│   ├── edit-distance.jpeg
│   ├── faculty.jpg
│   ├── me.png
│   ├── morphotactics.jpeg
│   ├── presenting.jpg
│   ├── radio-*.jpg
│   └── viterbi.jpeg
├── js/
│   └── main.js                      # Viterbi, Levenshtein, FST & UI interactions
├── index.html                       # Main portfolio single-page application
├── web.config                       # Windows IIS server configuration (MIME & size limits)
└── README.md
```

---

## 🚀 Running & Deployment

### Local Development
Open `index.html` directly in any modern desktop or mobile browser. No build steps, bundlers, or internet connectivity required for the computational demos.

### Hosting on Windows Server / IIS
A pre-configured `web.config` is included in the root directory:
* Registers MIME types for `.apk` (`application/vnd.android.package-archive`), `.woff2`, and `.mp4`.
* Configures IIS `requestFiltering` with `maxAllowedContentLength="104857600"` (100 MB) to ensure seamless delivery of the 53.6 MB Android APK.

---

## 👨‍💻 Author

**Bharath**  
School of Computer Science and Engineering (SCOPE)  
Vellore Institute of Technology (VIT), Vellore  
* **GitHub:** [@bharath-mp-2005](https://github.com/bharath-mp-2005)  
* **LinkedIn:** [Bharath Palanisamy Mettukadai](https://www.linkedin.com/in/bharath-palanisamy-mettukadai-b5000128b/)
