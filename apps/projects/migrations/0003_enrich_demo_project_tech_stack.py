from django.db import migrations


def enrich_demo_project_tech_stack(apps, schema_editor):
    Project = apps.get_model("projects", "Project")

    updates = {
        "CampusMind AI": ["React", "Django", "PostgreSQL", "OpenAI API", "Celery", "Figma", "UX Research"],
        "PocketLedger": ["Django", "PostgreSQL", "React", "Data Visualization", "Plaid API", "Product Analytics"],
        "HackSprint Takım Koordinatörü": ["Next.js", "Figma", "Supabase", "WebSocket", "Vercel", "UI Design", "Product Strategy"],
        "TrendAI - Sosyal Medya Analitik Platformu": ["Python", "FastAPI", "React", "TensorFlow", "Redis", "PostgreSQL", "Dashboard UX"],
    }

    for title, tech_stack in updates.items():
        Project.objects.filter(title=title).update(tech_stack=tech_stack)


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("projects", "0002_applicationmessage"),
    ]

    operations = [
        migrations.RunPython(enrich_demo_project_tech_stack, noop_reverse),
    ]
