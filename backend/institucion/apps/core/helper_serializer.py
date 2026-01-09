from rest_framework import serializers
from django.utils.timezone import localtime


class BaseSerializer(serializers.ModelSerializer):

    display = serializers.SerializerMethodField()
    id_display = serializers.SerializerMethodField()

    def get_fields(self):
        fields = super(BaseSerializer, self).get_fields()
        exclude_fields = self.context.get('exclude_fields', [])
        for field in exclude_fields:
            fields.pop(field, None)
        
        return fields

    def get_created_at(self, obj):
        if obj.created_at:
            local_time = localtime(obj.created_at)
            return local_time.strftime('%d/%m/%Y %H:%M:%S')
        return None

    def get_updated_at(self, obj):
        if obj.updated_at:
            local_time = localtime(obj.updated_at)
            return local_time.strftime('%d/%m/%Y %H:%M:%S')
        return None

    def get_display(self, obj):
        return str(obj)

    def get_id_display(self, obj):
        return f"{obj.id} - {str(obj)}"