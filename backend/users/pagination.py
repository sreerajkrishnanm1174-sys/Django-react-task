
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response

# custom creation 

class CustomPagination(LimitOffsetPagination):
    default_limit=2
    max_limit=10

    def get_paginated_response(self, data):
        return Response({
            'total': self.count,
            'limit': self.limit,
            'offset': self.offset,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data
        })