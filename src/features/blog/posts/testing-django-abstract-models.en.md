---
title: "Testing Django abstract models without cluttering your migrations"
description: "A clean pattern for testing Django abstract model behavior: temporary concrete models, SchemaEditor, and predictable teardown."
publishedAt: 2026-02-19
draft: false
---

Django abstract models are useful for shared behavior: soft delete, timestamps, audit fields. The problem: they don't have tables, so you can't test them with the ORM directly. You need a concrete model.

## The pattern

Create a temporary concrete model for the test run, create its table with `SchemaEditor`, run your tests through the ORM, then drop the table. You get real database behavior without adding test models to your migrations.

Here's a pytest-django version that works well in larger test suites:

```python
import pytest
from django.db import connection, models

from myapp.models import SoftDeleteModel


@pytest.fixture(scope="module")
def concrete_model(django_db_setup, django_db_blocker):
    with django_db_blocker.unblock():

        class ConcreteModel(SoftDeleteModel):
            name = models.CharField(max_length=100)

            class Meta:
                app_label = "myapp"

        with connection.schema_editor() as editor:
            editor.create_model(ConcreteModel)
        yield ConcreteModel
        with connection.schema_editor() as editor:
            editor.delete_model(ConcreteModel)


@pytest.mark.django_db
def test_soft_delete_marks_row(concrete_model):
    obj = concrete_model.objects.create(name="x")
    obj.delete()
    obj.refresh_from_db()
    assert obj.deleted_at is not None
```

Two details to get right:

- `app_label` must point to an installed app.
- Module-scoped fixtures need `django_db_blocker.unblock()` to access the database.

## What to test

Test behavior, not internals. If your abstract model provides a manager that hides soft-deleted rows, verify that deleted rows don't show up in `.all()`. Don't test SQL output or internal ORM details. Those can change without warning.

The result is a test suite that treats your abstract model as a real dependency: fast to run, realistic enough to catch real bugs, and no test-only migrations cluttering your history.
