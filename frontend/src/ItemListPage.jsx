










































































































import { useEffect, useMemo, useState } from 'react'

export default function ItemListPage() {
  const [items, setItems] = useState([])
  const [query, setQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await fetch('/api/items/')
        if (!response.ok) {
          throw new Error('アイテム取得に失敗しました')
        }
        const data = await response.json()
        setItems(Array.isArray(data.items) ? data.items : [])
      } catch (fetchError) {
        setError(fetchError.message)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      [item.name ?? '', item.value != null ? String(item.value) : ''].some((value) =>
        value.toLowerCase().includes(query.toLowerCase())
      )
    )
  }, [items, query])

  const toggleItem = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredItems.map((item) => item.id))
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Operations</p>
            <h1 className="text-3xl font-bold">アイテム一覧</h1>
            <p className="mt-2 text-sm text-slate-500">
              Django API から取得したデータを表示します。
            </p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs text-slate-500">選択中</p>
            <p className="text-2xl font-bold text-blue-600">{selectedIds.length}件</p>
          </div>
        </div>

        <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <label className="mb-2 block text-sm font-semibold text-slate-700">検索</label>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="アイテム名、金額で検索"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {loading && (
          <div className="mb-6 rounded-2xl bg-white p-4 text-sm text-slate-500 shadow-sm ring-1 ring-slate-200">
            読み込み中...
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm text-red-600 shadow-sm ring-1 ring-red-200">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 text-left text-sm font-semibold text-slate-600">
              <tr>
                <th className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={filteredItems.length > 0 && selectedIds.length === filteredItems.length}
                    onChange={toggleAll}
                  />
                </th>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">アイテム名</th>
                <th className="px-6 py-4 text-right">金額</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleItem(item.id)}
                    />
                  </td>
                  <td className="px-6 py-4">{item.id}</td>
                  <td className="px-6 py-4 font-semibold">{item.name}</td>
                  <td className="px-6 py-4 text-right">
                    {item.value != null ? `¥${Number(item.value).toLocaleString('ja-JP')}` : '-'}
                  </td>
                </tr>
              ))}
              {!loading && filteredItems.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-500">
                    表示できるアイテムがありません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
