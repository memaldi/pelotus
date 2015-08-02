from django.shortcuts import render
from rest_framework.views import APIView
from core.models import TeamInSeason, Team, Season, Player, PlayerBelongsToTeam
from core.serializers import PlayerSerializer
from rest_framework.response import Response


# Create your views here.

class GetPlayersByTeam(APIView):
    def get(self, request, team_id, season_id, position, format=None):
        team = Team.objects.get(id=team_id)
        season = Season.objects.get(id=season_id)
        team_in_season = TeamInSeason.objects.filter(season=season, team=team).first()
        player_belongs_to_team_list = PlayerBelongsToTeam.objects.filter(team_in_season=team_in_season, position=position)
        player_list = []
        for player_belongs_to_team in player_belongs_to_team_list:
            player_list.append(player_belongs_to_team.player)
        serializer = PlayerSerializer(player_list, many=True)
        return Response(serializer.data)
