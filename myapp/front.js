import { useMemo, useState } from "react";

const mockItems = [
  { id: 1, name: "在庫管理端末", category: "ハードウェア", owner: "田中", status: "稼働中", value: 420000, updatedAt: "2026-07-15" },
  { id: 2, name: "受注分析レポート", category: "レポート", owner: "佐藤", status: "準備中", value: 180000, updatedAt: "2026-07-14" },
  { id: 3, name: "店舗監視カメラ", category: "設備", owner: "鈴木", status: "停止", value: 95000, updatedAt: "2026-07-10" },
  { id: 4, name: "配送計画ダッシュボード", category: "システム", owner: "高橋", status: "稼働中", value: 560000, updatedAt: "2026-07-16" },
  { id: 5, name: "品質点検タブレット", category: "ハードウェア", owner: "伊藤", status: "稼働中", value: 210000, updatedAt: "2026-07-12" },
];

export default function ItemListPage() {
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const filteredItems = useMemo(() => {
    return mockItems.filter((item) =>
      [item.name, item.category, item.owner].some((v) =>
        v.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [query]);

  const toggleItem = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map((item) => item.id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Operations</p>
            <h1 className="text-3xl font-bold">アイテム一覧</h1>
            <p className="mt-2 text-sm text-slate-500">
              業務向けの一覧画面です。データの確認と選択ができます。
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
            onChange={(e) => setQuery(e.target.value)}
            placeholder="アイテム名、担当者で検索"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>

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
                <th className="px-6 py-4">アイテム名</th>
                <th className="px-6 py-4">カテゴリ</th>
                <th className="px-6 py-4">担当者</th>
                <th className="px-6 py-4">ステータス</th>
                <th className="px-6 py-4 text-right">金額</th>
                <th className="px-6 py-4">更新日</th>
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
                  <td className="px-6 py-4 font-semibold">{item.name}</td>
                  <td className="px-6 py-4">{item.category}</td>
                  <td className="px-6 py-4">{item.owner}</td>
                  <td className="px-6 py-4">{item.status}</td>
                  <td className="px-6 py-4 text-right">¥{item.value.toLocaleString("ja-JP")}</td>
                  <td className="px-6 py-4">{item.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
