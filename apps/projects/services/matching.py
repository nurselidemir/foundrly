"""
Foundrly Eşleşme Motoru

Kullanıcı ↔ Proje uyumunu çok katmanlı puanlama ile değerlendirir:
- Beceri / teknoloji örtüşmesi (exact + partial)
- İlgi alanı / rol örtüşmesi (exact + partial)
- Unvan / rol uyumu (exact + partial)
- Verified Talent ve Premium bonus
"""
from dataclasses import dataclass, field

from apps.projects.models import Project
from apps.users.models import User


def _normalize_items(items: list) -> set[str]:
    """Listeyi küçük harfe ve strip'e normalize et."""
    return {str(item).strip().lower() for item in items if str(item).strip()}


def _tokenize(text: str) -> set[str]:
    """Bir metni sözcüklere ayır (kısmî eşleşme için)."""
    return {w.strip().lower() for w in text.replace("/", " ").split() if len(w.strip()) >= 3}


def _partial_overlap(a_items: list, b_items: list) -> list[str]:
    """
    İki liste arasında kısmi sözcük eşleşmesi bul.
    Örn. 'Machine Learning' ↔ 'machine learning engineer' → eşleşir.
    """
    matched = []
    a_norms = _normalize_items(a_items)
    b_norms = _normalize_items(b_items)

    # Exact matches
    exact = a_norms & b_norms
    matched.extend(sorted(exact))

    # Partial / substring matches
    for a in a_norms:
        if a in exact:
            continue
        a_tokens = _tokenize(a)
        for b in b_norms:
            b_tokens = _tokenize(b)
            if a_tokens & b_tokens:
                matched.append(a)
                break

    return list(dict.fromkeys(matched))  # deduplicate, preserve order


def _role_matches_user(user_title: str, needed_roles: list) -> bool:
    """Kullanıcı unvanı, projenin aradığı rollerden biriyle eşleşiyor mu?"""
    title_tokens = _tokenize(user_title)
    for role in needed_roles:
        role_tokens = _tokenize(role)
        if title_tokens & role_tokens:
            return True
    return False


def _interest_matches_roles(user_interests: list, needed_roles: list) -> list[str]:
    """
    Kullanıcı ilgi alanları ile proje rolleri arasında örtüşme bul.
    Örn. interest='backend' ↔ role='Backend Developer' → eşleşir.
    """
    matched = []
    interest_norms = _normalize_items(user_interests)
    for role in needed_roles:
        role_tokens = _tokenize(role)
        for interest in interest_norms:
            interest_tokens = _tokenize(interest)
            if interest_tokens & role_tokens or interest in role.lower():
                matched.append(interest)
                break
    return list(dict.fromkeys(matched))


def _role_aligned_skills(user_skills: list, user_title: str, needed_roles: list) -> list[str]:
    """
    Kullanıcının unvanı aranan rolle örtüşüyorsa, ilgili kullanıcı becerilerini de
    eşleşme çıktısına dahil et. Böylece sadece teknoloji stack'i değil rol sinyali de görünür olur.
    """
    matched = []
    title_tokens = _tokenize(user_title)

    for role in needed_roles:
        role_tokens = _tokenize(role)
        if not role_tokens:
            continue

        role_skill_matches = [skill for skill in user_skills if _tokenize(skill) & role_tokens]
        title_matches_role = bool(title_tokens & role_tokens)

        if role_skill_matches:
            matched.extend(role_skill_matches[:2])
        elif title_matches_role:
            matched.extend(user_skills[:2])

    return list(dict.fromkeys(matched))


@dataclass
class MatchResult:
    score: int
    reasons: list[str]
    matched_skills: list[str]
    matched_interests: list[str]
    missing_skills: list[str]

    @property
    def match_label(self) -> str:
        if self.score >= 70:
            return "High Match"
        if self.score >= 40:
            return "Medium Match"
        return "Low Match"


def score_user_for_project(user: User, project: Project) -> MatchResult:
    """
    Kullanıcının projeye uyumunu 0-100 arasında puanla.

    Puanlama:
    - Beceri/teknoloji eşleşmesi (exact + partial): max 40 puan
    - İlgi alanı/rol eşleşmesi: max 20 puan
    - Unvan rol uyumu: 20 puan
    - Verified Talent: 10 puan
    - Premium kullanıcı: 5 puan
    - Doğrudan rol uyumu (interests): max 5 puan
    """
    user_skills = list(user.skills or [])
    project_stack = list(project.tech_stack or [])
    user_interests = list(user.interests or [])
    project_roles = list(project.needed_roles or [])

    # Beceri eşleşmesi (exact + partial) + rol kaynaklı uzmanlık sinyalleri
    tech_matches = _partial_overlap(user_skills, project_stack)
    role_aligned_skills = _role_aligned_skills(user_skills, user.title or "", project_roles)
    matched_skills = list(dict.fromkeys(tech_matches + role_aligned_skills))
    # Eksik beceriler (projenin istediği ama kullanıcıda olmayanlar)
    exact_user_skills = _normalize_items(user_skills)
    missing_skills = sorted(_normalize_items(project_stack) - exact_user_skills)

    # İlgi alanı eşleşmesi (hem roller hem de genel overlap)
    interest_role_matches = _interest_matches_roles(user_interests, project_roles)
    direct_interest_matches = _partial_overlap(user_interests, project_roles)
    matched_interests = list(dict.fromkeys(interest_role_matches + direct_interest_matches))

    score = 0
    reasons = []

    # Beceri puanı (max 40)
    if matched_skills:
        skill_score = min(len(matched_skills) * 15, 40)
        score += skill_score
        if tech_matches:
            reasons.append(f"Teknik beceriler proje ihtiyaçlarıyla uyumlu ({len(matched_skills)} sinyal).")
        else:
            reasons.append(f"Rol ve uzmanlık sinyalleri proje ihtiyacıyla örtüşüyor ({len(matched_skills)} sinyal).")

    # İlgi alanı / rol puanı (max 20)
    if matched_interests:
        interest_score = min(len(matched_interests) * 10, 20)
        score += interest_score
        reasons.append(f"İlgi alanları proje rolleriyle örtüşüyor ({len(matched_interests)} eşleşme).")

    # Unvan / rol uyumu (20 puan)
    if user.title and _role_matches_user(user.title, project_roles):
        score += 20
        reasons.append("Kullanıcı unvanı projede aranan rolle doğrudan eşleşiyor.")

    # Verified Talent bonusu (10 puan)
    if user.is_verified_talent:
        score += 10
        reasons.append("Verified Talent rozeti güven puanını artırıyor.")

    # Premium bonusu (5 puan)
    if user.is_premium:
        score += 5
        reasons.append("Premium kullanıcı olduğu için görünürlük avantajı var.")

    if not reasons:
        reasons.append("Temel profil uyumu sınırlı, ancak ekipte tamamlayıcı rol oynayabilir.")

    return MatchResult(
        score=min(score, 100),
        reasons=reasons,
        matched_skills=matched_skills,
        matched_interests=matched_interests,
        missing_skills=missing_skills,
    )


def score_project_for_user(project: Project, user: User) -> MatchResult:
    """Kullanıcı için projenin uyumunu hesapla (ters yön)."""
    return score_user_for_project(user, project)
