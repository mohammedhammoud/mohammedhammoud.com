---
title: "Testa Djangos abstrakta modeller utan att skräpa ner migreringshistoriken"
description: "Ett enkelt mönster för att testa Djangos abstrakta modeller: temporära konkretta modeller, SchemaEditor och städad teardown."
publishedAt: 2026-02-19
draft: false
---

Abstrakta modeller i Django är bra för delat beteende som soft delete, tidsstämplar och audit-fält. Problemet: de har ingen tabell, så du kan inte testa dem direkt via ORM:en. Du behöver en konkret modell.

## Mönstret

Skapa en temporär konkret modell för testkörningen, skapa tabellen med `SchemaEditor`, kör testerna via ORM:en och ta sedan bort tabellen. Du får riktigt databasbeteende utan att lägga till testmodeller i dina migreringar.

Här är en pytest-django-variant som fungerar bra i större testsviter:

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

Två saker att ha koll på:

- `app_label` måste peka på en installerad app.
- Fixtures på modulnivå behöver `django_db_blocker.unblock()` för att komma åt databasen.

## Vad du ska testa

Testa beteende, inte implementation. Om basmodellen har en manager som döljer soft-deletade rader, verifiera att de inte dyker upp i `.all()`. Testa inte SQL-utdata eller interna ORM-detaljer. De kan ändras utan förvarning.

Resultatet är en testsvit som behandlar din abstrakta modell som ett riktigt beroende: snabb att köra, tillräckligt realistisk för att fånga riktiga buggar och inga testmigrationer som skräpar ner historiken.
