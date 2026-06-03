import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "./AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import { CreditCard, Search } from "lucide-react";

const fmtPKR = (n: number) => `Rs. ${Number(n || 0).toLocaleString("en-PK")}`;

function Transactions() {
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, order_number, created_at, email, phone, payment_method, status, total, subtotal, shipping, discount")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return data ?? [];
    },
  });

  const filtered = useMemo(() => {
    return (orders ?? []).filter((o) => {
      if (methodFilter !== "all" && o.payment_method !== methodFilter) return false;
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          o.order_number?.toLowerCase().includes(s) ||
          o.email?.toLowerCase().includes(s) ||
          o.phone?.toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [orders, search, methodFilter, statusFilter]);

  const totals = useMemo(() => {
    const sum = filtered.reduce((acc, o) => acc + Number(o.total || 0), 0);
    return { count: filtered.length, sum };
  }, [filtered]);

  const methods = useMemo(() => Array.from(new Set((orders ?? []).map((o) => o.payment_method).filter(Boolean))), [orders]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card><CardContent className="pt-6"><div className="text-xs text-muted-foreground">Transactions</div><div className="text-2xl font-bold">{totals.count}</div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-xs text-muted-foreground">Total Volume</div><div className="text-2xl font-bold">{fmtPKR(totals.sum)}</div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-xs text-muted-foreground">Avg Transaction</div><div className="text-2xl font-bold">{fmtPKR(totals.count ? totals.sum / totals.count : 0)}</div></CardContent></Card>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search order #, email, phone" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={methodFilter} onValueChange={setMethodFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Method" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All methods</SelectItem>
            {methods.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="placed">Placed</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4"><Skeleton className="h-64 w-full" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="text-xs">{format(new Date(o.created_at), "MMM d, yyyy HH:mm")}</TableCell>
                    <TableCell className="font-mono text-xs">{o.order_number}</TableCell>
                    <TableCell className="text-xs">{o.email}<div className="text-muted-foreground">{o.phone}</div></TableCell>
                    <TableCell><Badge variant="outline">{o.payment_method}</Badge></TableCell>
                    <TableCell><Badge>{o.status}</Badge></TableCell>
                    <TableCell className="text-right font-semibold">{fmtPKR(Number(o.total))}</TableCell>
                  </TableRow>
                ))}
                {!filtered.length && (
                  <TableRow><TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">No transactions</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function MethodsConfig() {
  const qc = useQueryClient();
  const { data: methods, isLoading } = useQuery({
    queryKey: ["payment-methods"],
    queryFn: async () => {
      const { data, error } = await supabase.from("payment_methods").select("*").order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });

  const update = useMutation({
    mutationFn: async (m: any) => {
      const { error } = await supabase
        .from("payment_methods")
        .update({ name: m.name, description: m.description, instructions: m.instructions, is_enabled: m.is_enabled, sort_order: m.sort_order, config: m.config })
        .eq("id", m.id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Saved"); qc.invalidateQueries({ queryKey: ["payment-methods"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="space-y-4">
      {(methods ?? []).map((m) => (
        <MethodCard key={m.id} method={m} onSave={(next) => update.mutate(next)} saving={update.isPending} />
      ))}
    </div>
  );
}

function MethodCard({ method, onSave, saving }: { method: any; onSave: (m: any) => void; saving: boolean }) {
  const [local, setLocal] = useState(method);
  const dirty = JSON.stringify(local) !== JSON.stringify(method);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-3">
          <div className="grid place-items-center h-10 w-10 rounded-md bg-primary/10 text-primary"><CreditCard className="h-5 w-5" /></div>
          <div>
            <CardTitle className="text-base">{local.name}</CardTitle>
            <div className="text-xs text-muted-foreground font-mono">{local.code}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{local.is_enabled ? "Enabled" : "Disabled"}</span>
          <Switch checked={local.is_enabled} onCheckedChange={(v) => setLocal({ ...local, is_enabled: v })} />
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium">Display name</label>
          <Input value={local.name} onChange={(e) => setLocal({ ...local, name: e.target.value })} />
        </div>
        <div>
          <label className="text-xs font-medium">Sort order</label>
          <Input type="number" value={local.sort_order} onChange={(e) => setLocal({ ...local, sort_order: Number(e.target.value) })} />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-medium">Description (shown at checkout)</label>
          <Input value={local.description ?? ""} onChange={(e) => setLocal({ ...local, description: e.target.value })} />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-medium">Customer instructions</label>
          <Textarea rows={2} value={local.instructions ?? ""} onChange={(e) => setLocal({ ...local, instructions: e.target.value })} />
        </div>
        {(local.code === "bank_transfer" || local.code === "jazzcash" || local.code === "easypaisa") && (
          <>
            <div>
              <label className="text-xs font-medium">Account title</label>
              <Input value={local.config?.account_title ?? ""} onChange={(e) => setLocal({ ...local, config: { ...local.config, account_title: e.target.value } })} />
            </div>
            <div>
              <label className="text-xs font-medium">Account / IBAN / Number</label>
              <Input value={local.config?.account_number ?? ""} onChange={(e) => setLocal({ ...local, config: { ...local.config, account_number: e.target.value } })} />
            </div>
          </>
        )}
        <div className="md:col-span-2 flex justify-end">
          <Button disabled={!dirty || saving} onClick={() => onSave(local)}>Save changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminPayments() {
  return (
    <AdminLayout title="Payments">
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
        </TabsList>
        <TabsContent value="transactions"><Transactions /></TabsContent>
        <TabsContent value="methods"><MethodsConfig /></TabsContent>
      </Tabs>
    </AdminLayout>
  );
}