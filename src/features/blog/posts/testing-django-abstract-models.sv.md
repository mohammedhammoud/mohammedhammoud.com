---
title: "Testa Djangos abstrakta modeller utan att skräpa ner migreringshistoriken"
description: "Ett enkelt mönster för att testa Djangos abstrakta modeller: temporära konkretta modeller, SchemaEditor och städad teardown."
publishedAt: 2026-02-19
draft: false
---

Abstrakta modeller i Django är bra för delat beteende som soft delete, tidsstämplar och audit-fält. Problemet: de har ingen tabell, så du kan inte testa dem direkt via ORM:en. Du behöver en konkret modell.

När jag behövde tester för en soft delete-mixin löste jag det med en liten egen `TestCase` som dynamiskt skapar en temporär konkret modell, skapar tabellen med `SchemaEditor` och tar bort den efter testklassen.

## Mönstret: en egen `TestCase`

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

## Så använder jag den för soft delete

Peka basklassen på din abstrakta modell (eller mixin) och testa beteendet genom den dynamiskt skapade modellen:

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

## Noteringar

- Det här bygger på att Django kan lista ut app-label via `__module__`, så din mixin bör ligga i en installerad app.
- Om du får `doesn't declare an explicit app_label and isn't in an application in INSTALLED_APPS`, sätt den uttryckligen (det måste vara appens _label_, inte modulnamnet):

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

## Vad du ska testa

Testa beteende, inte implementation. Om basmodellen har en manager som döljer soft-deletade rader, se till att de inte dyker upp i `.all()`.

Resultatet är en testsvit som behandlar din abstrakta modell som ett riktigt beroende: tillräckligt realistisk för att fånga riktiga buggar och inga testmigrationer som skräpar ner historiken.
