# Generated by Django 3.2.13 on 2022-06-16 16:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("polio", "0064_auto_20220615_1326"),
    ]

    operations = [
        migrations.AddField(
            model_name="budgetevent",
            name="is_email_sent",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="budgetevent",
            name="is_finalized",
            field=models.BooleanField(default=False),
        ),
    ]