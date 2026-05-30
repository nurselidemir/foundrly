#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate

if [ "${SEED_DEMO_DATA:-false}" = "true" ]; then
  python manage.py seed_demo_data
fi
