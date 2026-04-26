from dataclasses import dataclass

from apps.projects.models import Project
from apps.users.models import User


def _normalize_items(items):
    return {str(item).strip().lower() for item in items if str(item).strip()}


def _text_matches(title, roles):
    normalized_title = title.strip().lower()
    normalized_roles = _normalize_items(roles)
    return normalized_title in normalized_roles


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
    user_skills = _normalize_items(user.skills)
    project_stack = _normalize_items(project.tech_stack)
    user_interests = _normalize_items(user.interests)
    project_roles = _normalize_items(project.needed_roles)

    matched_skills = sorted(user_skills & project_stack)
    matched_interests = sorted(user_interests & project_roles)
    missing_skills = sorted(project_stack - user_skills)

    score = 0
    reasons = []

    if matched_skills:
        score += min(len(matched_skills) * 20, 40)
        reasons.append("Teknik beceriler proje teknolojileriyle uyumlu.")

    if matched_interests:
        score += min(len(matched_interests) * 10, 20)
        reasons.append("Ilgi alanlari proje ihtiyac duyulan rollerle ortusuyor.")

    if _text_matches(user.title, project.needed_roles):
        score += 20
        reasons.append("Kullanici unvani proje tarafinda aranan rolle eslesiyor.")

    if user.is_verified_talent:
        score += 10
        reasons.append("Verified Talent rozeti guven puanini artiriyor.")

    if user.is_premium:
        score += 5
        reasons.append("Premium kullanici oldugu icin gorunurluk avantaji var.")

    if not reasons:
        reasons.append("Temel profil uyumu sinirli, ancak ekipte tamamlayici rol oynayabilir.")

    return MatchResult(
        score=min(score, 100),
        reasons=reasons,
        matched_skills=matched_skills,
        matched_interests=matched_interests,
        missing_skills=missing_skills,
    )


def score_project_for_user(project: Project, user: User) -> MatchResult:
    return score_user_for_project(user, project)
