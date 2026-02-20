---
title: "Testing Django abstract models without cluttering your migrations"
description: "A clean pattern for testing Django abstract model behavior: temporary concrete models, SchemaEditor, and predictable teardown."
publishedAt: 2026-02-19
draft: false
---

Django abstract models are useful for shared behavior: soft delete, timestamps, audit fields. The problem: they don't have tables, so you can't test them with the ORM directly. You need a concrete model.

When I needed tests for a soft-deletion mixin, I solved it with a small custom `TestCase` that dynamically creates a temporary concrete model, creates its table with `SchemaEditor`, and drops it after the test class.

## The pattern: a custom `TestCase`

```python
from django.db import connection
from django.db.models.base import ModelBase
from django.test import TestCase


class AbstractModelMixinTestCase(TestCase):
    mixin = None
    model = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.model = ModelBase(
            "TestModel" + cls.mixin.__name__,
            (cls.mixin,),
            {"__module__": cls.mixin.__module__},
        )

        with connection.schema_editor() as editor:
            editor.create_model(cls.model)

        super().setUpClass()

    @classmethod
    def tearDownClass(cls) -> None:
        super().tearDownClass()

        with connection.schema_editor() as editor:
            editor.delete_model(cls.model)

        connection.close()
```

## Using it for a soft-deletion mixin

Point the base class at your abstract model (or mixin), then test behavior through the dynamically created model:

```python
from common.tests.base import AbstractModelMixinTestCase

from myapp.models import SoftDeletionModel


class SoftDeletionModelTestCase(AbstractModelMixinTestCase):
    mixin = SoftDeletionModel

    def test_soft_delete_instance(self):
        instance = self.model.objects.create()
        instance.delete()
        self.assertIsNotNone(instance.deleted_at)
```

## Notes

- This relies on Django being able to infer the app label from `__module__`, so the mixin should live in an installed app.
- If you hit `doesn't declare an explicit app_label and isn't in an application in INSTALLED_APPS`, set it explicitly (it must be the app _label_, not the module path):

```python
from django.apps import apps

app_config = apps.get_containing_app_config(cls.mixin.__module__)
if app_config is None:
    raise RuntimeError("Mixin module is not in an installed app")


class Meta:
    app_label = app_config.label


cls.model = ModelBase(
    "TestModel" + cls.mixin.__name__,
    (cls.mixin,),
    {"__module__": cls.mixin.__module__, "Meta": Meta},
)
```

## What to test

Test behavior, not internals. If your abstract model provides a manager that hides soft-deleted rows, verify that deleted rows don't show up in `.all()`.

The result is a test suite that treats your abstract model as a real dependency: realistic enough to catch real bugs, and no test-only migrations cluttering your history.
