# Generated by Django 3.2.13 on 2022-05-03 14:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("polio", "0053_alter_round_campaign"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="round",
            options={"ordering": ["number", "started_at"]},
        ),
    ]
