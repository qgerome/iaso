# Generated by Django 3.2.15 on 2022-09-05 10:32
from django.db import migrations


def assign_campaigns_account(apps, schema_editor):
    """Assigns the existing campaigns to an account

    If there's more than one account in the database, you should set the CAMPAIGNS_DEFAULT_ACCOUNT_ID environment
    variable to point to the account you want to use"""
    Campaign = apps.get_model("polio", "Campaign")
    Account = apps.get_model("iaso", "Account")

    all_accounts = Account.objects.all()
    all_campaigns = Campaign.objects.all()

    if all_campaigns.count() > 0:  # Let's avoid errors in test mode...
        if all_accounts.count() == 1:
            account_to_assign = all_accounts[0]
        else:
            account_to_assign = Account.objects.filter(name="polio").first()
        if not account_to_assign:
            account_to_assign = Account.objects.filter(name="polioTest").first()

        for campaign in all_campaigns:
            campaign.account = account_to_assign
            campaign.save()


class Migration(migrations.Migration):

    dependencies = [
        ("polio", "0074_campaign_account"),
    ]

    operations = [
        migrations.RunPython(assign_campaigns_account),
    ]
