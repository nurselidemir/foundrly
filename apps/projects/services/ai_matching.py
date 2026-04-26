from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def _join_items(items):
    return " ".join(str(item).strip().lower() for item in items if str(item).strip())


def _build_subject_text(subject_payload):
    return " ".join(
        [
            str(subject_payload.get("title", "")).lower(),
            _join_items(subject_payload.get("skills", [])),
            _join_items(subject_payload.get("interests", [])),
        ]
    ).strip()


def _build_target_text(target_payload):
    return " ".join(
        [
            str(target_payload.get("project_title", "")).lower(),
            str(target_payload.get("summary", "")).lower(),
            _join_items(target_payload.get("tech_stack", [])),
            _join_items(target_payload.get("needed_roles", [])),
        ]
    ).strip()


def _semantic_similarity(subject_payload, target_payload):
    subject_text = _build_subject_text(subject_payload)
    target_text = _build_target_text(target_payload)

    if not subject_text or not target_text:
        return 0.0

    vectorizer = TfidfVectorizer(ngram_range=(1, 2))
    matrix = vectorizer.fit_transform([subject_text, target_text])
    return float(cosine_similarity(matrix[0:1], matrix[1:2])[0][0])


def _label_from_score(score):
    if score >= 75:
        return "High Match"
    if score >= 45:
        return "Medium Match"
    return "Low Match"


def _summary_from_similarity(similarity_score, base_result, target_name):
    if similarity_score >= 0.45:
        return (
            "Profil ve proje ihtiyaclari arasinda guclu anlamsal uyum bulundu. "
            "Teknik eslesmeler pozitif, ancak eksik skill listesi ekip planlamasinda dikkate alinmali."
        )
    if similarity_score >= 0.20:
        return (
            "Profil ile proje arasinda orta seviyede anlamsal uyum bulundu. "
            "Aday belirli alanlarda katkı saglayabilir, ancak uyumun guclenmesi icin eksik beceriler gelistirilmeli."
        )
    return (
        "Eslesme sinirli, ancak profil tamamlayici bir rol ustlenebilir. "
        "Karar verirken eksik teknik alanlar ve rol beklentisi birlikte degerlendirilmeli."
    )


def enrich_match_with_ai(*, base_result, subject_payload, target_payload, target_name):
    similarity = _semantic_similarity(subject_payload, target_payload)
    boosted_score = min(100, int(round((base_result.score * 0.7) + (similarity * 100 * 0.3))))

    return {
        "ai_enabled": True,
        "match_label": _label_from_score(boosted_score),
        "recommended_role": target_name,
        "ai_summary": _summary_from_similarity(similarity, base_result, target_name),
    }
