# API Quiz Backend - Endpoints Documentation

## Overview
Base backend complète pour **Questions** et **Leaderboard** avec une DB MySQL. Endpoints prêts à l'emploi pour gérer les quiz et afficher les classements.

---

## 🎮 QUIZ Endpoints (Player Flow)

### GET /api/quiz/today
**Description:** Récupère un tirage aléatoire de questions pour la session du jour.
**Query params:**
- `limit` (optional, default: 5): Nombre de questions (min: 1, max: 20)

**Response (200):**
```json
[
  {
    "id": 1,
    "content": "Quelle est la capitale de l'Allemagne ?",
    "optionA": "Berlin",
    "optionB": "Munich",
    "optionC": "Hambourg",
    "optionD": "Francfort"
  }
]
```

### POST /api/quiz/submit
**Description:** Soumet les réponses du quiz et enregistre le score dans la base.
**Business Rules:**
- ✅ Un utilisateur ne peut participer qu'une fois par jour (validation DB + service)
- ✅ Le score = nombre de bonnes réponses
- ✅ Retourne 409 si déjà participé aujourd'hui

**Request body:**
```json
{
  "userId": 1,
  "answers": {
    "1": "A",
    "2": "C",
    "3": "D"
  },
  "duration": 120
}
```

**Response (201):**
```json
{
  "score": 3,
  "totalQuestions": 3,
  "correctAnswers": 3,
  "duration": 120
}
```

**Errors:**
- `400`: Invalid userId/answers
- `409`: User has already participated today
- `400`: Question not found

---

## 📊 LEADERBOARD Endpoints

### GET /api/leaderboard
**Description:** Récupère le classement journalier des utilisateurs par score total.
**Query params:**
- `date` (optional, default: today): Format `YYYY-MM-DD`
- `limit` (optional, default: 10): Max 50 utilisateurs

**Response (200):**
```json
{
  "date": "2026-03-23",
  "leaderboard": [
    {
      "rank": 1,
      "userId": 2,
      "userName": "Bob",
      "totalScore": 20,
      "gamesCount": 1
    },
    {
      "rank": 2,
      "userId": 4,
      "userName": "David",
      "totalScore": 18,
      "gamesCount": 1
    }
  ]
}
```

---

## 🔧 QUESTIONS Endpoints (Admin - Gestion)

### GET /api/questions
**Description:** Liste toutes les questions (sans réponses correctes).
**Response (200):** Array de questions avec id, content, options

### GET /api/questions/:id
**Description:** Récupère une question spécifique par ID.
**Response (200):** Question object

### POST /api/questions
**Description:** Crée une nouvelle question.
**Request body:**
```json
{
  "content": "Question text",
  "optionA": "Option A",
  "optionB": "Option B",
  "optionC": "Option C",
  "optionD": "Option D",
  "correctAnswer": "A"
}
```

### PUT /api/questions/:id
**Description:** Met à jour une question existante (partiellement ou complètement).
**Request body:** Même format que POST (tous les champs optionnels)

### DELETE /api/questions/:id
**Description:** Supprime une question.
**Response (204):** No content

---

## 🌱 Mock Data
Au démarrage du serveur, si les tables sont vides, le seed crée automatiquement :
- ✅ 4 utilisateurs: Alice, Bob, Chloe, David
- ✅ 6 questions de quiz général
- ✅ Sessions mock pour aujourd'hui et hier avec des scores variés

**Seed Location:** `backend/src/seed/mock.seed.ts` (idempotent)

---

## 📋 Data Model

### User
- `id` (PK)
- `name` (VARCHAR)

### Question
- `id` (PK)
- `content` (TEXT)
- `option_a, option_b, option_c, option_d` (VARCHAR)
- `correct_answer` (ENUM: A|B|C|D)
- `created_at` (TIMESTAMP)

### QuizSession
- `id` (PK)
- `user_id` (FK → User)
- `date` (DATE) - Unique constraint avec user_id
- `score` (INT)
- `duration` (INT, nullable)
- `completed_at` (TIMESTAMP)

---

## 🚀 Architecture

```
backend/src/
├── feature/
│   ├── quiz/
│   │   ├── quiz.routes.ts
│   │   ├── quiz.controller.ts
│   │   ├── quiz.service.ts
│   │   └── quiz.repository.ts
│   ├── question/
│   │   ├── question.routes.ts
│   │   ├── question.controller.ts
│   │   ├── question.service.ts
│   │   └── question.repository.ts
│   └── leaderboard/
│       ├── leaderboard.routes.ts
│       ├── leaderboard.controller.ts
│       ├── leaderboard.service.ts
│       └── leaderboard.repository.ts
├── entity/
│   ├── User.ts
│   ├── Question.ts
│   └── QuizSession.ts
├── seed/
│   └── mock.seed.ts
├── data-source.ts
└── index.ts
```

---

## ✅ Status
- ✅ Questions CRUD (admin)
- ✅ Quiz joueurs (GET /today + POST /submit avec validation 1x/jour)
- ✅ Leaderboard (agrégation SQL)
- ✅ Seed mock idempotent
- ✅ Entités TypeORM avec relations
- ✅ Auth (à venir)
- ⏳ Frontend integration

