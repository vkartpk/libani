import { useEffect, useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ShieldCheck, ShieldOff } from "lucide-react";

export default function AdminCustomers() {
  const [list, setList] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const load = async () => {
    const { data, error } = await supabase.rpc("admin_list_customers");
    if (error) toast.error(error.message);
    setList(data || []);
  };
  useEffect(() => { load(); }, []);

  const toggleAdmin = async (userId: string, isAdmin: boolean) => {
    if (isAdmin) {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
      if (error) return toast.error(error.message);
      toast.success("Removed admin");
    } else {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
      if (error) return toast.error(error.message);
      toast.success("Granted admin");
    }
    load();
  };

  const filtered = list.filter((c) => !search || (c.name || "").toLowerCase().includes(search.toLowerCase()) || (c.phone || "").includes(search));

  return (
    <AdminLayout title="Customers">
      <Card className="p-4">
        <div className="flex gap-2 mb-3">
          <Input placeholder="Search by name or phone..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
          <div className="ml-auto text-sm text-muted-foreground self-center">{filtered.length} customers</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground"><tr><th className="py-2">Name</th><th>Phone</th><th>Orders</th><th>Total spent</th><th>Joined</th><th>Admin</th><th></th></tr></thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.user_id} className="border-t">
                  <td className="py-2">{c.name || <span className="text-muted-foreground">—</span>}</td>
                  <td>{c.phone || "—"}</td>
                  <td>{c.order_count}</td>
                  <td>Rs {Number(c.total_spent).toLocaleString()}</td>
                  <td>{new Date(c.created_at).toLocaleDateString()}</td>
                  <td>{c.is_admin ? <span className="text-primary text-xs font-semibold">ADMIN</span> : <span className="text-muted-foreground text-xs">—</span>}</td>
                  <td>
                    <Button size="sm" variant={c.is_admin ? "outline" : "default"} onClick={() => toggleAdmin(c.user_id, c.is_admin)}>
                      {c.is_admin ? (<><ShieldOff className="h-3 w-3 mr-1" /> Revoke</>) : (<><ShieldCheck className="h-3 w-3 mr-1" /> Make admin</>)}
                    </Button>
                  </td>
                </tr>
              ))}
              {!filtered.length && <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">No customers</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminLayout>
  );
}