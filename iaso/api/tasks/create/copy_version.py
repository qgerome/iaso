from rest_framework.response import Response

from iaso.tasks.copy_version import copy_version
from iaso.api.tasks import TaskSerializer
from iaso.models import DataSource, SourceVersion, Task, OrgUnit
from rest_framework import viewsets, permissions, serializers
from iaso.api.common import HasPermission
from django.shortcuts import get_object_or_404
import logging

logger = logging.getLogger(__name__)


class CopyVersionSerializer(serializers.Serializer):
    source_source_id = serializers.IntegerField(required=True)
    source_version_number = serializers.IntegerField(required=True)
    destination_source_id = serializers.IntegerField(required=False, default=None)
    destination_version_number = serializers.CharField(max_length=200, required=False, default=None)
    force = serializers.BooleanField(required=False, default=False)

    def validate(self, attrs):

        validated_data = super().validate(attrs)
        request = self.context["request"]
        user = request.user
        account = user.iaso_profile.account

        possible_data_sources = (
            DataSource.objects.filter(projects__in=account.project_set.all()).distinct().values_list("id", flat=True)
        )
        possible_data_sources = list(possible_data_sources)
        force = attrs["force"]
        source_source_id = attrs["source_source_id"]
        destination_source_id = attrs["destination_source_id"]
        source_version = get_object_or_404(
            SourceVersion, data_source_id=source_source_id, number=attrs["source_version_number"]
        )
        try:
            destination_version = SourceVersion.objects.get(
                data_source_id=destination_source_id, number=attrs["destination_version_number"]
            )
        except:
            destination_version = None

        if destination_version and source_version.id == destination_version.id:
            raise serializers.ValidationError("Cannot copy a version to the same version")
        version_count = OrgUnit.objects.filter(version=destination_version).count()
        if version_count > 0 and not force and destination_version is not None:
            raise serializers.ValidationError(
                "This is going to delete %d org units records. Use the force parameter to proceed" % version_count
            )

        if validated_data["source_source_id"] not in possible_data_sources:
            raise serializers.ValidationError("Unauthorized source_source_id")
        if destination_version and validated_data["destination_source_id"] not in possible_data_sources:
            raise serializers.ValidationError("Unauthorized destination_source_id")

        return validated_data


class CopyVersionViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated, HasPermission("menupermissions.iaso_sources")]
    serializer_class = CopyVersionSerializer

    def create(self, request):
        data = request.data
        serializer = CopyVersionSerializer(
            data=request.data,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)

        source_source_id = data["source_source_id"]
        source_version_number = data["source_version_number"]
        destination_source_id = data["destination_source_id"]
        destination_version_number = data["destination_version_number"]

        force = data.get("force", False)
        if not destination_source_id and not destination_version_number:

            versions = list(
                map(lambda x: x.number, list(SourceVersion.objects.filter(data_source_id=source_source_id)))
            )
            versions.sort(reverse=True)
            latest_version = versions[0]

            destination_source_id = source_source_id
            destination_version_number = latest_version + 1

        task = copy_version(
            source_source_id,
            source_version_number,
            destination_source_id,
            destination_version_number,
            force,
            user=request.user,
        )
        return Response({"task": TaskSerializer(instance=task).data})
