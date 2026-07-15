import json
from django.http import JsonResponse
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt


# ── ヘルスチェック ──────────────────────────────────────────
def health_check(request):
    """GET /health — サーバーの死活確認"""
    return JsonResponse({'status': 'ok', 'message': 'サーバーは正常に動作しています'})


# ── シンプルな挨拶 ──────────────────────────────────────────
def hello(request):
    """GET /hello?name=<名前> — 挨拶を返す"""
    name = request.GET.get('name', '世界')
    return JsonResponse({'message': f'こんにちは、{name}！'})


# ── アイテム CRUD（インメモリ） ─────────────────────────────
# ※ 実運用では DB を使用してください
_items: dict[int, dict] = {}
_next_id = 1


@method_decorator(csrf_exempt, name='dispatch')
class ItemView(View):
    """
    GET  /items/      — 一覧取得
    POST /items/      — 新規作成  body: {"name": "...", "value": ...}
    GET  /items/<id>/ — 個別取得
    PUT  /items/<id>/ — 更新
    DELETE /items/<id>/ — 削除
    """

    def get(self, request, item_id=None):
        if item_id is None:
            return JsonResponse({'items': list(_items.values())})
        item = _items.get(item_id)
        if item is None:
            return JsonResponse({'error': 'アイテムが見つかりません'}, status=404)
        return JsonResponse(item)

    def post(self, request):
        global _next_id
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': '無効な JSON です'}, status=400)

        item = {'id': _next_id, 'name': data.get('name', ''), 'value': data.get('value')}
        _items[_next_id] = item
        _next_id += 1
        return JsonResponse(item, status=201)

    def put(self, request, item_id=None):
        if item_id is None or item_id not in _items:
            return JsonResponse({'error': 'アイテムが見つかりません'}, status=404)
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': '無効な JSON です'}, status=400)

        _items[item_id].update({
            'name': data.get('name', _items[item_id]['name']),
            'value': data.get('value', _items[item_id]['value']),
        })
        return JsonResponse(_items[item_id])

    def delete(self, request, item_id=None):
        if item_id is None or item_id not in _items:
            return JsonResponse({'error': 'アイテムが見つかりません'}, status=404)
        deleted = _items.pop(item_id)
        return JsonResponse({'deleted': deleted})
